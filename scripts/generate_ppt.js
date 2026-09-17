const pptxgen = require("pptxgenjs");
const path = require("path");

// Helper to generate a random synthetic vendor name for demonstration
const SYNTHETIC_VENDORS = [
  "Acme Logistics Solutions Inc.",
  "Apex Global Technologies Ltd.",
  "Vortex Cloud Systems Corp.",
  "Nexus Materials & Supply Co.",
  "Zephyr Cyberware Solutions",
  "Titanium Enterprise Services",
  "Starlight Innovations Group",
  "Quantum Hardware Systems"
];

function getRandomVendor() {
  return SYNTHETIC_VENDORS[Math.floor(Math.random() * SYNTHETIC_VENDORS.length)];
}

async function generatePresentation() {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Antigravity Senior Full-Stack Architect';
  pptx.company = 'Enterprise Solutions';
  pptx.title = 'Vendor & Customer Management Portal (Anonymized Client Demo)';

  // Color Palette Definitions
  const NAVY = '0F172A';
  const SLATE = '1E293B';
  const CARD_BG = '334155';
  const BLUE = '2563EB';
  const CYAN = '0891B2';
  const LIGHT_BG = 'F8FAFC';
  const TEXT_MAIN = '0F172A';
  const TEXT_MUTED = '64748B';
  const WHITE = 'FFFFFF';
  const GREEN = '059669';
  const AMBER = 'D97706';
  const PURPLE = '7C3AED';

  // Helper for slide titles
  function addHeader(slide, title, category) {
    slide.addText(category.toUpperCase(), {
      x: 0.6, y: 0.4, w: 12.0, h: 0.3,
      fontSize: 11, bold: true, color: CYAN, fontFace: 'Arial'
    });
    slide.addText(title, {
      x: 0.6, y: 0.7, w: 12.0, h: 0.6,
      fontSize: 24, bold: true, color: NAVY, fontFace: 'Arial'
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide (Dark Theme)
  // ==========================================
  let slide1 = pptx.addSlide();
  slide1.background = { color: NAVY };

  slide1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.15, fill: { color: CYAN } });
  slide1.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 2.2, w: 0.15, h: 2.8, fill: { color: BLUE } });

  slide1.addText("ENTERPRISE DIGITAL PLATFORM", {
    x: 0.9, y: 2.1, w: 11.5, h: 0.4,
    fontSize: 12, bold: true, color: CYAN, fontFace: 'Arial'
  });

  slide1.addText("Vendor & Customer\nManagement Portal", {
    x: 0.9, y: 2.5, w: 11.5, h: 1.8,
    fontSize: 40, bold: true, color: WHITE, fontFace: 'Arial', lineSpacing: 44
  });

  slide1.addText("Comprehensive Compliance, Multi-Tier Invoice Approvals & Payment Processing Engine", {
    x: 0.9, y: 4.4, w: 11.5, h: 0.6,
    fontSize: 16, color: '94A3B8', fontFace: 'Arial'
  });

  // Anonymization / Privacy Badge on Slide 1
  slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.9, y: 5.4, w: 11.53, h: 1.2, rectRadius: 0.1,
    fill: { color: SLATE }, line: { color: PURPLE, width: 2 }
  });

  slide1.addText("🔒 DATA PRIVACY SAFEGUARD ENFORCED: All Vendor & Customer identities displayed in this deck use randomized synthetic dummy profiles (e.g. Apex Logistics, Vortex Tech) to protect sensitive real-world enterprise entity data.", {
    x: 1.2, y: 5.55, w: 11.0, h: 0.9,
    fontSize: 12, bold: true, color: 'F1F5F9', fontFace: 'Arial', lineSpacing: 18
  });

  // ==========================================
  // SLIDE 2: Executive Summary & Value Prop
  // ==========================================
  let slide2 = pptx.addSlide();
  slide2.background = { color: LIGHT_BG };
  addHeader(slide2, "Executive Summary & Core Objectives", "System Overview");

  const pillars = [
    {
      title: "Self-Service Onboarding",
      desc: "Streamlined 10-step wizard for vendors & customers with document uploads and automated validation.",
      color: BLUE,
      icon: "📋"
    },
    {
      title: "Identity & Data Privacy",
      desc: "Automatic vendor name anonymization, PII obfuscation, and Row Level Security across client views.",
      color: PURPLE,
      icon: "🔒"
    },
    {
      title: "Multi-Tier Approvals",
      desc: "Configurable threshold routing (Tier 1, Tier 2, Executive) with automatic duplicate invoice checks.",
      color: GREEN,
      icon: "⚡"
    },
    {
      title: "Payment Transparency",
      desc: "Finance payout recording, TDS tax calculations, penalty deductions, and real-time advice tracking.",
      color: AMBER,
      icon: "💳"
    }
  ];

  pillars.forEach((p, idx) => {
    let col = idx % 2;
    let row = Math.floor(idx / 2);
    let xPos = 0.6 + col * 6.0;
    let yPos = 1.6 + row * 2.6;

    slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 5.6, h: 2.3, rectRadius: 0.1,
      fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
    });

    slide2.addShape(pptx.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 0.12, h: 2.3, fill: { color: p.color }
    });

    slide2.addText(`${p.icon}  ${p.title}`, {
      x: xPos + 0.3, y: yPos + 0.3, w: 5.0, h: 0.4,
      fontSize: 18, bold: true, color: NAVY, fontFace: 'Arial'
    });

    slide2.addText(p.desc, {
      x: xPos + 0.3, y: yPos + 0.8, w: 5.0, h: 1.2,
      fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 18
    });
  });

  // ==========================================
  // SLIDE 3: 8 Access Roles & Stakeholder Grid (Randomized Samples)
  // ==========================================
  let slide3 = pptx.addSlide();
  slide3.background = { color: LIGHT_BG };
  addHeader(slide3, "Multi-Role RBAC Security Architecture (8 Portal Roles)", "Access Control");

  const sampleVendorA = getRandomVendor();
  const sampleVendorB = getRandomVendor();

  const roles = [
    { role: "Vendor Profile", cat: "External", desc: `e.g. ${sampleVendorA} - Submit docs, track onboarding, create invoices.` },
    { role: "Customer Profile", cat: "External", desc: "e.g. Horizon Global Ltd. - Complete onboarding, upload KYC, manage tickets." },
    { role: "Administrator", cat: "Internal", desc: "Full governance, user management, workflow configuration, system settings." },
    { role: "Vendor Operations", cat: "Internal", desc: "Supervise vendor registration queue, manage profiles & onboarding flow." },
    { role: "Document Screener", cat: "Internal", desc: "Audit mandatory documents, request corrections, verify tax certificates." },
    { role: "Invoice Approver", cat: "Internal", desc: "Multi-tier threshold review, line-item verification, duplicate check." },
    { role: "Finance / Payout", cat: "Internal", desc: "Record payout settlement, apply TDS/penalties, issue payment vouchers." },
    { role: "Compliance Auditor", cat: "Internal", desc: "Read-only access to immutable audit logs, reports, & statutory exports." }
  ];

  roles.forEach((r, idx) => {
    let col = idx % 4;
    let row = Math.floor(idx / 4);
    let xPos = 0.6 + col * 2.95;
    let yPos = 1.6 + row * 2.6;

    let isExternal = r.cat === "External";
    let badgeColor = isExternal ? CYAN : BLUE;

    slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 2.75, h: 2.3, rectRadius: 0.1,
      fill: { color: WHITE }, line: { color: 'E2E8F0', width: 1 }
    });

    slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos + 0.2, y: yPos + 0.2, w: 1.0, h: 0.25, rectRadius: 0.05,
      fill: { color: badgeColor }
    });
    slide3.addText(r.cat.toUpperCase(), {
      x: xPos + 0.2, y: yPos + 0.2, w: 1.0, h: 0.25,
      fontSize: 9, bold: true, color: WHITE, align: 'center', fontFace: 'Arial'
    });

    slide3.addText(r.role, {
      x: xPos + 0.2, y: yPos + 0.55, w: 2.35, h: 0.35,
      fontSize: 14, bold: true, color: NAVY, fontFace: 'Arial'
    });

    slide3.addText(r.desc, {
      x: xPos + 0.2, y: yPos + 0.95, w: 2.35, h: 1.2,
      fontSize: 11, color: TEXT_MUTED, fontFace: 'Arial'
    });
  });

  // ==========================================
  // SLIDE 4: Core Workflows & Modules
  // ==========================================
  let slide4 = pptx.addSlide();
  slide4.background = { color: LIGHT_BG };
  addHeader(slide4, "End-to-End Workflow & Modules Architecture", "Core Functionality");

  const modules = [
    { title: "1. Registration Wizard", items: ["10-step wizard", "Randomized entity masking", "PAN/GST validation", "Compliance declaration"] },
    { title: "2. Document Audit", items: ["Side-by-side preview", "Approve / Reject / Correction", "Granular correction reasons", "Expiry date tracking"] },
    { title: "3. Invoice Engine", items: ["Line-item calculation", "Tax & total auto-sum", "Duplicate invoice alert", "Supporting doc attach"] },
    { title: "4. Approval Workflow", items: ["Threshold-based routing", "Multi-tier approvals", "Reject back to vendor", "Historical approval log"] },
    { title: "5. Payout & Finance", items: ["TDS calculation", "Penalty deduction log", "Payment advice generation", "Finance status sync"] },
    { title: "6. Support & Reports", items: ["Ticketing system", "Recharts analytics", "CSV audit log export", "Custom report builder"] }
  ];

  modules.forEach((m, idx) => {
    let col = idx % 3;
    let row = Math.floor(idx / 3);
    let xPos = 0.6 + col * 3.95;
    let yPos = 1.6 + row * 2.6;

    slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 3.75, h: 2.3, rectRadius: 0.1,
      fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
    });

    slide4.addText(m.title, {
      x: xPos + 0.2, y: yPos + 0.2, w: 3.35, h: 0.35,
      fontSize: 15, bold: true, color: BLUE, fontFace: 'Arial'
    });

    let bulletText = m.items.map(i => `• ${i}`).join("\n");
    slide4.addText(bulletText, {
      x: xPos + 0.2, y: yPos + 0.65, w: 3.35, h: 1.5,
      fontSize: 12, color: TEXT_MAIN, fontFace: 'Arial', lineSpacing: 18
    });
  });

  // ==========================================
  // SLIDE 5: Full-Stack Architecture & Modern Tech Stack
  // ==========================================
  let slide5 = pptx.addSlide();
  slide5.background = { color: LIGHT_BG };
  addHeader(slide5, "Modern Technology Stack & System Architecture", "Engineering Stack");

  const stack = [
    { layer: "Frontend Layer", tech: "Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui primitives", color: BLUE },
    { layer: "3D & WebGL Canvas", tech: "Three.js WebGL interactive particle canvas + 3D Tilt Cards with graceful fallback", color: CYAN },
    { layer: "Backend & Database", tech: "Supabase PostgreSQL (29 Normalized Tables), Row Level Security (RLS) Policies", color: GREEN },
    { layer: "Validation & Logic", tech: "Zod 4 schemas, React Hook Form, Custom Dynamic Workflow Approval Engine", color: AMBER },
    { layer: "Privacy & Anonymization", tech: "Synthetic entity name generator, Bank Account Masking (XXXX-XXXX-1234), Audit Log", color: PURPLE }
  ];

  stack.forEach((s, idx) => {
    let yPos = 1.6 + idx * 1.0;

    slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.6, y: yPos, w: 12.13, h: 0.85, rectRadius: 0.08,
      fill: { color: WHITE }, line: { color: 'E2E8F0', width: 1 }
    });

    slide5.addShape(pptx.shapes.RECTANGLE, {
      x: 0.6, y: yPos, w: 0.15, h: 0.85, fill: { color: s.color }
    });

    slide5.addText(s.layer, {
      x: 0.9, y: yPos + 0.15, w: 3.0, h: 0.5,
      fontSize: 14, bold: true, color: NAVY, fontFace: 'Arial'
    });

    slide5.addText(s.tech, {
      x: 4.0, y: yPos + 0.15, w: 8.5, h: 0.5,
      fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial'
    });
  });

  // ==========================================
  // SLIDE 6: Multi-Tier Invoice Approval Engine (Synthetic Examples)
  // ==========================================
  let slide6 = pptx.addSlide();
  slide6.background = { color: LIGHT_BG };
  addHeader(slide6, "Configurable Multi-Tier Approval Engine & Duplicate Prevention", "Financial Workflow");

  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.6, w: 5.8, h: 5.1, rectRadius: 0.1,
    fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
  });

  slide6.addText("Approval Threshold Routing Rules", {
    x: 0.9, y: 1.9, w: 5.2, h: 0.4,
    fontSize: 16, bold: true, color: BLUE, fontFace: 'Arial'
  });

  const rulesText = 
    `• Tier 1 Auto-Approval / Single Level:\n  Invoices under $10,000 processed by Vendor Ops.\n  Sample: ${getRandomVendor()} - Inv #INV-1092 ($4,500)\n\n` +
    `• Tier 2 Manager Approval:\n  Invoices between $10,000 and $50,000 require Manager sign-off.\n  Sample: ${getRandomVendor()} - Inv #INV-3049 ($28,000)\n\n` +
    `• Tier 3 Executive Sign-Off:\n  Invoices exceeding $50,000 require CFO / Finance Director sign-off.\n  Sample: ${getRandomVendor()} - Inv #INV-8891 ($145,000)\n\n` +
    "• Custom Rules Configurable:\n  Administrators tweak thresholds dynamically via /admin/workflows.";

  slide6.addText(rulesText, {
    x: 0.9, y: 2.4, w: 5.2, h: 4.0,
    fontSize: 11, color: TEXT_MAIN, fontFace: 'Arial', lineSpacing: 16
  });

  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.6, w: 5.93, h: 5.1, rectRadius: 0.1,
    fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
  });

  slide6.addText("Duplicate Check & Net Payout Math", {
    x: 7.1, y: 1.9, w: 5.3, h: 0.4,
    fontSize: 16, bold: true, color: GREEN, fontFace: 'Arial'
  });

  const mathText = 
    "• Automated Duplicate Detection:\n  Every invoice submission checks (Supplier ID + Invoice Number) against past active submissions to prevent double billing.\n\n" +
    "• Net Payable Calculation Formula:\n" +
    "  Net Payout = Approved Invoice Amount\n" +
    "               - Penalty Deductions\n" +
    "               - TDS (Tax Deducted at Source)\n\n" +
    "• Payment Advice Generation:\n  Automated advice document with breakdown generated upon Finance disbursement confirmation.";

  slide6.addText(mathText, {
    x: 7.1, y: 2.4, w: 5.3, h: 4.0,
    fontSize: 12, color: TEXT_MAIN, fontFace: 'Arial', lineSpacing: 18
  });

  // ==========================================
  // SLIDE 7: Vendor Name Anonymization & Security (Dedicated Security Slide)
  // ==========================================
  let slide7 = pptx.addSlide();
  slide7.background = { color: LIGHT_BG };
  addHeader(slide7, "Vendor Data Anonymization & Privacy Protection (GDPR / PII Safe)", "Data Governance");

  const anonCards = [
    { title: "Randomized Vendor Identifiers", desc: "In client demo mode and export reporting, real vendor entity names are dynamically mapped to randomized synthetic names (e.g., Apex Tech, Vortex Systems) or hashed IDs (VND-88492)." },
    { title: "Sensitive Banking Data Masking", desc: "Bank account numbers, routing numbers, and tax identifiers are automatically masked as XXXX-XXXX-1234 for all non-finance reviewers to ensure PII compliance." },
    { title: "Row Level Security (RLS)", desc: "Enforces strict database-level tenant isolation. Vendors can only query their own records, preventing cross-vendor data exposure." },
    { title: "Immutable Audit Trail Logging", desc: "Every view, modification, document status update, and financial disbursement is recorded with timestamp, user ID, IP address, and change diff." }
  ];

  anonCards.forEach((c, idx) => {
    let col = idx % 2;
    let row = Math.floor(idx / 2);
    let xPos = 0.6 + col * 6.0;
    let yPos = 1.6 + row * 2.6;

    slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 5.6, h: 2.3, rectRadius: 0.1,
      fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
    });

    slide7.addText(c.title, {
      x: xPos + 0.3, y: yPos + 0.3, w: 5.0, h: 0.4,
      fontSize: 16, bold: true, color: PURPLE, fontFace: 'Arial'
    });

    slide7.addText(c.desc, {
      x: xPos + 0.3, y: yPos + 0.8, w: 5.0, h: 1.2,
      fontSize: 12, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 18
    });
  });

  // ==========================================
  // SLIDE 8: Analytics & Reporting Suite
  // ==========================================
  let slide8 = pptx.addSlide();
  slide8.background = { color: LIGHT_BG };
  addHeader(slide8, "Executive Analytics & Anonymized Reporting Suite", "Business Intelligence");

  const kpis = [
    { label: "Active Vendors (Anonymized)", val: "1,248", color: BLUE },
    { label: "Onboarded Customers", val: "856", color: CYAN },
    { label: "Pending Approvals", val: "42", color: AMBER },
    { label: "Total Disbursement", val: "$4.2M", color: GREEN }
  ];

  kpis.forEach((k, idx) => {
    let xPos = 0.6 + idx * 3.05;

    slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: 1.6, w: 2.85, h: 1.2, rectRadius: 0.1,
      fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
    });

    slide8.addText(k.label.toUpperCase(), {
      x: xPos + 0.2, y: 1.75, w: 2.45, h: 0.25,
      fontSize: 9, bold: true, color: TEXT_MUTED, fontFace: 'Arial'
    });

    slide8.addText(k.val, {
      x: xPos + 0.2, y: 2.05, w: 2.45, h: 0.5,
      fontSize: 24, bold: true, color: k.color, fontFace: 'Arial'
    });
  });

  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.1, w: 12.13, h: 3.6, rectRadius: 0.1,
    fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
  });

  slide8.addText("Reporting Capabilities & Audit Exports", {
    x: 0.9, y: 3.4, w: 11.0, h: 0.4,
    fontSize: 16, bold: true, color: NAVY, fontFace: 'Arial'
  });

  const reportBullets = 
    "• Recharts Interactive Visualizations: Dynamic charts for vendor status breakdown, invoice volume trends, payout timelines, and compliance rates.\n\n" +
    "• Statutory CSV & Report Exports: One-click CSV export engine for audit logs, vendor master lists (with privacy masking option), tax deduction summaries (TDS), and payment histories.\n\n" +
    "• Automated Email Notifications: Real-time notification dispatch for document review outcomes, invoice status updates, and support ticket replies.\n\n" +
    "• Live Admin Filters: Multi-parameter search & filtering by date range, vendor tier, department, status, and amount thresholds.";

  slide8.addText(reportBullets, {
    x: 0.9, y: 3.9, w: 11.5, h: 2.6,
    fontSize: 13, color: TEXT_MAIN, fontFace: 'Arial', lineSpacing: 20
  });

  // ==========================================
  // SLIDE 9: Application Live Demo Routes & Test Guide
  // ==========================================
  let slide9 = pptx.addSlide();
  slide9.background = { color: LIGHT_BG };
  addHeader(slide9, "Application Live Demo Routes & Synthetic Test Guide", "Demo Preparation");

  const demoRoutes = [
    { title: "Public Portals", routes: "• / (Interactive 3D Hero Landing)\n• /login (Role-based authentication)\n• /register/vendor (10-Step Wizard)\n• /register/customer (KYC Onboarding)" },
    { title: "Vendor Portal (Anonymized)", routes: `• /vendor/dashboard (e.g. ${getRandomVendor()})\n• /vendor/documents (Upload & compliance)\n• /vendor/invoices/new (Create invoice)\n• /vendor/payments (Payment advice)` },
    { title: "Admin Portal", routes: "• /admin/dashboard (KPI Overview)\n• /admin/document-reviews (Audit queue)\n• /admin/approvals (Multi-tier queue)\n• /admin/payments (Record payouts)" },
    { title: "System & Audit", routes: "• /admin/users (RBAC management)\n• /admin/workflows (Threshold rules)\n• /admin/reports (Analytics & exports)\n• /admin/audit-logs (Security trail)" }
  ];

  demoRoutes.forEach((d, idx) => {
    let col = idx % 2;
    let row = Math.floor(idx / 2);
    let xPos = 0.6 + col * 6.0;
    let yPos = 1.6 + row * 2.6;

    slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 5.6, h: 2.3, rectRadius: 0.1,
      fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
    });

    slide9.addText(d.title, {
      x: xPos + 0.3, y: yPos + 0.3, w: 5.0, h: 0.35,
      fontSize: 15, bold: true, color: BLUE, fontFace: 'Arial'
    });

    slide9.addText(d.routes, {
      x: xPos + 0.3, y: yPos + 0.75, w: 5.0, h: 1.3,
      fontSize: 12, color: TEXT_MAIN, fontFace: 'Arial', lineSpacing: 18
    });
  });

  // ==========================================
  // SLIDE 10: Conclusion & Next Steps (Dark Theme)
  // ==========================================
  let slide10 = pptx.addSlide();
  slide10.background = { color: NAVY };

  slide10.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.15, fill: { color: CYAN } });

  slide10.addText("NEXT STEPS & DEPLOYMENT ROADMAP", {
    x: 0.9, y: 1.2, w: 11.5, h: 0.4,
    fontSize: 12, bold: true, color: CYAN, fontFace: 'Arial'
  });

  slide10.addText("Ready for Live Client Deployment", {
    x: 0.9, y: 1.6, w: 11.5, h: 0.8,
    fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial'
  });

  const nextSteps = [
    { step: "1", title: "Supabase Migration", desc: "Execute 20260831000000_initial_schema.sql in Supabase SQL Editor (2 mins)." },
    { step: "2", title: "Storage Setup", desc: "Create compliance-documents and invoice-attachments buckets (2 mins)." },
    { step: "3", title: "Production Hosting", desc: "Connect GitHub repository to Vercel and configure env variables (3 mins)." },
    { step: "4", title: "Client Handover", desc: "Provide Admin & Vendor demo credentials with anonymized sample profiles." }
  ];

  nextSteps.forEach((ns, idx) => {
    let yPos = 2.6 + idx * 1.0;

    slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.9, y: yPos, w: 11.53, h: 0.85, rectRadius: 0.08,
      fill: { color: SLATE }, line: { color: '334155', width: 1 }
    });

    slide10.addShape(pptx.shapes.OVAL, {
      x: 1.2, y: yPos + 0.17, w: 0.5, h: 0.5,
      fill: { color: BLUE }
    });
    slide10.addText(ns.step, {
      x: 1.2, y: yPos + 0.17, w: 0.5, h: 0.5,
      fontSize: 14, bold: true, color: WHITE, align: 'center', fontFace: 'Arial'
    });

    slide10.addText(ns.title, {
      x: 1.9, y: yPos + 0.15, w: 3.5, h: 0.5,
      fontSize: 15, bold: true, color: WHITE, fontFace: 'Arial'
    });

    slide10.addText(ns.desc, {
      x: 5.5, y: yPos + 0.15, w: 6.6, h: 0.5,
      fontSize: 13, color: '94A3B8', fontFace: 'Arial'
    });
  });

  const destPath1 = path.join("C:", "Users", "PRATIK", "Documents", "Antigravity", "Vendor_and_Customer_Management_Portal.pptx");
  const destPath2 = path.join("C:", "Users", "PRATIK", "Documents", "Antigravity", "vendor management system", "Vendor_and_Customer_Management_Portal.pptx");

  await pptx.writeFile({ fileName: destPath1 });
  console.log(`Successfully generated presentation at: ${destPath1}`);

  await pptx.writeFile({ fileName: destPath2 });
  console.log(`Successfully generated presentation at: ${destPath2}`);
}

generatePresentation().catch(err => {
  console.error("Error generating presentation:", err);
  process.exit(1);
});
