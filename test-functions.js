#!/usr/bin/env node
/**
 * Test script to verify all Netlify functions can be loaded and have correct structure
 */

const path = require('path');
const fs = require('fs');

console.log('Testing Netlify Functions...\n');

const functionsDir = path.join(__dirname, 'netlify', 'functions');
const testResults = [];

// Test function files
const functionFiles = [
  'diagnostic-pdf.js',
  'email-data.js',
  'enroll-sequence.js',
  'private-inquiry.js',
  'send-email.js',
  'unsubscribe.js',
  'scheduled/process-sequences.js'
];

functionFiles.forEach(file => {
  const filePath = path.join(functionsDir, file);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      testResults.push({ file, status: 'FAIL', error: 'File not found' });
      return;
    }

    // Try to require the file
    const func = require(filePath);

    // Check if it has a handler or is a data export
    const isDataExport = file.includes('email-data');

    if (isDataExport) {
      // email-data.js should export sequences and getBaseTemplate
      if (typeof func.sequences !== 'object') {
        testResults.push({ file, status: 'FAIL', error: 'Missing sequences export' });
        return;
      }
      if (typeof func.getBaseTemplate !== 'function') {
        testResults.push({ file, status: 'FAIL', error: 'Missing getBaseTemplate export' });
        return;
      }
    } else {
      // Other files should have handler function
      if (typeof func.handler !== 'function') {
        testResults.push({ file, status: 'FAIL', error: 'Missing handler export' });
        return;
      }
    }

    testResults.push({ file, status: 'PASS' });

  } catch (error) {
    testResults.push({ file, status: 'FAIL', error: error.message });
  }
});

// Print results
console.log('Function Load Tests:');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

testResults.forEach(result => {
  const status = result.status === 'PASS' ? '✓' : '✗';
  const color = result.status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';

  console.log(`${color}${status}${reset} ${result.file.padEnd(40)} ${result.status}`);

  if (result.error) {
    console.log(`  Error: ${result.error}`);
  }

  if (result.status === 'PASS') passed++;
  else failed++;
});

console.log('='.repeat(70));
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

// Verify CommonJS module system
console.log('Module System Check:');
console.log('='.repeat(70));

functionFiles.forEach(file => {
  const filePath = path.join(functionsDir, file);

  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const hasImport = content.includes('import ') && content.includes(' from ');
  const hasRequire = content.includes('require(');
  const hasExportDefault = content.includes('export default');
  const hasExportsHandler = content.includes('exports.handler');
  const hasModuleExports = content.includes('module.exports');

  if (hasImport || hasExportDefault) {
    console.log(`\x1b[31m✗\x1b[0m ${file.padEnd(40)} Uses ES modules (should be CommonJS)`);
  } else if (hasRequire && (hasExportsHandler || hasModuleExports)) {
    console.log(`\x1b[32m✓\x1b[0m ${file.padEnd(40)} CommonJS`);
  } else {
    console.log(`\x1b[33m?\x1b[0m ${file.padEnd(40)} Unknown module system`);
  }
});

console.log('='.repeat(70));

// Exit with error code if any tests failed
process.exit(failed > 0 ? 1 : 0);
