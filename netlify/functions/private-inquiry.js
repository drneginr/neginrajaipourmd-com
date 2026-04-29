import { Resend } from 'resend';
import { getStore } from '@netlify/blobs';
import { sequences, getBaseTemplate } from './email-data.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Render email with base template
async function renderEmail(bodyContent, subject, unsubscribeToken) {
  let template = getBaseTemplate();

  template = template.replace('{{SUBJECT}}', subject);
  template = template.replace('{{BODY_CONTENT}}', bodyContent);
  template = template.replace('{{PHYSICAL_ADDRESS}}', process.env.BUSINESS_ADDRESS || '1615 Mater Dei Drive, Chula Vista, CA 91913');
  template = template.replace('{{UNSUBSCRIBE_LINK}}', `https://neginrajaipourmd.com/unsubscribe?token=${unsubscribeToken}`);

  return template;
}

export default async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
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
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Enroll in email sequence
    const contactsStore = getStore('contacts');
    const timestamp = new Date().toISOString();
    const unsubscribeToken = Buffer.from(email).toString('base64');

    const contactData = {
      email,
      name: firstName,
      phone,
      organization,
      role,
      inquiryType,
      timeline,
      message: message || '',
      source: 'private-inquiry',
      sequenceType: 'advisory',
      enrolledAt: timestamp,
      currentEmailIndex: 0,
      subscribed: true,
      unsubscribeToken
    };

    await contactsStore.set(email, JSON.stringify(contactData));

    // Send immediate welcome email (Email 1 of sequence)
    const sequenceData = sequences['advisory'];
    const firstEmail = sequenceData[0];
    const html = await renderEmail(firstEmail.body, firstEmail.subject, unsubscribeToken);

    await resend.emails.send({
      from: 'Dr. Negin Rajaipour, MD <hello@neginrajaipourmd.com>',
      to: email,
      subject: firstEmail.subject,
      html: html,
    });

    // Update contact to reflect first email sent
    contactData.currentEmailIndex = 1;
    contactData.lastEmailSent = timestamp;
    await contactsStore.set(email, JSON.stringify(contactData));

    // Send notification email to Dr. Rajaipour
    await resend.emails.send({
      from: 'Private Inquiry <inquiries@neginrajaipourmd.com>',
      to: 'nrajaipour@gmail.com',
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

        ${message ? `<p><strong>Additional Details:</strong><br>${message}</p>` : ''}

        <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 0.9rem; color: #666;">Submitted from neginrajaipourmd.com<br>Contact enrolled in advisory email sequence.</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Inquiry submitted successfully' }),
    };

  } catch (error) {
    console.error('Error processing inquiry:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process inquiry', details: error.message }),
    };
  }
};

export const config = {
  path: '/api/private-inquiry'
};
