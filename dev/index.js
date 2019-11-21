/* global hljs */
const {
  each,
  reduce,
  tail,
} = require('lodash/fp');


const {schema2form, form2xml} = require('../src/parsers');
const {convert} = require('../src/parsers/schema/createDom');

const example = `<start>
<element name="book" xmlns="http://relaxng.org/ns/structure/1.0">
   <oneOrMore>
      <element name="page">
          <element name="number">
            <text/>
          </element>
         <optional>
           <element name="text">
              <text/>
           </element>
         </optional>
      </element>
      <element name="page">
          <element name="number">
            <text/>
          </element>
         <element name="text">
            <text/>
         </element>
      </element>
   </oneOrMore>
   <zeroOrMore>
      <element name="author">
        <text/>
      </element>
    </zeroOrMore>
</element>
</start>
`;
const r = schema2form(convert(example));

const schema = document.getElementById('schema');
const xmlForm = document.getElementById('xmlForm');
const result = document.getElementById('result');

const form = document.querySelector('#form');



const prettyXml = (xml) => {
  const Prism = require('prismjs');
  const Normalizer = require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
  const format = require('xml-formatter');
  const indented = format(xml);
  console.log(indented);
  const high = Prism.highlight(indented, Prism.languages.xml, 'xml');
  const nw = new Normalizer({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    'break-lines': 80,
    'indent': 0,
    'remove-initial-line-feed': true,
    'tabs-to-spaces': 4,
  });
  const normalized = nw.normalize(high, {
	  // Extra settings
  });
  return normalized;
};

form.addEventListener('change', (e) => {
  form.checkValidity();
  form.reportValidity();
  form.submit();
  const xml = form2xml(form);
  result.innerHTML = prettyXml(xml);
});


schema.value = example;
xmlForm.innerHTML = r;

schema.onkeyup = function(e) {
  const newschema = e.target.value;
  const r = schema2form(convert(newschema));
  xmlForm.innerHTML = r;
};
