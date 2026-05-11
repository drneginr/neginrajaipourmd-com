#!/usr/bin/env node
// Test Netlify Blobs access from CLI

const { getStore } = require('@netlify/blobs');

async function testBlobs() {
  try {
    console.log('Testing Netlify Blobs access...\n');

    // This will fail locally without proper config, but shows what's needed
    const contactsStore = getStore({
      name: 'contacts',
      siteID: '8039b94c-e1de-4c21-8b1a-b6724d1693e4',
    });

    const testData = {
      email: 'cli-test@example.com',
      name: 'CLI Test',
      enrolledAt: new Date().toISOString(),
      source: 'cli-test'
    };

    await contactsStore.set('cli-test@example.com', JSON.stringify(testData));
    console.log('✅ Successfully wrote to Blobs');

    const result = await contactsStore.get('cli-test@example.com');
    console.log('✅ Successfully read from Blobs');
    console.log('Data:', JSON.parse(result));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

testBlobs();
