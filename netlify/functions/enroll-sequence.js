import { getStore } from '@netlify/blobs';
import { sequences, getBaseTemplate } from './email-data.js';

// Render email with base template
async function renderEmail(bodyContent, subject, unsubscribeToken) {
  let template = getBaseTemplate();

  template = template.replace('{{SUBJECT}}', subject);
  template = template.replace('{{BODY_CONTENT}}', bodyContent);
  template = template.replace('{{PHYSICAL_ADDRESS}}', process.env.BUSINESS_ADDRESS || '1615 Mater Dei Drive, Chula Vista, CA 91913');
  template = template.replace('{{UNSUBSCRIBE_LINK}}', `https://neginrajaipourmd.com/unsubscribe?token=${unsubscribeToken}`);

  return template;
}

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await req.formData();
    const email = formData.get('email');
    const name = formData.get('name') || '';
    const source = formData.get('source') || 'private-inquiry';

    if (!email) {
      return new Response('Email required', { status: 400 });
    }

    // Store contact in database
    const contactsStore = getStore('contacts');
    const timestamp = new Date().toISOString();
    const unsubscribeToken = Buffer.from(email).toString('base64');

    const contactData = {
      email,
      name,
      source,
      sequenceType: 'advisory',
      enrolledAt: timestamp,
      currentEmailIndex: 0,
      subscribed: true,
      unsubscribeToken
    };

    await contactsStore.set(email, JSON.stringify(contactData));

    // Send immediate welcome email
    const sequenceData = sequences['advisory'];
    const firstEmail = sequenceData[0];

    const html = await renderEmail(firstEmail.body, firstEmail.subject, unsubscribeToken);

    // Call send-email function
    await fetch(`${new URL(req.url).origin}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: firstEmail.subject,
        html,
      })
    });

    // Update contact to reflect first email sent
    contactData.currentEmailIndex = 1;
    contactData.lastEmailSent = timestamp;
    await contactsStore.set(email, JSON.stringify(contactData));

    // Redirect to thank you page
    return Response.redirect('https://neginrajaipourmd.com/thank-you.html', 302);

  } catch (error) {
    console.error('Enrollment error:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};

export const config = {
  path: '/api/enroll-sequence'
};
