/* =========================================
   RESONANCE — app.js
   Mock data + shared navigation logic
   ========================================= */

// ---- MOCK DATA ----

const mockFounder = {
  name: "Maya Chen",
  company: "NovaMed AI",
  role: "Co-Founder & CEO",
  stage: "Seed",
  sector: "HealthTech / AI",
  arr: "$280K",
  growth: "22% MoM",
  location: "San Francisco, CA",
  aiScore: 87,
  initials: "MC",
  bio: "Building AI-powered diagnostic tools that reduce missed diagnoses by 40%. Previously at Google Health and Genentech.",
  verified: true
};

const mockInvestor = {
  name: "David Park",
  fund: "Horizon Ventures",
  role: "Partner",
  stage: ["Pre-Seed", "Seed"],
  checkSize: "$250K – $1.5M",
  sectors: ["HealthTech", "AI/ML", "SaaS", "Climate Tech"],
  location: "San Francisco, CA",
  lastInvestment: "6 weeks ago",
  portfolio: 24,
  initials: "DP",
  verified: true,
  activeStatus: "Actively investing",
  matchScore: 94
};

const investors = [
  {
    id: 1,
    name: "Sarah Kim",
    fund: "Sequoia Capital",
    role: "Principal",
    stage: "Seed / Series A",
    thesis: "AI, HealthTech, Enterprise SaaS",
    matchScore: 94,
    checkSize: "$500K – $3M",
    verified: true,
    initials: "SK",
    portfolioHighlights: ["Stripe", "Airbnb", "Notion"],
    location: "Menlo Park, CA",
    lastActive: "2 days ago"
  },
  {
    id: 2,
    name: "James Liu",
    fund: "Andreessen Horowitz",
    role: "Partner",
    stage: "Seed",
    thesis: "AI/ML Infrastructure, Dev Tools",
    matchScore: 88,
    checkSize: "$1M – $5M",
    verified: true,
    initials: "JL",
    portfolioHighlights: ["GitHub", "Coinbase", "Lyft"],
    location: "San Francisco, CA",
    lastActive: "1 week ago"
  },
  {
    id: 3,
    name: "David Park",
    fund: "Horizon Ventures",
    role: "Partner",
    stage: "Pre-Seed / Seed",
    thesis: "HealthTech, AI, Climate",
    matchScore: 94,
    checkSize: "$250K – $1.5M",
    verified: true,
    initials: "DP",
    portfolioHighlights: ["Hims", "Ro", "Suki AI"],
    location: "San Francisco, CA",
    lastActive: "Active today"
  },
  {
    id: 4,
    name: "Priya Nair",
    fund: "GV (Google Ventures)",
    role: "General Partner",
    stage: "Series A / B",
    thesis: "Digital Health, Diagnostics, Bio",
    matchScore: 79,
    checkSize: "$2M – $10M",
    verified: true,
    initials: "PN",
    portfolioHighlights: ["Flatiron Health", "Color", "One Medical"],
    location: "New York, NY",
    lastActive: "3 days ago"
  },
  {
    id: 5,
    name: "Marcus Webb",
    fund: "First Round Capital",
    role: "Venture Partner",
    stage: "Pre-Seed / Seed",
    thesis: "Marketplace, SaaS, AI Tools",
    matchScore: 72,
    checkSize: "$150K – $800K",
    verified: false,
    initials: "MW",
    portfolioHighlights: ["Uber", "Square", "Warby Parker"],
    location: "Philadelphia, PA",
    lastActive: "1 week ago"
  },
  {
    id: 6,
    name: "Elena Torres",
    fund: "Bessemer Venture Partners",
    role: "Partner",
    stage: "Seed / Series A",
    thesis: "HealthTech, Biotech, Consumer Health",
    matchScore: 85,
    checkSize: "$500K – $2.5M",
    verified: true,
    initials: "ET",
    portfolioHighlights: ["LinkedIn", "Pinterest", "Twilio"],
    location: "San Francisco, CA",
    lastActive: "4 days ago"
  }
];

