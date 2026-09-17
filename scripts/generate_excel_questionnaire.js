const ExcelJS = require('exceljs');
const path = require('path');

async function createClientQuestionnaire() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Senior Full-Stack Architect';
  workbook.lastModifiedBy = 'Enterprise Customization System';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Color Palette Constants
  const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } }; // Deep Navy
  const SECTION_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } }; // Slate Header
  const ACCENT_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } }; // Royal Blue
  const ALT_ROW_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } }; // Light Slate
  const INPUT_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } }; // Warm Amber for input cells

  const HEADER_FONT = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
  const TITLE_FONT = { name: 'Arial', size: 16, bold: true, color: { argb: '0F172A' } };
  const SUBTITLE_FONT = { name: 'Arial', size: 10, italic: true, color: { argb: '64748B' } };
  const BOLD_FONT = { name: 'Arial', size: 10, bold: true, color: { argb: '0F172A' } };
  const REGULAR_FONT = { name: 'Arial', size: 10, color: { argb: '1E293B' } };

  const THIN_BORDER = {
    top: { style: 'thin', color: { argb: 'CBD5E1' } },
    left: { style: 'thin', color: { argb: 'CBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
    right: { style: 'thin', color: { argb: 'CBD5E1' } }
  };

  // Helper to format header rows
  function styleHeaderRow(row, fill = HEADER_FILL) {
    row.eachCell((cell) => {
      cell.fill = fill;
      cell.font = HEADER_FONT;
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = THIN_BORDER;
    });
    row.height = 28;
  }

  // =========================================================================
  // TAB 1: Welcome & Client Profile
  // =========================================================================
  const sheet1 = workbook.addWorksheet('1. Welcome & Client Profile');
  sheet1.views = [{ showGridLines: true }];

  sheet1.columns = [
    { header: 'Field / Section', key: 'field', width: 32 },
    { header: 'Client Input / Requirement Response', key: 'response', width: 55 },
    { header: 'Guidance & Examples for Client', key: 'notes', width: 45 }
  ];

  sheet1.mergeCells('A1:C1');
  const titleCell1 = sheet1.getCell('A1');
  titleCell1.value = 'VENDOR & CUSTOMER PORTAL - CLIENT REQUIREMENT QUESTIONNAIRE';
  titleCell1.font = TITLE_FONT;
  titleCell1.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet1.getRow(1).height = 35;

  sheet1.mergeCells('A2:C2');
  const subCell1 = sheet1.getCell('A2');
  subCell1.value = 'Please complete the yellow-highlighted response cells to help us personalize your management portal, workflow rules, branding, and page features.';
  subCell1.font = SUBTITLE_FONT;
  sheet1.getRow(2).height = 20;

  const row3 = sheet1.addRow(['Questionnaire Category', 'Client Entry', 'System Impact / Notes']);
  styleHeaderRow(row3);

  const profileQuestions = [
    ['Client Company Legal Name', '', 'Appears on portal headers, legal footers, and invoices.'],
    ['Target Industry / Domain', '', 'e.g., Manufacturing, Logistics, IT Services, Healthcare, Retail.'],
    ['Primary Project Sponsor / Contact Person', '', 'Full Name & Designation of project lead.'],
    ['Contact Email & Phone Number', '', 'Used for portal admin communications and system alerts.'],
    ['Target Launch / Go-Live Date', '', 'Expected production launch timeline.'],
    ['Primary Operating Currency', '', 'e.g., INR (₹), USD ($), EUR (€), GBP (£), AED.'],
    ['Default Language & Locale', '', 'e.g., English (US), English (India), Multi-language support required?'],
    ['Estimated Number of Active Vendors', '', 'e.g., 100 - 500, 500 - 2,000, 5,000+ vendors.'],
    ['Estimated Number of Active Customers', '', 'e.g., 50 - 200, 200 - 1,000 customers.'],
    ['Estimated Monthly Invoice Volume', '', 'e.g., 500 invoices/month, 5,000 invoices/month.']
  ];

  profileQuestions.forEach((q) => {
    const r = sheet1.addRow(q);
    r.getCell(1).font = BOLD_FONT;
    r.getCell(2).font = REGULAR_FONT;
    r.getCell(2).fill = INPUT_FILL; // Yellow input highlight
    r.getCell(3).font = SUBTITLE_FONT;
    r.eachCell(c => c.border = THIN_BORDER);
    r.height = 24;
  });

  // =========================================================================
  // TAB 2: Branding & Visual Personalization
  // =========================================================================
  const sheet2 = workbook.addWorksheet('2. Branding & Styling');
  sheet2.views = [{ showGridLines: true }];

  sheet2.columns = [
    { header: 'Visual Element', key: 'element', width: 30 },
    { header: 'Client Preference / Selection', key: 'pref', width: 45 },
    { header: 'Options / Details', key: 'options', width: 50 }
  ];

  sheet2.mergeCells('A1:C1');
  sheet2.getCell('A1').value = 'BRANDING & VISUAL IDENTITY PERSONALIZATION';
  sheet2.getCell('A1').font = TITLE_FONT;
  sheet2.getRow(1).height = 30;

  const h2 = sheet2.addRow(['Design Parameter', 'Your Preference', 'Available Options & Recommendations']);
  styleHeaderRow(h2);

  const brandingItems = [
    ['Primary Brand Color (Hex)', '', 'e.g., #2563EB (Royal Blue), #0F172A (Navy), #059669 (Emerald)'],
    ['Accent / Secondary Color (Hex)', '', 'e.g., #0891B2 (Cyan), #D97706 (Amber), #7C3AED (Purple)'],
    ['Theme Mode Preference', '', 'Dark Mode (Sleek Dark Slate) / Light Mode (Clean Executive White) / Auto System'],
    ['Portal Main Header Title', '', 'e.g., "Acme Global Supplier Portal" or "Nexus Partner Workspace"'],
    ['Portal Subtitle / Tagline', '', 'e.g., "Centralized Compliance & Multi-Tier Invoice Processing"'],
    ['Typography / Font Preference', '', 'Inter (Modern Standard), Roboto (Clean), Outfit (Geometric), Montserrat (Bold)'],
    ['Company Logo File Link / Format', '', 'Provide URL or attach high-res SVG / PNG (Light & Dark header versions)'],
    ['Favicon Icon Request', '', 'Standard brand icon / custom favicon file link'],
    ['Hero Visual Style', '', 'Interactive 3D WebGL Particle Canvas / Modern Glassmorphism Gradient Canvas'],
    ['Card Visual Animation Style', '', 'Interactive 3D Perspective Tilt Cards / Clean Flat Cards with subtle shadow']
  ];

  brandingItems.forEach((b) => {
    const r = sheet2.addRow(b);
    r.getCell(1).font = BOLD_FONT;
    r.getCell(2).fill = INPUT_FILL;
    r.getCell(2).font = REGULAR_FONT;
    r.getCell(3).font = SUBTITLE_FONT;
    r.eachCell(c => c.border = THIN_BORDER);
    r.height = 24;
  });

  // =========================================================================
  // TAB 3: Roles, Hierarchy & RBAC
  // =========================================================================
  const sheet3 = workbook.addWorksheet('3. Roles & Hierarchy');
  sheet3.views = [{ showGridLines: true }];

  sheet3.columns = [
    { header: 'System Role', key: 'role', width: 28 },
    { header: 'Custom Client Role Name', key: 'custom_name', width: 35 },
    { header: 'Enabled? (Yes / No)', key: 'enabled', width: 20 },
    { header: 'Scope & Responsibilities', key: 'scope', width: 45 }
  ];

  sheet3.mergeCells('A1:D1');
  sheet3.getCell('A1').value = 'ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSIONS';
  sheet3.getCell('A1').font = TITLE_FONT;
  sheet3.getRow(1).height = 30;

  const h3 = sheet3.addRow(['Default System Role', 'Custom Title in Your Organization', 'Enable in Portal?', 'Role Scope & Privileges']);
  styleHeaderRow(h3);

  const roleItems = [
    ['Vendor (External)', 'Supplier / Vendor Partner', 'Yes', 'Submit onboarding docs, submit invoices, track payment advice.'],
    ['Customer (External)', 'Client / Account Partner', 'Yes', 'Complete KYC onboarding, view contracts, track support tickets.'],
    ['Document Screener (Internal)', 'Compliance Auditor / Screener', 'Yes', 'Verify vendor & customer uploaded documents, accept or request corrections.'],
    ['Vendor Operations Officer', 'Procurement & Vendor Ops Lead', 'Yes', 'Manage vendor registration queue, update vendor statuses, manage master profile.'],
    ['Department Approver', 'Department Head / Budget Owner', 'Yes', 'Approve invoices tagged to their specific department (e.g., IT, Marketing).'],
    ['Invoice Approver (Tier 2/3)', 'Senior Finance Manager / Director', 'Yes', 'Approve high-value invoices exceeding threshold amounts.'],
    ['Finance / Payout Officer', 'Accounts Payable / Disbursement Lead', 'Yes', 'Record payouts, apply TDS/penalties, issue payment vouchers & advice.'],
    ['Super Administrator', 'System Admin / Governance Lead', 'Yes', 'Full governance, manage user roles, configure workflow thresholds & settings.']
  ];

  roleItems.forEach((r) => {
    const row = sheet3.addRow(r);
    row.getCell(1).font = BOLD_FONT;
    row.getCell(2).fill = INPUT_FILL;
    row.getCell(2).font = REGULAR_FONT;
    row.getCell(3).fill = INPUT_FILL;
    row.getCell(3).font = BOLD_FONT;
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(4).font = SUBTITLE_FONT;
    row.eachCell(c => c.border = THIN_BORDER);
    row.height = 24;
  });

  // =========================================================================
  // TAB 4: Document Compliance Rules
  // =========================================================================
  const sheet4 = workbook.addWorksheet('4. Onboarding & Documents');
  sheet4.views = [{ showGridLines: true }];

  sheet4.columns = [
    { header: 'Document / Data Field', key: 'doc', width: 35 },
    { header: 'Applicable Entity', key: 'entity', width: 22 },
    { header: 'Mandatory? (Yes/No)', key: 'mandatory', width: 20 },
    { header: 'Expiry Date Alert Needed?', key: 'expiry', width: 25 },
    { header: 'Validation / Format Rule', key: 'rule', width: 35 }
  ];

  sheet4.mergeCells('A1:E1');
  sheet4.getCell('A1').value = 'VENDOR & CUSTOMER COMPLIANCE DOCUMENTATION REQUIREMENTS';
  sheet4.getCell('A1').font = TITLE_FONT;
  sheet4.getRow(1).height = 30;

  const h4 = sheet4.addRow(['Document / Compliance Field Name', 'Applies To', 'Mandatory File?', 'Track Expiry Date?', 'Validation Rules / Notes']);
  styleHeaderRow(h4);

  const docItems = [
    ['GST Registration Certificate', 'Vendor & Customer', 'Yes', 'No', 'Must match 15-digit GSTIN format.'],
    ['Permanent Account Number (PAN)', 'Vendor & Customer', 'Yes', 'No', 'Must match 10-digit PAN format.'],
    ['Cancelled Cheque / Bank Verification Letter', 'Vendor', 'Yes', 'No', 'For verifying bank account number & IFSC code.'],
    ['MSME / Udyam Registration Certificate', 'Vendor', 'Optional', 'Yes', 'For MSME payment priority (45-day statutory rule).'],
    ['ISO Certification (9001/27001)', 'Vendor', 'Optional', 'Yes', 'Send email alert 30 days prior to expiry.'],
    ['Non-Disclosure Agreement (NDA)', 'Vendor & Customer', 'Yes', 'Yes', 'Digitally signed copy upload.'],
    ['Anti-Bribery & Code of Conduct Sign-off', 'Vendor', 'Yes', 'No', 'Mandatory annual declaration checkbox.'],
    ['Certificate of Incorporation / Business License', 'Customer', 'Yes', 'No', 'Corporate KYC document.'],
    ['Authorized Signatory List & Board Resolution', 'Customer', 'Yes', 'No', 'For signing high-value contracts.'],
    ['Tax Exemption Certificate (Form 16A / 10F)', 'Vendor', 'Optional', 'Yes', 'For reduced TDS rate eligibility.']
  ];

  docItems.forEach((d) => {
    const row = sheet4.addRow(d);
    row.getCell(1).font = BOLD_FONT;
    row.getCell(2).font = REGULAR_FONT;
    row.getCell(3).fill = INPUT_FILL;
    row.getCell(3).font = BOLD_FONT;
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(4).fill = INPUT_FILL;
    row.getCell(4).font = REGULAR_FONT;
    row.getCell(4).alignment = { horizontal: 'center' };
    row.getCell(5).font = SUBTITLE_FONT;
    row.eachCell(c => c.border = THIN_BORDER);
    row.height = 24;
  });

  // =========================================================================
  // TAB 5: Invoice Approval & Workflow Thresholds
  // =========================================================================
  const sheet5 = workbook.addWorksheet('5. Invoice & Workflow Rules');
  sheet5.views = [{ showGridLines: true }];

  sheet5.columns = [
    { header: 'Workflow Parameter', key: 'param', width: 35 },
    { header: 'Client Configuration / Value', key: 'val', width: 40 },
    { header: 'System Logic & Description', key: 'desc', width: 45 }
  ];

  sheet5.mergeCells('A1:C1');
  sheet5.getCell('A1').value = 'INVOICE APPROVAL WORKFLOW & THRESHOLD CONFIGURATION';
  sheet5.getCell('A1').font = TITLE_FONT;
  sheet5.getRow(1).height = 30;

  const h5 = sheet5.addRow(['Workflow Rule Parameter', 'Your Configured Threshold / Rule', 'Business Logic & Behavior']);
  styleHeaderRow(h5);

  const wfItems = [
    ['Tier 1 Auto-Approval / Single Level Max Amount', 'e.g., $10,000 (or ₹5,00,000)', 'Invoices below this amount require single-level approval by Dept Head.'],
    ['Tier 2 Manager Approval Threshold Range', 'e.g., $10,000 - $50,000', 'Requires Dept Head + Finance Manager double sign-off.'],
    ['Tier 3 Executive / CFO Approval Minimum Amount', 'e.g., > $50,000 (or ₹25,00,000)', 'Requires CFO / VP Finance executive sign-off.'],
    ['Duplicate Invoice Check Parameters', 'Supplier ID + Invoice Number + Financial Year', 'System flags duplicate submission immediately before saving.'],
    ['Tax Deducted at Source (TDS) Default Rate', 'e.g., 1%, 2%, 10% based on section', 'Automatically deducted from invoice total during payout calculation.'],
    ['Penalty & Deduction Reason Options', 'Late Delivery, SLA Breach, Quality Rejection, Damage', 'Dropdown options for Finance officers when recording payouts.'],
    ['Allowed Supporting Document Formats', 'PDF, PNG, JPG, XLSX (Max 15 MB)', 'File types allowed for invoice attachments.'],
    ['Invoice Auto-Rejection Rule', 'If submission date > 90 days from invoice date', 'Prevents submission of stale invoices.']
  ];

  wfItems.forEach((w) => {
    const r = sheet5.addRow(w);
    r.getCell(1).font = BOLD_FONT;
    r.getCell(2).fill = INPUT_FILL;
    r.getCell(2).font = REGULAR_FONT;
    r.getCell(3).font = SUBTITLE_FONT;
    r.eachCell(c => c.border = THIN_BORDER);
    r.height = 24;
  });

  // =========================================================================
  // TAB 6: Feature Toggle & Custom Page Checklist
  // =========================================================================
  const sheet6 = workbook.addWorksheet('6. Page & Feature Checklist');
  sheet6.views = [{ showGridLines: true }];

  sheet6.columns = [
    { header: 'Page / Module Name', key: 'page', width: 30 },
    { header: 'Route Path', key: 'route', width: 25 },
    { header: 'Enable Module? (Yes/No)', key: 'enable', width: 22 },
    { header: 'Custom Page Title / Sub-Title', key: 'custom_title', width: 35 },
    { header: 'Special Feature Requests / Customization Notes', key: 'notes', width: 45 }
  ];

  sheet6.mergeCells('A1:E1');
  sheet6.getCell('A1').value = 'PAGE & FEATURE MODULE ENABLEMENT CHECKLIST';
  sheet6.getCell('A1').font = TITLE_FONT;
  sheet6.getRow(1).height = 30;

  const h6 = sheet6.addRow(['Page / Module Name', 'Portal Route', 'Include Page?', 'Your Preferred Page Title', 'Custom Specific Options Needed']);
  styleHeaderRow(h6);

  const pageChecklist = [
    ['Public Landing Page', '/', 'Yes', 'Enterprise Vendor & Customer Portal', 'Interactive 3D hero canvas + role selection links.'],
    ['Vendor Registration Wizard', '/register/vendor', 'Yes', 'Vendor Onboarding Portal', '10-Step wizard with GST/PAN auto-format checks.'],
    ['Customer Onboarding Wizard', '/register/customer', 'Yes', 'Customer Account Registration', 'KYC document upload + company credit form.'],
    ['Role Switcher Demo Bar', 'Header Bar', 'Yes', 'Role Simulator Bar', 'Interactive 8-role toggle bar for demo testing.'],
    ['Vendor Dashboard', '/vendor/dashboard', 'Yes', 'Vendor Workspace Overview', 'KPI summary cards, document status, invoice timeline.'],
    ['Vendor Documents Vault', '/vendor/documents', 'Yes', 'Compliance Document Management', 'Upload new versions, track expiry dates & correction notes.'],
    ['Vendor Invoice Submission', '/vendor/invoices/new', 'Yes', 'Create New Invoice', 'Line item calculator, tax breakdown, attachment dropzone.'],
    ['Vendor Payment Advice', '/vendor/payments', 'Yes', 'Payment History & Remittances', 'View net payout breakdown, TDS deductions, download advice PDF.'],
    ['Customer Dashboard', '/customer/dashboard', 'Yes', 'Customer Portal Overview', 'Account verification status, active contracts, support tickets.'],
    ['Document Review Queue', '/admin/document-reviews', 'Yes', 'Compliance Document Verification Desk', 'Side-by-side viewer, Approve/Reject/Correction modal.'],
    ['Invoice Approvals Queue', '/admin/approvals', 'Yes', 'Multi-Tier Invoice Approvals', 'Threshold routing queue, historical approval log.'],
    ['Finance Disbursement Center', '/admin/payments', 'Yes', 'Payment Settlement Desk', 'Net payout math, TDS calculation, payment voucher generation.'],
    ['Support Ticketing Center', '/admin/tickets', 'Yes', 'Helpdesk & Ticket Management', 'Role-based tickets, priority SLA, email notification dispatch.'],
    ['Analytics & Report Exports', '/admin/reports', 'Yes', 'Executive Reports & CSV Exports', 'Recharts interactive charts + CSV export engine.'],
    ['Audit Trail & Security Logs', '/admin/audit-logs', 'Yes', 'System Security Audit Trail', 'Immutable action logs with IP, User ID & timestamp filter.']
  ];

  pageChecklist.forEach((p) => {
    const r = sheet6.addRow(p);
    r.getCell(1).font = BOLD_FONT;
    r.getCell(2).font = REGULAR_FONT;
    r.getCell(3).fill = INPUT_FILL;
    r.getCell(3).font = BOLD_FONT;
    r.getCell(3).alignment = { horizontal: 'center' };
    r.getCell(4).fill = INPUT_FILL;
    r.getCell(4).font = REGULAR_FONT;
    r.getCell(5).font = SUBTITLE_FONT;
    r.eachCell(c => c.border = THIN_BORDER);
    r.height = 24;
  });

  // =========================================================================
  // TAB 7: AI Prompt Customization Generator
  // =========================================================================
  const sheet7 = workbook.addWorksheet('7. AI Prompt Summary');
  sheet7.views = [{ showGridLines: true }];

  sheet7.columns = [
    { header: 'Prompt Category', key: 'cat', width: 28 },
    { header: 'Generated Personalization Prompt Instruction', key: 'prompt', width: 85 }
  ];

  sheet7.mergeCells('A1:B1');
  sheet7.getCell('A1').value = 'AUTOMATED PROMPT GENERATOR FOR AI PERSONALIZATION';
  sheet7.getCell('A1').font = TITLE_FONT;
  sheet7.getRow(1).height = 30;

  const h7 = sheet7.addRow(['System Aspect', 'AI Prompt Instruction (Constructed from Client Responses)']);
  styleHeaderRow(h7);

  const promptItems = [
    ['Visual & Branding Prompt', 'Configure the application color palette with Primary Hex Code from Tab 2, applying selected font family across all UI components, custom logo URLs, and selected hero style (3D WebGL vs Glassmorphic gradient).'],
    ['Role & Permission Prompt', 'Customize the 8 RBAC system roles using the exact custom titles specified in Tab 3, updating permissions and sidebar menu access to match the enabled role scopes.'],
    ['Document Compliance Prompt', 'Update validation schemas (Zod/React Hook Form) to enforce mandatory document rules from Tab 4, enabling expiry date alert notifications for selected certificates.'],
    ['Workflow & Threshold Prompt', 'Configure the workflow engine (workflowEngine.ts) with Tier 1, Tier 2, and Tier 3 threshold amounts specified in Tab 5, applying the client\'s default TDS percentage and duplicate invoice check rules.'],
    ['Page Configuration Prompt', 'Enable/disable page routes according to Tab 6 checklist, updating page headers, titles, breadcrumbs, and feature options to match the client\'s exact selections.']
  ];

  promptItems.forEach((p) => {
    const r = sheet7.addRow(p);
    r.getCell(1).font = BOLD_FONT;
    r.getCell(2).font = REGULAR_FONT;
    r.getCell(2).alignment = { wrapText: true };
    r.eachCell(c => c.border = THIN_BORDER);
    r.height = 35;
  });

  // Save Excel file to both locations
  const destPath1 = path.join('C:', 'Users', 'PRATIK', 'Documents', 'Antigravity', 'Client_Requirements_Questionnaire.xlsx');
  const destPath2 = path.join('C:', 'Users', 'PRATIK', 'Documents', 'Antigravity', 'vendor management system', 'Client_Requirements_Questionnaire.xlsx');

  await workbook.xlsx.writeFile(destPath1);
  console.log(`Successfully generated workbook at: ${destPath1}`);

  await workbook.xlsx.writeFile(destPath2);
  console.log(`Successfully generated workbook at: ${destPath2}`);
}

createClientQuestionnaire().catch((err) => {
  console.error('Error creating Excel questionnaire:', err);
  process.exit(1);
});
