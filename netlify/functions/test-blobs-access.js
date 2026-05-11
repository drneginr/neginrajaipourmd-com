// Simple test function to diagnose Blobs access in production

const { getStore, getDeployStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  const logs = [];

  try {
    logs.push('Testing Netlify Blobs access...');
    logs.push(`Event: ${Object.keys(event).join(', ')}`);
    logs.push(`Context: ${Object.keys(context || {}).join(', ')}`);

    // Try getDeployStore (should auto-configure from environment)
    logs.push('Calling getDeployStore...');
    const testStore = getDeployStore({
      name: 'contacts'
    });
    logs.push('✅ getDeployStore() succeeded');

    // Try to write
    logs.push('Attempting write...');
    await testStore.set('diagnostic-test', JSON.stringify({
      timestamp: new Date().toISOString(),
      test: 'success'
    }));
    logs.push('✅ Write succeeded');

    // Try to read
    logs.push('Attempting read...');
    const result = await testStore.get('diagnostic-test');
    logs.push(`✅ Read succeeded: ${result}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        logs,
        message: 'Blobs is working!'
      })
    };

  } catch (error) {
    logs.push(`❌ Error: ${error.message}`);
    logs.push(`Error name: ${error.name}`);
    logs.push(`Error stack: ${error.stack}`);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        logs,
        error: error.message,
        errorName: error.name,
        errorStack: error.stack
      })
    };
  }
};