const startups = [
  {
    id: 1,
    name: "NovaMed AI",
    sector: "HealthTech / AI",
    stage: "Seed",
    description: "AI-powered diagnostic tools reducing missed diagnoses by 40% in primary care settings.",
    arr: "$280K",
    growth: "+22% MoM",
    teamSize: 8,
    matchScore: 94,
    verified: true,
    location: "San Francisco, CA",
    founded: 2023,
    coInvestorSignal: 3,
    founder: "Maya Chen",
    initials: "NM"
  },
  {
    id: 2,
    name: "GreenLoop",
    sector: "Climate Tech",
    stage: "Pre-Seed",
    description: "Circular economy platform connecting manufacturers with recycled material suppliers.",
    arr: "$65K",
    growth: "+31% MoM",
    teamSize: 4,
    matchScore: 81,
    verified: true,
    location: "Austin, TX",
    founded: 2024,
    coInvestorSignal: 1,
    founder: "Raj Patel",
    initials: "GL"
  },
  {
    id: 3,
    name: "FlowDesk",
    sector: "SaaS / Productivity",
    stage: "Seed",
    description: "AI-native project management that writes your status updates, meeting notes, and OKRs automatically.",
    arr: "$420K",
    growth: "+18% MoM",
    teamSize: 12,
    matchScore: 76,
    verified: true,
    location: "New York, NY",
    founded: 2022,
    coInvestorSignal: 4,
    founder: "Aisha Johnson",
    initials: "FD"
  },
  {
    id: 4,
    name: "CreditBridge",
    sector: "FinTech",
    stage: "Series A",
    description: "Alternative credit scoring for the 60M underbanked Americans using cash flow and rent data.",
    arr: "$1.2M",
    growth: "+14% MoM",
    teamSize: 22,
    matchScore: 68,
    verified: false,
    location: "Chicago, IL",
    founded: 2021,
    coInvestorSignal: 2,
    founder: "Marcus Webb",
    initials: "CB"
  },
  {
    id: 5,
    name: "TalentOS",
    sector: "HR Tech / AI",
    stage: "Seed",
    description: "Autonomous recruiting platform that sources, screens, and schedules candidates in under 24 hours.",
    arr: "$350K",
    growth: "+26% MoM",
    teamSize: 9,
    matchScore: 88,
    verified: true,
    location: "San Francisco, CA",
    founded: 2023,
    coInvestorSignal: 2,
    founder: "Sophie Zhang",
    initials: "TO"
  },
  {
    id: 6,
    name: "PharmaLink",
    sector: "HealthTech / Biotech",
    stage: "Pre-Seed",
    description: "Real-world evidence platform connecting pharma companies with patient data for faster drug trials.",
    arr: "$40K",
    growth: "+45% MoM",
    teamSize: 5,
    matchScore: 91,
    verified: true,
    location: "Boston, MA",
    founded: 2024,
    coInvestorSignal: 1,
    founder: "Dr. Kevin Osei",
    initials: "PL"
  }
];

const outreachPipeline = {
  matched: [
    { name: "Priya Nair", fund: "GV", stage: "Series A", score: 79 },
    { name: "Marcus Webb", fund: "First Round", stage: "Pre-Seed", score: 72 }
  ],
  pitched: [
    { name: "James Liu", fund: "a16z", stage: "Seed", score: 88 },
    { name: "Elena Torres", fund: "Bessemer", stage: "Seed", score: 85 }
  ],
  diligence: [
    { name: "Sarah Kim", fund: "Sequoia", stage: "Seed", score: 94 }
  ],
  termsheet: [
    { name: "David Park", fund: "Horizon", stage: "Pre-Seed", score: 94 }
  ]
};

const dataRoomDocs = [
  { name: "Pitch Deck (Latest)", status: "done", date: "Mar 10" },
  { name: "Financial Model (3-yr)", status: "done", date: "Mar 8" },
  { name: "Cap Table", status: "done", date: "Feb 28" },
  { name: "Revenue Dashboard (QuickBooks)", status: "done", date: "Mar 14" },
  { name: "IP / Patents Overview", status: "pending", date: null },
  { name: "Team Bios & LinkedIn", status: "done", date: "Feb 20" },
  { name: "Product Demo Video", status: "pending", date: null },
  { name: "Customer References (3)", status: "pending", date: null }
];

// ---- UTILITY FUNCTIONS ----

function getMatchScoreClass(score) {
  if (score >= 85) return 'match-score-high';
  if (score >= 70) return 'match-score-mid';
  return 'match-score-low';
}

function getMatchScoreEmoji(score) {
  if (score >= 85) return '🎯';
  if (score >= 70) return '📊';
  return '📌';
}

function getProgressColor(score) {
  if (score >= 85) return 'green';
  if (score >= 70) return 'amber';
  return '';
}

// ---- SHARED NAV LOGIC ----

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      const container = tab.closest('.tabs-container') || document;

      // Deactivate all tabs in this group
      const group = tab.closest('.tabs');
      if (group) {
        group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      }
      tab.classList.add('active');

      // Hide all content panes
      const panes = container.querySelectorAll('.tab-content');
      panes.forEach(p => p.classList.remove('active'));

      // Show target
      const target = container.getElementById ?
        container.getElementById(targetId) :
        document.getElementById(targetId);
      if (target) target.classList.add('active');
    });
  });
}

function initHowItWorksToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      document.querySelectorAll('.how-steps').forEach(s => s.classList.add('hidden'));
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.remove('hidden');
    });
  });
}

function initWaitlistRoleToggle() {
  const roleBtns = document.querySelectorAll('.waitlist-role-btn');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('.waitlist-input').value;
    const role = document.querySelector('.waitlist-role-btn.active')?.textContent || 'Founder';
    if (email) {
      const btn = form.querySelector('.btn-primary');
      btn.textContent = '✓ You\'re on the list!';
      btn.style.background = '#10B981';
      btn.disabled = true;
    }
  });
}

function initFilterPills() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.closest('.filter-bar');
      if (!group) return;
      // For single-select groups
      if (!pill.dataset.multiselect) {
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      }
      pill.classList.toggle('active');
    });
  });
}

function initSidebarHighlight() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
    if (item.dataset.page === current ||
        (current === '' && item.dataset.page === 'index.html')) {
      item.classList.add('active');
    }
  });
}

function initFeedActions() {
  document.querySelectorAll('.feed-action-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.feed-card');
      if (card) {
        card.style.opacity = '0.4';
        card.style.pointerEvents = 'none';
        btn.textContent = 'Passed';
      }
    });
  });

  document.querySelectorAll('.feed-action-pipeline').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = '✓ Added';
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-primary');
      btn.style.background = '#10B981';
    });
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initHowItWorksToggle();
  initWaitlistRoleToggle();
  initWaitlistForm();
  initFilterPills();
  initSidebarHighlight();
  initFeedActions();
});
