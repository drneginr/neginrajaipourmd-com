const { Resend } = require('resend');
const { getStore } = require('@netlify/blobs');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { to, subject, html, contactData } = await req.json();

    // Send email via Resend
    const data = await resend.emails.send({
      from: 'Dr. Negin Rajaipour, MD <office@neginrajaipourmd.com>',
      to: [to],
      subject: subject,
      html: html,
    });

    // Store contact data if provided
    if (contactData) {
      const contactsStore = getStore('contacts');
      const timestamp = new Date().toISOString();

      await contactsStore.set(contactData.email, JSON.stringify({
        ...contactData,
        createdAt: timestamp,
        lastEmailSent: timestamp,
      }));
    }

    return new Response(JSON.stringify({
      success: true,
      messageId: data.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Email send error:', error);
    console.error('Send email error details:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    });
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
