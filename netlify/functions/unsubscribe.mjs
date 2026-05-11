import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Invalid unsubscribe link', { status: 400 });
  }

  try {
    // Decode email from token
    const email = Buffer.from(token, 'base64').toString('utf-8');

    // Decode NETLIFY_BLOBS_CONTEXT (base64 encoded JSON)
    const blobsContext = JSON.parse(
      Buffer.from(process.env.NETLIFY_BLOBS_CONTEXT, 'base64').toString('utf-8')
    );
    const contactsStore = getStore({
      name: 'contacts',
      ...blobsContext
    });

    const contactData = await contactsStore.get(email);

    if (!contactData) {
      return new Response('Email not found', { status: 404 });
    }

    const contact = JSON.parse(contactData);
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
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            max-width: 600px;
            margin: 100px auto;
            padding: 40px;
            text-align: center;
            color: #1A1A1A;
          }
        </style>
      </head>
      <body>
        <h1>Error</h1>
        <p>There was an error processing your unsubscribe request. Please contact office@neginrajaipourmd.com for assistance.</p>
      </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
