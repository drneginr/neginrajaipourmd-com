// Temporary function to manually trigger test email
import { Resend } from 'resend';
import { getStore } from '@netlify/blobs';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, context) => {
  const logs = [];

  try {
    const TEST_EMAIL = 'admin@mye3method.com'; // Using account owner email for sandbox
    logs.push(`Triggering test email for ${TEST_EMAIL}`);

    // Get contact from Blobs
    const blobsContext = JSON.parse(
      Buffer.from(process.env.NETLIFY_BLOBS_CONTEXT, 'base64').toString('utf-8')
    );
    const contactsStore = getStore({
      name: 'contacts',
      ...blobsContext
    });

    const contactData = await contactsStore.get(TEST_EMAIL);
    logs.push(`Raw data type: ${typeof contactData}`);
    logs.push(`Raw data preview: ${contactData?.substring?.(0, 100) || contactData}`);

    const contact = typeof contactData === 'string' ? JSON.parse(contactData) : contactData;
    logs.push(`Contact: ${contact.name}, index: ${contact.currentEmailIndex}`);

    // Read advisory sequence
    const sequenceModule = await import('./email-data.js');
    const sequence = sequenceModule.sequences.advisory;

    if (contact.currentEmailIndex >= sequence.length) {
      return new Response(JSON.stringify({
        success: false,
        logs,
        message: 'All emails already sent'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const nextEmail = sequence[contact.currentEmailIndex];
    logs.push(`Sending: "${nextEmail.subject}"`);

    // Render email with base template
    const baseTemplate = sequenceModule.getBaseTemplate();
    let html = baseTemplate
      .replace('{{SUBJECT}}', nextEmail.subject)
      .replace('{{BODY_CONTENT}}', nextEmail.body)
      .replace('{{PHYSICAL_ADDRESS}}', '1615 Mater Dei Drive, Chula Vista, CA 91913')
      .replace('{{UNSUBSCRIBE_LINK}}', `https://neginrajaipourmd.com/unsubscribe?token=${contact.unsubscribeToken}`);

    // Send email - using sandbox to account owner
    const emailResult = await resend.emails.send({
      from: 'Dr. Negin Rajaipour <onboarding@resend.dev>',
      to: contact.email,
      subject: nextEmail.subject,
      html
    });

    logs.push('✅ Email sent via Resend');
    logs.push(`Resend response: ${JSON.stringify(emailResult)}`);

    // Update contact
    contact.currentEmailIndex++;
    contact.lastEmailSent = new Date().toISOString();
    await contactsStore.set(contact.email, JSON.stringify(contact));

    logs.push(`✅ Contact updated - next index: ${contact.currentEmailIndex}`);

    return new Response(JSON.stringify({
      success: true,
      logs,
      message: `Email sent to ${TEST_EMAIL}`,
      emailSent: nextEmail.subject
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logs.push(`❌ Error: ${error.message}`);
    return new Response(JSON.stringify({
      success: false,
      logs,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/trigger-test-email'
};
