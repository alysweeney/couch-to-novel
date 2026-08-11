// Read-only Scrivener sync.
//
// A .scriv project is a folder, not a file: an XML index (<name>.scrivx) that
// describes the binder, plus Files/Data/<UUID>/content.rtf holding each
// document's text. We read both, count the words in the Draft folder only, and
// never write anything back. Scrivener remains the sole owner of the
// manuscript; this app only ever looks.
//
// Scoping to the Draft folder matters more than it sounds. Scrivener's Novel
// template ships with Front Matter (title page, copyright, dedication),
// Characters, Places, Research and Template Sheets -- all of them prose, none
// of them the novel. They sit outside the DraftFolder in the binder, so
// inheriting from Type="DraftFolder" excludes them structurally rather than by
// maintaining a list of folder names to skip, which would rot the first time a
// folder got renamed.
//
// Browser support: the File System Access API is Chrome/Edge desktop only.
// Safari and Firefox have no equivalent, so those fall back to manual logging.

const DB_NAME = 'couch-to-novel';
const STORE = 'handles';
const HANDLE_KEY = 'scrivProject';

export function isSupported() {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
}

// --- Handle persistence (IndexedDB; handles can't go in localStorage) ---

function idb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key, value) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(key) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getStoredHandle() {
  try {
    return (await idbGet(HANDLE_KEY)) || null;
  } catch (err) {
    console.warn('Could not read stored project handle', err);
    return null;
  }
}

export async function disconnect() {
  await idbDelete(HANDLE_KEY);
}

// Browsers drop file permission between sessions; this re-requests it without
// making you re-pick the folder.
export async function ensurePermission(handle) {
  const opts = { mode: 'read' };
  if ((await handle.queryPermission(opts)) === 'granted') return true;
  return (await handle.requestPermission(opts)) === 'granted';
}

export async function connectProject() {
  const handle = await window.showDirectoryPicker({ id: 'scriv', mode: 'read' });
  if (!handle.name.endsWith('.scriv')) {
    throw new Error(`That folder is "${handle.name}". Pick the .scriv folder itself, not the folder containing it.`);
  }
  await idbPut(HANDLE_KEY, handle);
  return handle;
}

// --- RTF text extraction ---
// Not a full RTF parser and does not need to be: we only want a word count, so
// anything that resolves to visible text is enough. Dropping the metadata
// destinations (font tables, colour tables, stylesheets, comments) matters most
// -- left in, they add hundreds of phantom words per document.

const SKIP_DESTINATIONS = /^(fonttbl|colortbl|stylesheet|info|pict|object|themedata|colorschememapping|latentstyles|datastore|xmlnstbl|listtable|listoverridetable|rsidtbl|generator|nonshppict)/;

// \'xx escapes are in the document's codepage, not Latin-1, and Scrivener
// writes cp1252. The two agree everywhere except 0x80-0x9F -- which is exactly
// where curly quotes, en and em dashes and ellipses live, so without this map
// every smart quote in the manuscript comes out as a control character.
const CP1252_HIGH = {
  0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„', 0x85: '…',
  0x86: '†', 0x87: '‡', 0x88: 'ˆ', 0x89: '‰', 0x8a: 'Š',
  0x8b: '‹', 0x8c: 'Œ', 0x8e: 'Ž', 0x91: '‘', 0x92: '’',
  0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—',
  0x98: '˜', 0x99: '™', 0x9a: 'š', 0x9b: '›', 0x9c: 'œ',
  0x9e: 'ž', 0x9f: 'Ÿ',
};

function decodeByte(code) {
  if (code >= 0x80 && code <= 0x9f) return CP1252_HIGH[code] || '';
  return String.fromCharCode(code);
}

