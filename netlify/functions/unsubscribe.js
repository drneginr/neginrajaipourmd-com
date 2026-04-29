import { getStore } from '@netlify/blobs';

export default async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Invalid unsubscribe link', { status: 400 });
  }

  try {
    // Decode email from token
    const email = Buffer.from(token, 'base64').toString('utf-8');

    // Update contact subscription status
    const contactsStore = getStore('contacts');
    const contactJson = await contactsStore.get(email);

    if (!contactJson) {
      return new Response('Email not found', { status: 404 });
    }

    const contact = JSON.parse(contactJson);
    contact.subscribed = false;
    contact.unsubscribedAt = new Date().toISOString();

    await contactsStore.set(email, JSON.stringify(contact));

    // Return simple HTML page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            max-width: 600px;
            margin: 100px auto;
            padding: 40px;
            text-align: center;
            color: #1A1A1A;
          }
          h1 { font-size: 2rem; margin-bottom: 1rem; }
          p { font-size: 1.125rem; color: #666666; line-height: 1.7; }
        </style>
      </head>
      <body>
        <h1>You've been unsubscribed</h1>
        <p>You won't receive any more emails from this sequence.</p>
        <p style="margin-top: 2rem;">If this was a mistake, please reply to any previous email and let me know.</p>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response('Error processing unsubscribe', { status: 500 });
  }
};

export const config = {
  path: '/unsubscribe'
};
