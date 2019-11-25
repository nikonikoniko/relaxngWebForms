/* eslint-disable no-unused-vars */
const {
  get,
  find,
  values,
  first,
  tail,
  compact,
} = require('lodash/fp');

const {
  nodeName,
  isOptionalNode,
  tagName,
  choiceValue,
  inputName,
  firstElementChild,
} = require('../elements.js');

// TODO: replacing all of these with react/jsx components would be incredible
// hyper simple DOM manipulation works for now

const funks = {
  define: (node, inject) =>
    inject.join('<br />')
  ,
  product: (node, inject) =>
    `<h1>omg we have a product</h1><product>${inject.join('<br />')}</product>`
  ,
  element: (node, inject) =>
    `<element>${inject.join('')}</element>`
  ,
  clonable: (name) => {
    return `<button
     type="button"
     class="btn btn-primary"
     onclick="this.parentNode.insertBefore(this.previousSibling.cloneNode(true), this);this.nextSibling.nextSibling.hidden=false"
    >
     add ${name}
    </button>
    <button
     type="button"
     class="btn btn-primary"
     hidden=true
     onclick="this.previousSibling.previousSibling.previousSibling.offsetParent !== null ? this.previousSibling.previousSibling.previousSibling.remove() : ''"
    >
     remove ${name}
    </button>
   ` ;
  },
  oneOrMore: (node, inject) => {
    const n = nodeName(firstElementChild(node));
    return `<span class="oomlabel">one or more of:</span><oneOrMore> ${inject.join('')}${funks.clonable(n)}</oneOrMore>`;
  },
  zeroOrMore: (node, inject) => {
    const n = nodeName(firstElementChild(node));
    return `<span class="zomlabel">zero or more of ${n}: </span><zeroOrMore>${inject.join('')}${funks.clonable(n)}</zeroOrMore>`;
  },
  optional: (node, inject) =>
    `<optional>${inject.join('<br />')}</optional>`
  ,
  text: (node, inject) => {
    const opt = isOptionalNode(node.parentNode.parentNode);
    return `<textarea class='form-control' ${!opt ? 'required' : ''} name='${inputName(node)}'>${inject.join('<br />')}</textarea>`;
  },
  ref: (node, inject) => {
    const refFor = nodeName(node);
    const dom = node.ownerDocument;
    const defs = values(dom.getElementsByTagName('define'));
    const definition = find(x => get('attributes.0.value', x) === refFor, defs);
    if (!definition) return `<h5>REF NOT FOUND FOR ${refFor}</h5>`;
    const {parseSchema} = require('./index.js'); // eslint-disable-line
    // the above require must be there otherwise there is a circular
    // dependency.  since the whole lib is recursive by nature, we need it.
    return `<ref> <h4>${refFor}</h4> <br /> ${parseSchema(definition)} </ref>`;
  },
  input: (node, inject) => {
    const opt = isOptionalNode(node.parentNode.parentNode);
    return `<input type='text' required=${!opt} class='form-control'>${inject.join('<br />')}</input>`;
  },
  decimal: (node, inject) =>
    `<input class='form-control' name=opacity type=number min=0 max=1 step=0.01></input>${inject.join('')}`
  ,
  int: (node, inject) =>
    `<input type=number class='form-control'>${inject.join('')}</input>`
  ,
  list: (node, inject) =>
    `<select class='form-control'>${inject.join('<br />')}</select>`
  ,
  choice: (node, inject) =>
    inject.join('/n')
  ,
  value: (node, inject) => {
    const choiceVal = choiceValue(node);
    return `<option value='${choiceVal}'>${choiceVal}</option>`;
  },
  boolean: (node, inject) => {
    return `<input type=checkbox checked=checked>`;
  },
  namedElement: (node, inject) => {
    const elname = nodeName(node);
    const opt = isOptionalNode(node.parentNode);
    return `<element name='${elname}'><label>${elname}${!opt ? '*' : ''}</label>${inject.join('')}</element>`;
  },
  attribute: (node, inject) => {
    const elname = nodeName(node);
    const opt = isOptionalNode(node.parentNode);
    return `<attribute name="${elname}"><label>${elname}${!opt ? '*' : ''}</label>${inject.join('')}</attribute>`;
  },
  default: (node, inject) => {
    console.log(node);
    console.log(node.tagName);
    console.error(`above node element "${node.tagName}" NOT FOUND in definitions!!!!`);
    return `?${node.tagName}?${inject.join('')}`;
  },
};

module.exports = funks;
