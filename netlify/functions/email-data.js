const { readFileSync } = require('fs');
const { join } = require('path');

// Load email sequences at build time
const advisorySequence = JSON.parse(
  readFileSync(join(__dirname, 'email-templates/sequences/advisory.json'), 'utf-8')
);

const baseTemplate = readFileSync(
  join(__dirname, 'email-templates/base.html'), 'utf-8'
);

const sequences = {
  'advisory': advisorySequence
};

function getBaseTemplate() {
  return baseTemplate;
}

module.exports = {
  sequences,
  getBaseTemplate
};
