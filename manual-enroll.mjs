// Manual enrollment script for backfilling contacts
import { getStore } from '@netlify/blobs';

const contacts = [
  {
    firstName: 'Victoria',
    email: 'victoriaaverillfnp@gmail.com',
    phone: '727-798-5999',
    organization: 'Victoria Averill FNP LLC',
    role: 'Owner',
    inquiryType: 'other',
    timeline: '2-week',
    message: 'FNP inquiry - manually enrolled'
  },
  {
    firstName: 'Negin',
    email: 'neginr1@yahoo.com',
    phone: '555-TEST',
    organization: 'Test Enrollment',
    role: 'Testing',
    inquiryType: 'healthcare-practice',
    timeline: '1-month',
    message: 'Testing drip system - manually enrolled'
  }
];

async function enrollContacts() {
  try {
    console.log('Decoding NETLIFY_BLOBS_CONTEXT...');
    const blobsContext = JSON.parse(
      Buffer.from(process.env.NETLIFY_BLOBS_CONTEXT, 'base64').toString('utf-8')
    );

    console.log('Connecting to contacts store...');
    const contactsStore = getStore({
      name: 'contacts',
      ...blobsContext
    });

    const timestamp = new Date().toISOString();

    for (const contact of contacts) {
      const { firstName, email, phone, organization, role, inquiryType, timeline, message } = contact;

      console.log(`\nEnrolling: ${firstName} (${email})`);

      const unsubscribeToken = Buffer.from(email).toString('base64');

      const contactData = {
        email,
        name: firstName,
        phone,
        organization,
        role,
        inquiryType,
        timeline,
        message,
        source: 'manual-enrollment',
        sequenceType: 'advisory',
        enrolledAt: timestamp,
        currentEmailIndex: 0, // Start at 0 - will receive first email when scheduled function runs
        subscribed: true,
        unsubscribeToken,
        lastEmailSent: timestamp
      };

      await contactsStore.set(email, JSON.stringify(contactData));
      console.log(`✅ ${email} enrolled successfully`);
    }

    console.log('\n✅ All contacts enrolled!');
    console.log('\nTo verify:');
    console.log('npx netlify blobs:list contacts');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

enrollContacts();
