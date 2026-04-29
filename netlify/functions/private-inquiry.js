const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
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

    // Add contact to Resend audience (if AUDIENCE_ID is provided)
    if (process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email: email,
          firstName: firstName,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (contactError) {
        console.error('Contact creation error:', contactError);
        // Continue even if contact creation fails (might already exist)
      }
    }

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
        <p style="font-size: 0.9rem; color: #666;">Submitted from neginrajaipourmd.com</p>
      `,
    });

    // Send confirmation email to the inquirer
    await resend.emails.send({
      from: 'Dr. Negin Rajaipour <hello@neginrajaipourmd.com>',
      to: email,
      subject: 'Thank you for your inquiry',
      html: `
        <div style="font-family: 'Cormorant Garamond', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
          <h1 style="color: #C9A35E; font-size: 2rem; margin-bottom: 1.5rem;">Thank You for Reaching Out</h1>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">Dear ${firstName},</p>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
            Thank you for your inquiry regarding <strong>${inquiryType}</strong>. I have received your message and will review it carefully.
          </p>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
            I typically respond to all inquiries within 48 hours. In the meantime, feel free to explore additional resources on my website.
          </p>

          <div style="margin: 2.5rem 0; padding: 1.5rem; background: #F5F1EA; border-left: 4px solid #C9A35E;">
            <p style="font-style: italic; color: #555; margin: 0;">
              "Strategic clarity for those who lead at the edge."
            </p>
          </div>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
            Best regards,<br>
            <strong>Dr. Negin Rajaipour, MD</strong><br>
            <span style="color: #666; font-size: 0.95rem;">Founder & CEO, VitaRegen Medical™</span>
          </p>

          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">

          <p style="font-size: 0.85rem; color: #888; line-height: 1.5;">
            © 2026 VitaRegen Medical™. All Rights Reserved.<br>
            This email is for advisory and informational purposes only.
          </p>
        </div>
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
