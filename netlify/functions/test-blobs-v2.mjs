// Test Netlify Blobs with Functions 2.0 format
import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const logs = [];

  try {
    logs.push('Testing Netlify Blobs (Functions 2.0)...');
    logs.push(`context keys: ${Object.keys(context).join(', ')}`);
    logs.push(`context.store exists: ${!!context.store}`);
    logs.push(`context.site: ${JSON.stringify(context.site)}`);
    logs.push(`context.deploy: ${JSON.stringify(context.deploy)}`);

    // Check all NETLIFY env vars
    const netlifyEnvs = Object.keys(process.env).filter(k => k.includes('NETLIFY') || k.includes('BLOB'));
    logs.push(`Netlify/Blob env vars: ${netlifyEnvs.join(', ') || 'none'}`);

    // Try using context.store
    if (context.store) {
      logs.push('Using context.store...');
      const testStore = context.store({ name: 'contacts', consistency: 'strong' });
      logs.push('✅ context.store() succeeded');

      // Try to write
      logs.push('Attempting write...');
      await testStore.set('test-key', 'test-value');
      logs.push('✅ Write succeeded');

      // Try to read
      logs.push('Attempting read...');
      const result = await testStore.get('test-key');
      logs.push(`✅ Read succeeded: ${result}`);
    } else {
      logs.push('❌ context.store not available');
    }

    return new Response(JSON.stringify({
      success: true,
      logs,
      message: 'Blobs is working!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logs.push(`❌ Error: ${error.message}`);
    logs.push(`Error name: ${error.name}`);

    return new Response(JSON.stringify({
      success: false,
      logs,
      error: error.message,
      errorName: error.name
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/test-blobs-v2'
};
