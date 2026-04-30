const { Resend } = require('resend');
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

const resend = new Resend(process.env.RESEND_API_KEY);

// Constraint definitions (matching frontend)
const constraints = {
  demand: {
    name: "Demand Generation",
    tagline: "You need more of the right patients/clients",
    description: "Your practice has capacity, your team (if you have one) is ready, but your pipeline is inconsistent. The constraint isn't your ability to deliver—it's attracting enough of the right people.",
    symptoms: [
      "Feast-or-famine revenue cycles",
      "Relying heavily on referrals or word-of-mouth",
      "Unclear or inconsistent marketing message",
      "Schedule has gaps you wish were filled"
    ],
    solution: "Focus on positioning, messaging, and systematic lead generation. Your offer is ready—your market just doesn't know about it yet.",
    nextSteps: [
      "Clarify your unique positioning in the market",
      "Build a repeatable lead generation system",
      "Create authority content that attracts ideal patients"
    ],
    strategicQuestions: [
      "Who is your ideal patient, specifically?",
      "What makes your approach different from other providers?",
      "Where does your ideal patient go for information before they find you?"
    ]
  },
  capacity: {
    name: "Capacity",
    tagline: "You're maxed out and can't take on more",
    description: "Demand isn't the problem—you have patients who want to see you. The constraint is your time, energy, or physical ability to serve more people without burning out.",
    symptoms: [
      "Fully booked schedule with waitlists",
      "Working nights and weekends regularly",
      "Turning away new patients",
      "Physical or mental exhaustion"
    ],
    solution: "You need leverage: systems, team, or a new service delivery model that doesn't require more of your time per patient.",
    nextSteps: [
      "Explore group programs or leveraged delivery models",
      "Build a team or delegate non-clinical work",
      "Increase prices to reduce volume while maintaining revenue"
    ],
    strategicQuestions: [
      "What would it look like to serve 3x more patients with the same time investment?",
      "Which parts of your current delivery model could be delegated or systematized?",
      "What's the highest-leverage use of your clinical expertise?"
    ]
  },
  monetization: {
    name: "Monetization",
    tagline: "Revenue doesn't match effort or value",
    description: "You're busy, maybe even at capacity, but the numbers don't reflect the value you create or the effort you're putting in. The constraint is how you're packaging and pricing your expertise.",
    symptoms: [
      "Lots of activity but thin profit margins",
      "Underpricing compared to the transformation delivered",
      "Fear of raising prices or 'losing patients'",
      "Revenue growth plateaus despite more volume"
    ],
    solution: "Realign pricing with value, restructure offers, or shift to higher-margin services. More patients isn't the answer—better monetization is.",
    nextSteps: [
      "Audit current pricing against market and value delivered",
      "Design premium or cash-pay service tiers",
      "Test pricing increases with clear value communication"
    ],
    strategicQuestions: [
      "What's the long-term outcome your patients achieve worth to them?",
      "If you could only serve 20 patients, what would you charge?",
      "What would a premium version of your service include?"
    ]
  },
  team: {
    name: "Team & Delegation",
    tagline: "You can't scale because you can't delegate",
    description: "You have demand, and you want to grow capacity, but your team isn't ready, reliable, or capable of executing without you. The constraint is human capital.",
    symptoms: [
      "You're still the bottleneck even with a team",
      "High turnover or performance issues",
      "Afraid to delegate because 'it's faster if I do it'",
      "Team lacks training, clarity, or ownership"
    ],
    solution: "Invest in hiring, training, systems, and culture. You can't scale if everything runs through you.",
    nextSteps: [
      "Document processes so they're trainable",
      "Hire for roles that free up your time for high-value work",
      "Build a culture of ownership and accountability"
    ],
    strategicQuestions: [
      "What would need to be true for you to take a 2-week vacation without checking in?",
      "What's the most important hire you could make in the next 90 days?",
      "Which tasks on your plate should never have been yours to begin with?"
    ]
  },
  systems: {
    name: "Operational Systems",
    tagline: "Everything breaks when you're not looking",
    description: "You have patients, maybe even a team, but operations are chaotic. Nothing is documented, processes are inconsistent, and you're constantly firefighting. The constraint is operational infrastructure.",
    symptoms: [
      "Constantly putting out fires",
      "No standard operating procedures",
      "Team asks you for direction on everything",
      "Patient experience is inconsistent"
    ],
    solution: "Build repeatable systems and processes. Growth without systems creates chaos, not leverage.",
    nextSteps: [
      "Document your top 3 recurring processes",
      "Implement practice management tools/software",
      "Create checklists and SOPs for common tasks"
    ],
    strategicQuestions: [
      "What recurring problem would disappear if you had a system for it?",
      "What does a new team member need to know that only exists in your head?",
      "What would make your practice run smoothly without you for a week?"
    ]
  },
  positioning: {
    name: "Positioning & Pricing",
    tagline: "You're not differentiated in the market",
    description: "You're competent, maybe even excellent, but you sound like everyone else. The constraint isn't your skills—it's how you're positioned in the minds of your ideal patients.",
    symptoms: [
      "Competing primarily on price or convenience",
      "Difficulty explaining what makes you different",
      "Attracting price-sensitive or wrong-fit patients",
      "Feeling like a commodity"
    ],
    solution: "Clarify your unique point of view, ideal patient, and the specific transformation you create. Own a position in the market.",
    nextSteps: [
      "Define your unique methodology or approach",
      "Identify and speak to a specific ideal patient",
      "Build authority through content and thought leadership"
    ],
    strategicQuestions: [
      "What do you believe about your field that most providers don't?",
      "What type of patient do you get the best results with?",
      "If you could only be known for ONE thing, what would it be?"
    ]
  }
};

