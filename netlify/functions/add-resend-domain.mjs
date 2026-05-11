// Add domain to Resend
export default async (req, context) => {
  try {
    const response = await fetch('https://api.resend.com/domains', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'neginrajaipourmd.com',
        region: 'us-east-1'
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/add-resend-domain'
};
