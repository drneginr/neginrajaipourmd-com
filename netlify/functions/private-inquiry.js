import { Resend } from 'resend';
import { getStore } from '@netlify/blobs';

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

    // EMAIL A: Admin notification to office@neginrajaipourmd.com
    console.log('Sending inquiry admin notification to office@neginrajaipourmd.com');
    try {
      await resend.emails.send({
        from: 'Private Inquiry <office@neginrajaipourmd.com>',
        to: 'office@neginrajaipourmd.com',
        reply_to: email,
        subject: `New Private Inquiry — ${firstName} — ${inquiryType}`,
        html: `
          <h2 style="color: #1A1A1A; margin-bottom: 1.5rem;">New Private Inquiry Received</h2>

          <p><strong>From:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Organization:</strong> ${organization}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Nature of Inquiry:</strong> ${inquiryType}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>

          ${message ? `<p><strong>Additional Details:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}

          <p style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
            Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT
          </p>
        `,
      });
      console.log('Inquiry admin notification sent successfully');
    } catch (adminError) {
      console.error('Failed to send inquiry admin notification:', adminError);
      // Don't fail the whole function if admin notification fails
    }

    // EMAIL B: User confirmation
    console.log(`Sending inquiry confirmation to user: ${email}`);
    try {
      await resend.emails.send({
        from: 'Dr. Negin Rajaipour <office@neginrajaipourmd.com>',
        to: email,
        subject: 'Your inquiry has been received',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">Dear ${firstName},</p>

            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
              Thank you for reaching out. Your inquiry has been received and will be reviewed personally within two business days.
            </p>

            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
              All correspondence is treated as confidential.
            </p>

            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A; margin-top: 2rem;">
              — Dr. Negin Rajaipour, MD<br>
              <span style="color: #666; font-size: 0.95rem;">office@neginrajaipourmd.com</span>
            </p>
          </div>
        `,
      });
      console.log('Inquiry user confirmation sent successfully');
    } catch (userError) {
      console.error('Failed to send inquiry user confirmation:', userError);
      // Don't fail if user confirmation fails - admin notification is more critical
    }

    // Enroll in advisory email sequence
    console.log(`Enrolling ${email} in advisory sequence`);
    try {
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
        currentEmailIndex: 1, // Start at index 1 since we already sent confirmation (index 0)
        subscribed: true,
        unsubscribeToken,
        lastEmailSent: timestamp
      };

      await contactsStore.set(email, JSON.stringify(contactData));
      console.log('Contact enrolled in advisory sequence successfully');
    } catch (enrollError) {
      console.error('Failed to enroll in sequence:', enrollError);
      // Don't fail the whole function if enrollment fails
    }

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
