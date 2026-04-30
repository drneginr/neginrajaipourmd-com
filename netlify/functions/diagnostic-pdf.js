const { Resend } = require('resend');
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

const resend = new Resend(process.env.RESEND_API_KEY);

// Constraint definitions (matching frontend)
const constraints = {
  demand: {
    name: "Demand Constraint",
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
    name: "Capacity Constraint",
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
    name: "Monetization Constraint",
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
    name: "Team Constraint",
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
    name: "Systems Constraint",
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
    name: "Positioning Constraint",
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
    doc.fontSize(10).fillColor('#C9A35E').text('PRACTICE DIAGNOSTIC RESULTS', { align: 'center' });
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
    doc.moveDown(1.5);

    // Next Steps
    doc.fontSize(14).fillColor('#C9A35E').text('Immediate Next Steps');
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#1A1A1A');
    constraint.nextSteps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step}`, { indent: 10, lineGap: 6 });
    });
    doc.moveDown(1.5);

    // Strategic Questions
    doc.fontSize(14).fillColor('#C9A35E').text('Strategic Questions to Consider');
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#1A1A1A');
    constraint.strategicQuestions.forEach(question => {
      doc.text(`• ${question}`, { indent: 10, lineGap: 6 });
    });
    doc.moveDown(2);

    // Next Steps Box
    doc.roundedRect(50, doc.y, 512, 120, 5).stroke('#C9A35E');
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#C9A35E').text('Ready for a Deeper Conversation?', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#1A1A1A').text(
      `This diagnostic identifies your primary constraint. The next step is understanding the specific context, hidden dependencies, and strategic leverage points unique to your practice.\n\nI work with physician leaders and healthcare entrepreneurs to design growth strategies that align with nervous system capacity—not against it.`,
      { align: 'center', lineGap: 4 }
    );
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#C9A35E').text('→ Schedule a conversation: neginrajaipourmd.com/private-inquiry', { align: 'center' });

    // Footer
    doc.fontSize(8).fillColor('#888').text(
      '© 2026 VitaRegen Medical™  |  Dr. Negin Rajaipour, MD',
      50,
      doc.page.height - 50,
      { align: 'center', width: 512 }
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

    // Send email with PDF attachment via Resend
    await resend.emails.send({
      from: 'Dr. Negin Rajaipour <office@neginrajaipourmd.com>',
      to: email,
      subject: `Your Practice Diagnostic Results: ${constraints[result.constraint].name}`,
      html: `
        <div style="font-family: 'Cormorant Garamond', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
          <h1 style="color: #C9A35E; font-size: 2rem; margin-bottom: 1.5rem;">Your Diagnostic Results Are Here</h1>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">Dear ${firstName},</p>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
            Thank you for completing the Practice Diagnostic. Based on your responses, your primary constraint pattern is:
          </p>

          <div style="margin: 2rem 0; padding: 1.5rem; background: #F5F1EA; border-left: 4px solid #C9A35E;">
            <h2 style="color: #C9A35E; margin: 0 0 0.5rem 0; font-size: 1.5rem;">${constraints[result.constraint].name}</h2>
            <p style="font-style: italic; color: #1A1A1A; margin: 0; font-size: 1.05rem;">
              ${constraints[result.constraint].tagline}
            </p>
          </div>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
            Your personalized 2-page diagnostic brief is attached as a PDF. It includes:
          </p>

          <ul style="font-size: 1.05rem; line-height: 1.8; color: #1A1A1A;">
            <li>Detailed analysis of your constraint pattern</li>
            <li>Common symptoms to watch for</li>
            <li>Immediate next steps</li>
            <li>Strategic questions to guide your planning</li>
          </ul>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
            This diagnostic identifies <em>what's</em> constraining growth. The next conversation is about <em>how</em> to address it in your specific context.
          </p>

          <div style="text-align: center; margin: 2.5rem 0;">
            <a href="https://neginrajaipourmd.com/private-inquiry" style="display: inline-block; background: #C9A35E; color: #1A1A1A; padding: 1rem 2rem; text-decoration: none; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px;">
              Schedule a Strategy Conversation
            </a>
          </div>

          <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
            Best,<br>
            <strong>Dr. Negin Rajaipour, MD</strong><br>
            <span style="color: #666; font-size: 0.95rem;">Founder & CEO, VitaRegen Medical™</span>
          </p>

          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 0.85rem; color: #888;">© 2026 VitaRegen Medical™. All Rights Reserved.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Practice-Diagnostic-${firstName}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    // Also send notification to Dr. Rajaipour
    await resend.emails.send({
      from: 'Practice Diagnostic <office@neginrajaipourmd.com>',
      to: 'office@neginrajaipourmd.com',
      subject: `New Diagnostic Completed: ${constraints[result.constraint].name}`,
      html: `
        <h2>New Practice Diagnostic Submission</h2>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Primary Constraint:</strong> ${constraints[result.constraint].name}</p>
        <p><strong>Pattern Distribution:</strong></p>
        <pre>${JSON.stringify(result.patternCounts, null, 2)}</pre>
      `,
    });

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
