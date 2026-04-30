// Practice Diagnostic - Interactive Assessment

const questions = [
  {
    id: 1,
    text: "What's your biggest bottleneck right now?",
    options: [
      { text: "Not enough patients/clients coming in", pattern: "demand" },
      { text: "Too many patients, can't keep up", pattern: "capacity" },
      { text: "Revenue isn't matching the effort", pattern: "monetization" },
      { text: "Team turnover or performance issues", pattern: "team" }
    ]
  },
  {
    id: 2,
    text: "How would you describe your current patient/client acquisition?",
    options: [
      { text: "Inconsistent - feast or famine cycles", pattern: "demand" },
      { text: "Steady but I'm at capacity", pattern: "capacity" },
      { text: "Growing but profitability isn't", pattern: "monetization" },
      { text: "Good volume but wrong fit clients", pattern: "positioning" }
    ]
  },
  {
    id: 3,
    text: "What's your experience with pricing?",
    options: [
      { text: "I'm afraid to raise prices, might lose patients", pattern: "monetization" },
      { text: "Prices are fine, I just need more volume", pattern: "demand" },
      { text: "I'm maxed out even with current pricing", pattern: "capacity" },
      { text: "My prices don't reflect my expertise", pattern: "positioning" }
    ]
  },
  {
    id: 4,
    text: "How do you feel about your current service delivery model?",
    options: [
      { text: "It works but I'm exhausted", pattern: "capacity" },
      { text: "It's not differentiated enough from competitors", pattern: "positioning" },
      { text: "Too much time per patient for the revenue", pattern: "monetization" },
      { text: "I'm constantly putting out fires", pattern: "systems" }
    ]
  },
  {
    id: 5,
    text: "What's your relationship with systems and processes?",
    options: [
      { text: "What systems? It's all in my head", pattern: "systems" },
      { text: "I have some, but they break when I'm not there", pattern: "team" },
      { text: "Pretty good, but I need more patients", pattern: "demand" },
      { text: "Solid systems, just need to scale capacity", pattern: "capacity" }
    ]
  },
  {
    id: 6,
    text: "If you could fix ONE thing tomorrow, what would it be?",
    options: [
      { text: "Fill my schedule consistently", pattern: "demand" },
      { text: "Clone myself or expand my hours", pattern: "capacity" },
      { text: "Get paid what I'm actually worth", pattern: "monetization" },
      { text: "Build a team I can trust", pattern: "team" }
    ]
  },
  {
    id: 7,
    text: "How do you describe what you do to new prospects?",
    options: [
      { text: "I list services/treatments I offer", pattern: "positioning" },
      { text: "I explain my credentials and experience", pattern: "positioning" },
      { text: "I talk about the transformation I create", pattern: "demand" },
      { text: "I compare myself to other providers", pattern: "monetization" }
    ]
  },
  {
    id: 8,
    text: "What's your team situation?",
    options: [
      { text: "Just me, wearing all the hats", pattern: "capacity" },
      { text: "I have a team but I'm still the bottleneck", pattern: "team" },
      { text: "Team is solid, we just need more business", pattern: "demand" },
      { text: "Team exists but systems are broken", pattern: "systems" }
    ]
  },
  {
    id: 9,
    text: "What keeps you up at night?",
    options: [
      { text: "Where will the next patient come from?", pattern: "demand" },
      { text: "How will I get through tomorrow's schedule?", pattern: "capacity" },
      { text: "Am I charging enough to make this sustainable?", pattern: "monetization" },
      { text: "Can I trust my team to handle this correctly?", pattern: "team" }
    ]
  },
  {
    id: 10,
    text: "If you had 10 more ideal patients/clients tomorrow, what would happen?",
    options: [
      { text: "I'd be thrilled, that's exactly what I need", pattern: "demand" },
      { text: "I'd panic - no idea how I'd serve them", pattern: "capacity" },
      { text: "Great, but I'd need to hire immediately", pattern: "team" },
      { text: "I'd be nervous about delivering quality", pattern: "systems" }
    ]
  }
];

// Constraint pattern definitions
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
    ]
  },
  systems: {
    name: "Systems Constraint",
    tagline: "Everything breaks when you're not looking",
    description: "You have patients, maybe even a team, but operations are chaotic. Nothing is documented, process are inconsistent, and you're constantly firefighting. The constraint is operational infrastructure.",
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
    ]
  }
};

