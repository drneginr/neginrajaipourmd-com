// Verify Resend domain
export default async (req, context) => {
  try {
    const response = await fetch('https://api.resend.com/domains/6da77eb8-8715-4b4e-976c-8f3d1ccc5e10/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
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
  path: '/verify-resend-domain'
};
