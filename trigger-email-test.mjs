// One-time trigger to manually send drip email to test contact
import { getStore } from '@netlify/blobs';
import fs from 'fs';

const TEST_EMAIL = 'neginr1@yahoo.com';

// Read sequences
const emailData = JSON.parse(fs.readFileSync('./netlify/functions/email-data.js', 'utf-8')
  .replace(/module\.exports = \{/, '{')
  .replace(/\};$/, '}')
);

// Get base template
const getBaseTemplate = () => {
  return fs.readFileSync('./netlify/functions/email-templates/base-template.html', 'utf-8');
};

// Render email
function renderEmail(bodyContent, subject, unsubscribeToken) {
  let template = getBaseTemplate();

  template = template.replace('{{SUBJECT}}', subject);
  template = template.replace('{{BODY_CONTENT}}', bodyContent);
  template = template.replace('{{PHYSICAL_ADDRESS}}', '1615 Mater Dei Drive, Chula Vista, CA 91913');
  template = template.replace('{{UNSUBSCRIBE_LINK}}', `https://neginrajaipourmd.com/unsubscribe?token=${unsubscribeToken}`);

  return template;
}

async function sendTestEmail() {
  try {
    console.log(`\nManually triggering email for ${TEST_EMAIL}...\n`);

    // Decode NETLIFY_BLOBS_CONTEXT
    if (!process.env.NETLIFY_BLOBS_CONTEXT) {
      console.error('❌ NETLIFY_BLOBS_CONTEXT not available');
      console.log('This script must run via: netlify dev or netlify functions:serve');
      process.exit(1);
    }

    const blobsContext = JSON.parse(
      Buffer.from(process.env.NETLIFY_BLOBS_CONTEXT, 'base64').toString('utf-8')
    );

    const contactsStore = getStore({
      name: 'contacts',
      ...blobsContext
    });

    // Get contact
    console.log('Fetching contact...');
    const contactJson = await contactsStore.get(TEST_EMAIL);
    const contact = JSON.parse(contactJson);

    console.log(`Contact: ${contact.name} (${contact.email})`);
    console.log(`Current email index: ${contact.currentEmailIndex}`);
    console.log(`Subscribed: ${contact.subscribed}`);

    if (!contact.subscribed) {
      console.log('❌ Contact is unsubscribed');
      return;
    }

    // Get sequence (hardcoded to advisory for now)
    const sequence = JSON.parse(fs.readFileSync('./netlify/functions/email-templates/sequences/advisory.json', 'utf-8'));

    if (contact.currentEmailIndex >= sequence.length) {
      console.log('✅ All emails already sent');
      return;
    }

    // Get next email
    const nextEmail = sequence[contact.currentEmailIndex];
    console.log(`\nSending email: "${nextEmail.subject}"`);

    const html = renderEmail(
      nextEmail.body,
      nextEmail.subject,
      contact.unsubscribeToken
    );

    // Send via send-email function
    console.log('Calling send-email function...');
    const response = await fetch('https://neginrajaipourmd.netlify.app/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: contact.email,
        subject: nextEmail.subject,
        html,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Send failed:', error);
      return;
    }

    console.log('✅ Email sent!');

    // Update contact
    contact.currentEmailIndex++;
    contact.lastEmailSent = new Date().toISOString();
    await contactsStore.set(contact.email, JSON.stringify(contact));

    console.log(`✅ Contact updated - next email index: ${contact.currentEmailIndex}`);
    console.log(`\nCheck ${TEST_EMAIL} for the email!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

sendTestEmail();