let currentQuestion = 0;
let answers = [];

// Initialize diagnostic
document.addEventListener('DOMContentLoaded', () => {
  renderQuestion(currentQuestion);
  updateProgress();
});

function renderQuestion(index) {
  const container = document.getElementById('questionContainer');
  const question = questions[index];

  const questionHTML = `
    <div class="question-card active" data-question="${index}">
      <div class="question-number">QUESTION ${index + 1} OF ${questions.length}</div>
      <div class="question-text">${question.text}</div>
      <div class="options">
        ${question.options.map((option, i) => `
          <div class="option" data-pattern="${option.pattern}" data-option="${i}">
            ${option.text}
          </div>
        `).join('')}
      </div>
      <div class="navigation">
        ${index > 0 ? '<button class="btn btn-secondary" onclick="previousQuestion()">← Previous</button>' : '<div></div>'}
        <div></div>
      </div>
    </div>
  `;

  container.innerHTML = questionHTML;

  // Add click handlers to options
  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', (e) => selectOption(e, index));
  });
}

function selectOption(e, questionIndex) {
  const selectedOption = e.target;
  const pattern = selectedOption.dataset.pattern;

  // Remove previous selection
  document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

  // Mark as selected
  selectedOption.classList.add('selected');

  // Store answer
  answers[questionIndex] = pattern;

  // Auto-advance after short delay
  setTimeout(() => {
    nextQuestion();
  }, 400);
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion(currentQuestion);
    updateProgress();
  } else {
    // All questions answered - calculate result
    showResults();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion(currentQuestion);
    updateProgress();
  }
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

function showResults() {
  // Calculate primary constraint
  const patternCounts = {};
  answers.forEach(pattern => {
    patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
  });

  const primaryPattern = Object.keys(patternCounts).reduce((a, b) =>
    patternCounts[a] > patternCounts[b] ? a : b
  );

  const constraint = constraints[primaryPattern];

  // Hide questions
  document.getElementById('questionContainer').style.display = 'none';
  document.querySelector('.progress-bar').style.display = 'none';

  // Show results
  document.getElementById('constraintName').textContent = constraint.name;

  const resultHTML = `
    <h3>${constraint.tagline}</h3>
    <p style="font-size: 1.1rem; line-height: 1.7; margin: 1.5rem 0;">${constraint.description}</p>

    <h4 style="color: var(--charcoal); margin-top: 2rem;">Common Symptoms:</h4>
    <ul style="margin: 1rem 0; line-height: 1.8;">
      ${constraint.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
    </ul>

    <h4 style="color: var(--charcoal); margin-top: 2rem;">The Solution:</h4>
    <p style="font-size: 1.05rem; line-height: 1.7;">${constraint.solution}</p>

    <h4 style="color: var(--charcoal); margin-top: 2rem;">Next Steps:</h4>
    <ol style="margin: 1rem 0; line-height: 1.8;">
      ${constraint.nextSteps.map(step => `<li>${step}</li>`).join('')}
    </ol>
  `;

  document.getElementById('resultDescription').innerHTML = resultHTML;
  document.getElementById('resultContainer').classList.add('active');

  // Store result for PDF generation
  window.diagnosticResult = {
    constraint: primaryPattern,
    answers: answers,
    patternCounts: patternCounts
  };

  // Scroll to results
  document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
}

// Handle PDF request form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pdfRequestForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const errorMessage = document.getElementById('emailError');
      const submitBtn = document.getElementById('diagnosticSubmitBtn');

      // Hide any previous error
      errorMessage.style.display = 'none';

      // Disable submit button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const firstName = document.getElementById('firstName').value;
      const email = document.getElementById('email').value;
      const result = window.diagnosticResult;

      try {
        const response = await fetch('/api/diagnostic-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            email,
            result
          })
        });

        if (response.ok) {
          form.style.display = 'none';
          document.getElementById('emailSuccess').style.display = 'block';
        } else {
          // Show inline error message
          const errorData = await response.json().catch(() => ({}));
          console.error('Diagnostic submission error:', errorData);
          errorMessage.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send My Diagnostic Brief';
        }
      } catch (error) {
        console.error('Diagnostic submission error:', error);
        errorMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Diagnostic Brief';
      }
    });
  }
});
