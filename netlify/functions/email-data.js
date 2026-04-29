import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const functionDir = (() => {
  try {
    return eval('__dirname');
  } catch {
    return dirname(fileURLToPath(import.meta.url));
  }
})();

// Load email sequences at build time
const advisorySequence = JSON.parse(
  readFileSync(join(functionDir, 'email-templates/sequences/advisory.json'), 'utf-8')
);

const baseTemplate = readFileSync(
  join(functionDir, 'email-templates/base.html'), 'utf-8'
);

export const sequences = {
  'advisory': advisorySequence
};

export function getBaseTemplate() {
  return baseTemplate;
}
