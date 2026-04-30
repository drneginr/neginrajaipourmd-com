#!/usr/bin/env node
/**
 * Resend Email Drip Setup
 *
 * Note: Resend doesn't have native automation/drip sequences.
 * This script creates the emails as Resend Broadcasts (scheduled sends).
 *
 * Limitation: Broadcasts in Resend require manual trigger or are sent immediately.
 * For true automation, need to:
 * 1. Use Zapier/Make + Resend
 * 2. Build Netlify scheduled functions
 * 3. Use this script to create broadcasts manually when needed
 */

const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates from email-drip-sequence.md
const emails = [
  {
    day: 0,
    subject: 'Thank you for your inquiry',
    from: 'Dr. Negin Rajaipour <hello@neginrajaipourmd.com>',
    note: 'Sent immediately via private-inquiry function'
  },
  {
    day: 3,
    subject: 'Why high performers burn out (and how to prevent it)',
    from: 'Dr. Negin Rajaipour <hello@neginrajaipourmd.com>',
    html: `<div style="font-family: 'Cormorant Garamond', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
  <h1 style="color: #C9A35E; font-size: 2rem; margin-bottom: 1.5rem;">The Leadership Paradox</h1>

  <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
    Most high performers share a dangerous assumption: that the same drive that got them to the top will sustain them there.
  </p>

  <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
    But here's what I've observed in working with physician leaders, executives, and entrepreneurs:
  </p>

  <div style="margin: 2rem 0; padding: 1.5rem; background: #F5F1EA; border-left: 4px solid #C9A35E;">
    <p style="font-style: italic; color: #1A1A1A; margin: 0; font-size: 1.1rem;">
      Achievement without healing is unsustainable. Peak performance built on unhealed foundations eventually collapses under its own weight.
    </p>
  </div>

  <h2 style="color: #1A1A1A; font-size: 1.5rem; margin-top: 2rem;">Three Warning Signs</h2>

  <ol style="font-size: 1.05rem; line-height: 1.8; color: #1A1A1A;">
    <li><strong>You're succeeding externally while struggling internally</strong> — the metrics say you're winning, but you're exhausted</li>
    <li><strong>Decision fatigue is chronic</strong> — choices that used to be easy now feel overwhelming</li>
    <li><strong>Your body is sending signals you're ignoring</strong> — insomnia, tension, digestive issues, chronic inflammation</li>
  </ol>

  <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
    These aren't character flaws. They're physiological symptoms of a nervous system under prolonged stress.
  </p>

  <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
    In the next email, I'll share the E3 Method™ framework I developed to address this — a trauma-informed system that bridges clinical medicine and performance science.
  </p>

  <p style="font-size: 1.1rem; line-height: 1.7; color: #1A1A1A;">
    Best,<br>
    <strong>Dr. Negin Rajaipour</strong>
  </p>

  <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
  <p style="font-size: 0.85rem; color: #888;">© 2026 VitaRegen Medical™</p>
</div>`
  },
  {
    day: 7,
    subject: 'A trauma-informed system for sustainable performance',
    from: 'Dr. Negin Rajaipour <hello@neginrajaipourmd.com>',
    html: `<!-- Email 3 HTML from email-drip-sequence.md -->`
  },
  {
    day: 10,
    subject: 'From burnout to breakthrough: A physician\'s story',
    from: 'Dr. Negin Rajaipour <hello@neginrajaipourmd.com>',
    html: `<!-- Email 4 HTML from email-drip-sequence.md -->`
  },
  {
    day: 14,
    subject: 'Why I co-authored this book with Brian Tracy',
    from: 'Dr. Negin Rajaipour <hello@neginrajaipourmd.com>',
    html: `<!-- Email 5 HTML from email-drip-sequence.md -->`
  },
  {
    day: 21,
    subject: 'What working together looks like',
    from: 'Dr. Negin Rajaipour <hello@neginrajaipourmd.com>',
    html: `<!-- Email 6 HTML from email-drip-sequence.md -->`
  }
];

async function checkResendAPI() {
  console.log('🔍 Checking Resend API access...\n');

  try {
    // Check if we can access the API
    const domains = await resend.domains.list();
    console.log('✅ Resend API authenticated\n');

    // Check for verified sending domain
    console.log('📧 Sending domains:');
    if (domains.data && domains.data.length > 0) {
      domains.data.forEach(domain => {
        console.log(`   - ${domain.name} (${domain.status})`);
      });
    } else {
      console.log('   ⚠️  No verified domains found');
      console.log('   → Add and verify a sending domain in Resend dashboard');
      console.log('   → neginrajaipourmd.com needs DNS verification');
    }

    console.log('\n📋 Email drip sequence status:');
    console.log('   ✅ 6 email templates written');
    console.log('   ✅ Email 1 (Day 0) - Automated via Netlify function');
    console.log('   ⚠️  Emails 2-6 - Require manual setup\n');

    console.log('🔧 Implementation options:\n');
    console.log('   1. ZAPIER (Recommended)');
    console.log('      - Trigger: Resend contact added');
    console.log('      - Actions: 5 delayed emails');
    console.log('      - Setup time: 15 minutes\n');

    console.log('   2. NETLIFY SCHEDULED FUNCTIONS');
    console.log('      - Create cron jobs for email sends');
    console.log('      - Requires custom development');
    console.log('      - Full automation\n');

    console.log('   3. MANUAL BROADCASTS');
    console.log('      - Send via Resend dashboard');
    console.log('      - Copy templates from email-drip-sequence.md');
    console.log('      - Manual scheduling\n');

    console.log('💡 Why native Resend automation doesn\'t exist:');
    console.log('   Resend is designed for transactional emails, not marketing automation.');
    console.log('   Marketing sequences require third-party automation tools.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkResendAPI();
