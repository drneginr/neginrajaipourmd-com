// Get Resend domain details and DNS records
export default async (req, context) => {
  try {
    //Get domain ID first by listing all domains
    const listResponse = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    });

    const domains = await listResponse.json();
    const neginDomain = domains.data?.find(d => d.name === 'neginrajaipourmd.com');

    if (!neginDomain) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Domain not found',
        allDomains: domains
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get full domain details
    const detailResponse = await fetch(`https://api.resend.com/domains/${neginDomain.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    });

    const details = await detailResponse.json();

    return new Response(JSON.stringify({
      success: true,
      domain: details
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
  path: '/get-resend-domain'
};