// Generate PDF buffer
function generatePDF(firstName, constraintType) {
  return new Promise((resolve, reject) => {
    const constraint = constraints[constraintType];
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // PAGE 1: Results & Analysis
    // Header
    doc.fontSize(10).fillColor('#C9A35E').text('PRACTICE CONSTRAINT ANALYSIS', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(24).fillColor('#1A1A1A').text(`${firstName}'s Constraint Analysis`, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor('#555').text('Prepared by Dr. Negin Rajaipour, MD', { align: 'center' });
    doc.moveDown(2);

    // Primary Constraint Badge
    doc.roundedRect(50, doc.y, 512, 60, 5).fillAndStroke('#C9A35E', '#C9A35E');
    doc.fontSize(20).fillColor('#1A1A1A').text(constraint.name, 50, doc.y + 20, { width: 512, align: 'center' });

    doc.moveDown(4);

    // Tagline
    doc.fontSize(16).fillColor('#C9A35E').text(constraint.tagline);
    doc.moveDown(0.5);

    // Description
    doc.fontSize(11).fillColor('#1A1A1A').text(constraint.description, { align: 'justify', lineGap: 4 });
    doc.moveDown(1.5);

    // What This Means
    doc.fontSize(14).fillColor('#C9A35E').text('What This Means for Your Practice');
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#1A1A1A').text(constraint.solution, { align: 'justify', lineGap: 4 });
    doc.moveDown(1.5);

    // Common Symptoms
    doc.fontSize(14).fillColor('#C9A35E').text('Common Symptoms');
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#1A1A1A');
    constraint.symptoms.forEach(symptom => {
      doc.text(`• ${symptom}`, { indent: 10, lineGap: 3 });
    });

    // PAGE 2: Action Plan
    doc.addPage();

    doc.fontSize(18).fillColor('#C9A35E').text('Your Action Plan', { align: 'center' });
    doc.moveDown(1.2);

    // Next Steps
    doc.fontSize(14).fillColor('#C9A35E').text('Immediate Next Steps');
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor('#1A1A1A');
    constraint.nextSteps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step}`, { indent: 10, lineGap: 5 });
    });
    doc.moveDown(1.2);

    // Strategic Questions
    doc.fontSize(14).fillColor('#C9A35E').text('Strategic Questions to Consider');
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor('#1A1A1A');
    constraint.strategicQuestions.forEach(question => {
      doc.text(`• ${question}`, { indent: 10, lineGap: 5 });
    });
    doc.moveDown(1.5);

    // Next Steps Box
    doc.roundedRect(50, doc.y, 512, 110, 5).stroke('#C9A35E');
    doc.moveDown(0.4);
    doc.fontSize(14).fillColor('#C9A35E').text('Ready for a Deeper Conversation?', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#1A1A1A').text(
      `This diagnostic identifies your primary constraint. The next step is understanding the specific context, hidden dependencies, and strategic leverage points unique to your practice.\n\nI work with physician owners and healthcare executives to design growth strategies grounded in operational clarity and sustainable execution.`,
      { align: 'center', lineGap: 3 }
    );
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor('#C9A35E').text('→ Schedule a conversation: neginrajaipourmd.com/private-inquiry', { align: 'center' });
    doc.moveDown(2);

    // Horizontal divider above footer
    doc.moveTo(150, doc.y).lineTo(462, doc.y).stroke('#E5E5E5');
    doc.moveDown(0.8);

    // Footer at end of page 2 content
    doc.fontSize(8).fillColor('#888').text(
      '© 2026 Negin Rajaipour, MD',
      { align: 'center' }
    );

    doc.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { firstName, email, result } = JSON.parse(event.body);

    if (!firstName || !email || !result || !result.constraint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(firstName, result.constraint);
    const pdfBase64 = pdfBuffer.toString('base64');

    // EMAIL A: Admin notification to office@neginrajaipourmd.com
    console.log('Sending admin notification to office@neginrajaipourmd.com');
    try {
      await resend.emails.send({
        from: 'Practice Diagnostic <office@neginrajaipourmd.com>',
        to: 'office@neginrajaipourmd.com',
        subject: `New Diagnostic — ${firstName} — ${constraints[result.constraint].name}`,
        html: `
          <h2 style="color: #1A1A1A; margin-bottom: 1.5rem;">New Practice Diagnostic Submission</h2>

          <p style="margin: 0.5rem 0;"><strong>Submitter:</strong> ${firstName}</p>
          <p style="margin: 0.5rem 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0.5rem 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })} PT</p>

          <p style="margin: 1.5rem 0 0.5rem 0;"><strong>Primary Constraint:</strong> ${constraints[result.constraint].name}</p>

          <h3 style="margin-top: 2rem; color: #1A1A1A;">Pattern Distribution</h3>
          <ul style="line-height: 1.8;">
            ${Object.entries(result.patternCounts || {})
              .sort((a, b) => b[1] - a[1]) // Sort by score descending
              .map(([key, value]) => {
              const patternNames = {
                demand: 'Demand Generation',
                capacity: 'Capacity',
                positioning: 'Positioning & Pricing',
                monetization: 'Monetization',
                team: 'Team & Delegation',
                systems: 'Operational Systems'
              };
              const maxScores = {
                demand: 9,
                capacity: 9,
                monetization: 7,
                team: 6,
                systems: 4,
                positioning: 4
              };
              const isPrimary = key === result.constraint;
              const label = patternNames[key] || key;
              const marker = isPrimary ? ' ← <strong style="color: #A8854B;">PRIMARY</strong>' : '';
              return `<li><strong>${label}:</strong> ${value}/${maxScores[key] || 10}${marker}</li>`;
            }).join('')}
          </ul>
        `,
      });
      console.log('Admin notification sent successfully');
    } catch (adminError) {
      console.error('Failed to send admin notification:', adminError);
      // Don't fail the whole function if admin notification fails
    }

    // EMAIL B: User-facing brief with PDF attachment
    console.log(`Sending diagnostic brief to user: ${email}`);
    try {
      await resend.emails.send({
        from: 'Dr. Negin Rajaipour <office@neginrajaipourmd.com>',
        to: email,
        subject: 'Your Practice Diagnostic Brief',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">Dear ${firstName},</p>

            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
              Thank you for completing the Practice Diagnostic. Your personalized brief is attached — it identifies the structural constraint limiting your practice growth and outlines the specific sequence of decisions that will resolve it.
            </p>

            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
              The diagnostic identifies <em>what's</em> constraining growth. The next conversation is about <em>how</em> to address it in your specific context.
            </p>

            <div style="text-align: center; margin: 2.5rem 0;">
              <a href="https://neginrajaipourmd.com/private-inquiry.html" style="display: inline-block; background: #A8854B; color: #FFFFFF; padding: 1rem 2rem; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 4px;">
                Request a Private Conversation
              </a>
            </div>

            <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
              — Dr. Negin Rajaipour, MD<br>
              <span style="color: #666; font-size: 0.95rem;">office@neginrajaipourmd.com</span>
            </p>
          </div>
        `,
        attachments: [
          {
            filename: `Practice-Diagnostic-${firstName}.pdf`,
            content: pdfBase64,
          },
        ],
      });
      console.log('User diagnostic brief sent successfully');
    } catch (userError) {
      console.error('Failed to send user diagnostic brief:', userError);
      throw userError; // This one should fail the function if it doesn't work
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Diagnostic brief sent successfully' }),
    };

  } catch (error) {
    console.error('Error processing diagnostic:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process diagnostic', details: error.message }),
    };
  }
};
