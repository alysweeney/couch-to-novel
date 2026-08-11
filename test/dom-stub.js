// Minimal DOM good enough to execute the render functions. The point is not
// fidelity -- it's that every template literal actually gets evaluated, which
// is where temporal-dead-zone errors, undefined variables and null property
// reads live. Parsing cannot reach any of them.
function stubEl() {
  var e = {
    innerHTML: '', textContent: '', value: '', hidden: false, disabled: false,
    scrollTop: 0, files: [],
    style: {}, dataset: {},
    classList: { add: function(){}, remove: function(){}, toggle: function(){}, contains: function(){ return false; } },
    addEventListener: function(){}, removeEventListener: function(){},
    appendChild: function(){}, remove: function(){}, click: function(){}, focus: function(){},
    setAttribute: function(){}, getAttribute: function(){ return ''; },
    querySelector: function(){ return stubEl(); },
    querySelectorAll: function(){ return []; },
  };
  return e;
}
var document = {
  createElement: function(tag) {
    var el = stubEl();
    if (tag === 'template') el.content = { get firstElementChild() { return stubEl(); } };
    return el;
  },
  getElementById: function(){ return stubEl(); },
  querySelector: function(){ return stubEl(); },
  querySelectorAll: function(){ return []; },
  documentElement: stubEl(),
  body: stubEl(),
};
var window = { showDirectoryPicker: undefined, addEventListener: function(){}, removeEventListener: function(){} };
var localStorage = { getItem: function(){ return null; }, setItem: function(){}, };
var navigator = {};
var location = { hash: '#/today' };
function getComputedStyle(){ return { backgroundColor: 'rgb(47,95,99)' }; }
function confirm(){ return true; }
function alert(){}
var Blob = function(){}; var URL = { createObjectURL: function(){ return ''; }, revokeObjectURL: function(){} };
var Cloud = {}; var Scriv = { isSupported: function(){ return false; } };
