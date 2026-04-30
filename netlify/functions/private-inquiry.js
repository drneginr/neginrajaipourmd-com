import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { firstName, email, phone, organization, role, inquiryType, timeline, message } = data;

    // Validate required fields
    if (!firstName || !email || !phone || !organization || !role || !inquiryType || !timeline) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Send notification email to office@neginrajaipourmd.com
    await resend.emails.send({
      from: 'Private Inquiry <office@neginrajaipourmd.com>',
      to: 'office@neginrajaipourmd.com',
      reply_to: email,
      subject: `New Private Inquiry: ${inquiryType}`,
      html: `
        <h2>New Private Inquiry Received</h2>

        <p><strong>From:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Nature of Inquiry:</strong> ${inquiryType}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>

        ${message ? `<p><strong>Additional Details:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}

        <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">Submitted from neginrajaipourmd.com</p>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Inquiry submitted successfully' }),
    };

  } catch (error) {
    console.error('Error processing inquiry:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process inquiry',
        details: error.message,
        hint: 'Please ensure Resend API key is configured in Netlify environment variables'
      }),
    };
  }
};

export const config = {
  path: '/api/private-inquiry'
};
