const ExcelJS = require('exceljs');
const path = require('path');

async function createSimpleQuestionnaire() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Senior Full-Stack Architect';
  workbook.created = new Date();

  // Styles
  const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } }; // Dark Slate
  const INPUT_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } }; // Yellow input box
  
  const HEADER_FONT = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFF' } };
  const TITLE_FONT = { name: 'Arial', size: 16, bold: true, color: { argb: '0F172A' } };
  const BOLD_FONT = { name: 'Arial', size: 11, bold: true, color: { argb: '0F172A' } };
  const REGULAR_FONT = { name: 'Arial', size: 11, color: { argb: '1E293B' } };
  const HINT_FONT = { name: 'Arial', size: 10, italic: true, color: { argb: '64748B' } };

  const THIN_BORDER = {
    top: { style: 'thin', color: { argb: 'CBD5E1' } },
    left: { style: 'thin', color: { argb: 'CBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
    right: { style: 'thin', color: { argb: 'CBD5E1' } }
  };

  // =========================================================================
  // TAB 1: 1-Page Quick Questionnaire (10 Simple Questions)
  // =========================================================================
  const sheet1 = workbook.addWorksheet('Quick Setup Form');
  sheet1.views = [{ showGridLines: true }];

  sheet1.columns = [
    { header: '#', key: 'num', width: 6 },
    { header: 'Question / Requirement', key: 'q', width: 35 },
    { header: 'Your Answer (Fill Here)', key: 'ans', width: 45 },
    { header: 'Examples / Options', key: 'example', width: 40 }
  ];

  sheet1.mergeCells('A1:D1');
  sheet1.getCell('A1').value = 'PORTAL SETUP QUESTIONNAIRE (EASY VERSION)';
  sheet1.getCell('A1').font = TITLE_FONT;
  sheet1.getRow(1).height = 32;

  sheet1.mergeCells('A2:D2');
  sheet1.getCell('A2').value = 'Please type your answers in the yellow boxes below. Takes only 5 minutes!';
  sheet1.getCell('A2').font = HINT_FONT;
  sheet1.getRow(2).height = 20;

  const h1 = sheet1.addRow(['#', 'Requirement Question', 'Your Answer', 'Examples']);
  h1.eachCell((c) => {
    c.fill = HEADER_FILL;
    c.font = HEADER_FONT;
    c.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  h1.height = 28;

  const questions = [
    ['1', 'Company Name', '', 'e.g., Acme Corporation'],
    ['2', 'Primary Brand Color', '', 'e.g., Royal Blue, Emerald Green, Dark Navy'],
    ['3', 'Who will use this portal?', '', 'Both Vendors & Customers / Vendors Only'],
    ['4', 'Required Vendor Documents', '', 'GST, PAN, Cancelled Cheque, MSME, NDA'],
    ['5', 'Invoice Auto-Approval Limit', '', 'e.g., Invoices under $10,000 (or ₹5,00,000)'],
    ['6', 'Who approves big invoices (>$10k)?', '', 'e.g., Finance Director / CFO'],
    ['7', 'Default Payment Currency', '', 'e.g., INR (₹) or USD ($)'],
    ['8', 'Standard Payment Terms', '', 'e.g., Net 30 Days / Net 45 Days'],
    ['9', 'Tax / TDS Deduction Rate', '', 'e.g., 2% TDS or 10% TDS'],
    ['10', 'Any Extra Feature Needed?', '', 'e.g., WhatsApp Alerts, SAP Integration']
  ];

  questions.forEach((q) => {
    const r = sheet1.addRow(q);
    r.getCell(1).font = BOLD_FONT;
    r.getCell(1).alignment = { horizontal: 'center' };
    r.getCell(2).font = BOLD_FONT;
    r.getCell(3).fill = INPUT_FILL;
    r.getCell(3).font = REGULAR_FONT;
    r.getCell(4).font = HINT_FONT;
    r.eachCell(c => c.border = THIN_BORDER);
    r.height = 26;
  });

  // =========================================================================
  // TAB 2: Simple Page Checklist
  // =========================================================================
  const sheet2 = workbook.addWorksheet('Page Checklist');
  sheet2.views = [{ showGridLines: true }];

  sheet2.columns = [
    { header: 'Page Name', key: 'page', width: 30 },
    { header: 'Keep in Site? (Yes / No)', key: 'keep', width: 25 },
    { header: 'What it does (Simple Note)', key: 'note', width: 50 }
  ];

  sheet2.mergeCells('A1:C1');
  sheet2.getCell('A1').value = 'WHICH PAGES DO YOU WANT IN YOUR PORTAL?';
  sheet2.getCell('A1').font = TITLE_FONT;
  sheet2.getRow(1).height = 30;

  const h2 = sheet2.addRow(['Page Name', 'Keep in Website? (Yes / No)', 'Description']);
  h2.eachCell((c) => {
    c.fill = HEADER_FILL;
    c.font = HEADER_FONT;
    c.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  h2.height = 28;

  const pages = [
    ['Home Page (3D Landing)', 'Yes', 'Main introduction page with sign-in buttons.'],
    ['Vendor Registration Form', 'Yes', 'Form for new vendors to sign up & upload documents.'],
    ['Vendor Dashboard', 'Yes', 'Where vendors view status & submit invoices.'],
    ['Customer Registration', 'Yes', 'Form for new customers to complete onboarding.'],
    ['Document Review Desk', 'Yes', 'Where your staff approves or rejects vendor documents.'],
    ['Invoice Approval Queue', 'Yes', 'Where managers approve vendor bills & invoices.'],
    ['Finance Payout Desk', 'Yes', 'Where finance records payment completion & TDS.'],
    ['Reports & Audit Logs', 'Yes', 'Where admins download CSV reports & track activity.']
  ];

  pages.forEach((p) => {
    const r = sheet2.addRow(p);
    r.getCell(1).font = BOLD_FONT;
    r.getCell(2).fill = INPUT_FILL;
    r.getCell(2).font = BOLD_FONT;
    r.getCell(2).alignment = { horizontal: 'center' };
    r.getCell(3).font = REGULAR_FONT;
    r.eachCell(c => c.border = THIN_BORDER);
    r.height = 25;
  });

  // Save Excel file to both locations
  const destPath1 = path.join('C:', 'Users', 'PRATIK', 'Documents', 'Antigravity', 'Client_Requirements_Simple.xlsx');
  const destPath2 = path.join('C:', 'Users', 'PRATIK', 'Documents', 'Antigravity', 'vendor management system', 'Client_Requirements_Simple.xlsx');

  await workbook.xlsx.writeFile(destPath1);
  console.log(`Successfully generated simple questionnaire at: ${destPath1}`);

  await workbook.xlsx.writeFile(destPath2);
  console.log(`Successfully generated simple questionnaire at: ${destPath2}`);
}

createSimpleQuestionnaire().catch((err) => {
  console.error('Error creating simple questionnaire:', err);
  process.exit(1);
});