export function extractRtfText(rtf) {
  let out = '';
  let i = 0;
  const skipDepth = [];
  let depth = 0;
  let uc = 1; // how many characters follow \uN as a fallback for old readers

  while (i < rtf.length) {
    const ch = rtf[i];

    if (ch === '{') {
      depth++;
      i++;
      continue;
    }
    if (ch === '}') {
      if (skipDepth.length && skipDepth[skipDepth.length - 1] === depth) skipDepth.pop();
      depth--;
      i++;
      continue;
    }
    if (ch === '\\') {
      // Escaped literal characters
      if (/[\\{}]/.test(rtf[i + 1])) {
        if (!skipDepth.length) out += rtf[i + 1];
        i += 2;
        continue;
      }
      // Hex escape \'xx
      if (rtf[i + 1] === "'") {
        if (!skipDepth.length) {
          const code = parseInt(rtf.substr(i + 2, 2), 16);
          if (!isNaN(code)) out += decodeByte(code);
        }
        i += 4;
        continue;
      }
      // Ignorable destination \*\foo -- skip the whole group
      if (rtf[i + 1] === '*') {
        skipDepth.push(depth);
        i += 2;
        continue;
      }
      // Control word: \word, optional numeric parameter, optional single space
      const m = /^\\([a-zA-Z]+)(-?\d+)? ?/.exec(rtf.slice(i));
      if (m) {
        const word = m[1];
        if (word === 'uc') {
          const n = parseInt(m[2], 10);
          if (!isNaN(n)) uc = Math.max(0, n);
          i += m[0].length;
          continue;
        }
        if (SKIP_DESTINATIONS.test(word)) skipDepth.push(depth);
        else if (word === 'u') {
          const code = parseInt(m[2], 10);
          if (!skipDepth.length && !isNaN(code)) out += String.fromCharCode(code < 0 ? code + 65536 : code);
          i += m[0].length;
          // A \uN is followed by uc fallback characters for readers that can't
          // handle unicode. Leaving them in turns every em dash into an extra
          // "?" token and inflates the word count.
          let skipped = 0;
          while (skipped < uc && i < rtf.length) {
            if (rtf[i] === '\\' && rtf[i + 1] === "'") i += 4;
            else if (rtf[i] === '{' || rtf[i] === '}') break;
            else i += 1;
            skipped++;
          }
          continue;
        } else if (!skipDepth.length) {
          if (word === 'par' || word === 'line' || word === 'sect' || word === 'page' || word === 'tab') out += '\n';
        }
        i += m[0].length;
        continue;
      }
      i++;
      continue;
    }

    if (!skipDepth.length) out += ch;
    i++;
  }
  return out;
}

export function countWords(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}

// --- Binder parsing ---

// Walks the binder and returns the documents that are inside the DraftFolder,
// honouring Scrivener's "Include in Compile" flag so a parked scene left in the
// manuscript folder doesn't inflate the count.
export function draftDocuments(scrivxText) {
  const doc = new DOMParser().parseFromString(scrivxText, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Could not read the .scrivx index -- the project may be open and mid-save. Close Scrivener and try again.');

  const found = [];
  const walk = (node, inDraft, path) => {
    Array.from(node.children)
      .filter((el) => el.tagName === 'BinderItem')
      .forEach((item) => {
        const type = item.getAttribute('Type') || '';
        const id = item.getAttribute('UUID') || item.getAttribute('ID') || '';
        const titleEl = Array.from(item.children).find((c) => c.tagName === 'Title');
        const title = titleEl ? titleEl.textContent : 'Untitled';
        const isDraft = inDraft || type === 'DraftFolder';

        if (isDraft && type === 'Text') {
          const meta = Array.from(item.children).find((c) => c.tagName === 'MetaData');
          const inc = meta && Array.from(meta.children).find((c) => c.tagName === 'IncludeInCompile');
          const included = !inc || inc.textContent.trim().toLowerCase() !== 'no';
          if (included) found.push({ id, title, path: path.concat([title]).join(' › ') });
        }

        const kids = Array.from(item.children).find((c) => c.tagName === 'Children');
        if (kids) walk(kids, isDraft, isDraft ? path.concat([title]) : path);
      });
  };

  const binder = doc.querySelector('Binder');
  if (!binder) throw new Error('No binder found in the .scrivx index.');
  walk(binder, false, []);
  return found;
}

// --- Sync ---

export async function syncFromHandle(handle) {
  if (!(await ensurePermission(handle))) {
    throw new Error('Permission to read the project folder was declined.');
  }

  let scrivxText = null;
  for await (const [name, entry] of handle.entries()) {
    if (entry.kind === 'file' && name.endsWith('.scrivx')) {
      scrivxText = await (await entry.getFile()).text();
      break;
    }
  }
  if (!scrivxText) throw new Error('No .scrivx index in that folder. Is it really a Scrivener project?');

  const docs = draftDocuments(scrivxText);

  let dataDir;
  try {
    dataDir = await (await handle.getDirectoryHandle('Files')).getDirectoryHandle('Data');
  } catch (err) {
    throw new Error('No Files/Data folder -- this may be a Scrivener 2 project, which uses a different layout.');
  }

  const documents = [];
  for (const d of docs) {
    let words = 0;
    try {
      const dir = await dataDir.getDirectoryHandle(d.id);
      const file = await (await dir.getFileHandle('content.rtf')).getFile();
      words = countWords(extractRtfText(await file.text()));
    } catch (err) {
      // A document with no content.rtf simply hasn't been written in yet.
      words = 0;
    }
    documents.push({ ...d, words });
  }

  return {
    projectName: handle.name,
    syncedAt: new Date().toISOString(),
    total: documents.reduce((s, d) => s + d.words, 0),
    documents,
  };
}
