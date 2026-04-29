import { getStore } from '@netlify/blobs';
import { sequences, getBaseTemplate } from '../email-data.js';

// Render email with base template
async function renderEmail(bodyContent, subject, unsubscribeToken) {
  let template = getBaseTemplate();

  template = template.replace('{{SUBJECT}}', subject);
  template = template.replace('{{BODY_CONTENT}}', bodyContent);
  template = template.replace('{{PHYSICAL_ADDRESS}}', process.env.BUSINESS_ADDRESS || '1615 Mater Dei Drive, Chula Vista, CA 91913');
  template = template.replace('{{UNSUBSCRIBE_LINK}}', `https://neginrajaipourmd.com/unsubscribe?token=${unsubscribeToken}`);

  return template;
}

export default async () => {
  console.log('Processing email sequences...');

  try {
    const contactsStore = getStore('contacts');
    const { blobs } = await contactsStore.list();

    let processed = 0;
    let sent = 0;

    for (const blob of blobs) {
      const contactJson = await contactsStore.get(blob.key);
      const contact = JSON.parse(contactJson);

      // Skip unsubscribed contacts
      if (!contact.subscribed) continue;

      processed++;

      // Get sequence
      const sequence = sequences[contact.sequenceType];
      if (!sequence) {
        console.log(`Unknown sequence type: ${contact.sequenceType}`);
        continue;
      }

      // Check if all emails sent
      if (contact.currentEmailIndex >= sequence.length) {
        continue;
      }

      // Calculate days enrolled
      const enrolledDate = new Date(contact.enrolledAt);
      const now = new Date();
      const daysEnrolled = Math.floor((now - enrolledDate) / (1000 * 60 * 60 * 24));

      // Get next email
      const nextEmail = sequence[contact.currentEmailIndex];

      // Check if it's time to send
      if (daysEnrolled >= nextEmail.dayOffset) {
        console.log(`Sending email ${contact.currentEmailIndex + 1} to ${contact.email}`);

        const html = await renderEmail(
          nextEmail.body,
          nextEmail.subject,
          contact.unsubscribeToken
        );

        // Send email
        await fetch('https://neginrajaipourmd.com/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: contact.email,
            subject: nextEmail.subject,
            html,
          })
        });

        // Update contact
        contact.currentEmailIndex++;
        contact.lastEmailSent = new Date().toISOString();
        await contactsStore.set(contact.email, JSON.stringify(contact));

        sent++;
      }
    }

    console.log(`Processed ${processed} contacts, sent ${sent} emails`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        processed,
        sent
      })
    };

  } catch (error) {
    console.error('Sequence processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

export const config = {
  schedule: '@daily'
};
