/**
 * NEXX GSM PDF Document Generator
 * Handles conversion of templates to PDF, HTML, DOCX formats
 */

import { NEXX_TEMPLATES } from '@/templates/nexx-document-templates';

type TemplateType = 'intake' | 'release' | 'buyback' | 'recycling';
type Language = 'uk' | 'ru' | 'en' | 'ro';
type Format = 'pdf' | 'html' | 'docx';

interface DocumentData {
  [key: string]: any;
}

/** Escape HTML entities to prevent XSS */
const escapeHtml = (str: unknown): string => {
  const s = String(str ?? '')
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Generate HTML document from template
 */
export const generateHTMLDocument = (
  templateType: TemplateType,
  language: Language = 'en',
  data: DocumentData = {}
): string => {
  const template = NEXX_TEMPLATES[templateType];
  const templateLang = template[language] || template.en;

  const getFieldValue = (fieldKey: string): string => {
    return data[fieldKey] ? escapeHtml(data[fieldKey]) : `_________________`;
  };

  let content = ``;

  // Base HTML structure
  content = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateLang.title}</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .page-break { page-break-after: always; }
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #000;
      margin-bottom: 20px;
      padding-bottom: 10px;
    }
    
    .company-info h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    
    .company-info p {
      margin: 5px 0;
      font-size: 12px;
      color: #666;
    }
    
    .document-title h2 {
      margin: 0;
      font-size: 18px;
      text-align: right;
    }
    
    .document-title p {
      margin: 5px 0;
      font-size: 11px;
      text-align: right;
      color: #666;
    }
    
    .section {
      margin: 20px 0;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 14px;
      text-decoration: underline;
      margin-bottom: 10px;
    }
    
    .field-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .field {
      font-size: 12px;
    }
    
    .field-label {
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 3px;
    }
    
    .field-value {
      border-bottom: 1px solid #999;
      min-height: 20px;
      padding: 2px;
    }
    
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #000;
    }
    
    .signature-block {
      text-align: center;
      font-size: 12px;
    }
    
    .signature-line {
      border-bottom: 2px solid #000;
      min-height: 50px;
      margin: 20px 0;
    }
    
    .footer {
      border-top: 2px solid #000;
      margin-top: 20px;
      padding-top: 10px;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    
    table th, table td {
      border: 1px solid #999;
      padding: 8px;
      text-align: left;
      font-size: 12px;
    }
    
    table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    ${renderHeaderHTML(templateLang, data)}
    ${renderContentHTML(templateType, templateLang, data)}
    ${renderSignaturesHTML(templateLang)}
    ${renderFooterHTML()}
  </div>
</body>
</html>
  `.trim();

  return content;
};

/**
 * Render header section
 */
const renderHeaderHTML = (template: any, data: DocumentData): string => {
  return `
    <div class="header">
      <div class="company-info">
        <h1>NEXX GSM</h1>
        <p>Service Center</p>
        <p>Str. Victoriei 15, Bucharest, Romania</p>
        <p>Phone: +40 721 234 567</p>
        <p>Email: info@nexxgsm.ro</p>
      </div>
      <div class="document-title">
        <h2>${escapeHtml(template.title)}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  `;
};

/**
 * Render content based on template type
 */
const renderContentHTML = (templateType: TemplateType, template: any, data: DocumentData): string => {
  let html = ``;

  // Intake template
  if (templateType === 'intake') {
    html += `
      <div class="section">
        <div class="section-title">${template.sections[0] || 'Customer Information'}</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Order Number:</div>
            <div class="field-value">${escapeHtml(data.orderNumber)}</div>
          </div>
          <div class="field">
            <div class="field-label">Date of Intake:</div>
            <div class="field-value">${escapeHtml(data.date || new Date().toLocaleDateString())}</div>
          </div>
          <div class="field">
            <div class="field-label">Customer Name:</div>
            <div class="field-value">${escapeHtml(data.customerName)}</div>
          </div>
          <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">${escapeHtml(data.customerPhone)}</div>
          </div>
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${escapeHtml(data.customerEmail)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${template.sections[1] || 'Device Information'}</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Device Type:</div>
            <div class="field-value">${escapeHtml(data.deviceType)}</div>
          </div>
          <div class="field">
            <div class="field-label">Brand:</div>
            <div class="field-value">${escapeHtml(data.deviceBrand)}</div>
          </div>
          <div class="field">
            <div class="field-label">Model:</div>
            <div class="field-value">${escapeHtml(data.deviceModel)}</div>
          </div>
          <div class="field">
            <div class="field-label">Color:</div>
            <div class="field-value">${escapeHtml(data.deviceColor)}</div>
          </div>
          <div class="field">
            <div class="field-label">Serial Number:</div>
            <div class="field-value">${escapeHtml(data.deviceSerial)}</div>
          </div>
          <div class="field">
            <div class="field-label">IMEI:</div>
            <div class="field-value">${escapeHtml(data.deviceIMEI)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${template.sections[2] || 'Condition & Accessories'}</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Device Condition:</div>
            <div class="field-value" style="min-height: 40px;">${escapeHtml(data.condition)}</div>
          </div>
          <div class="field">
            <div class="field-label">Visible Damage:</div>
            <div class="field-value" style="min-height: 40px;">${escapeHtml(data.damage)}</div>
          </div>
          <div class="field">
            <div class="field-label">Accessories Received:</div>
            <div class="field-value" style="min-height: 40px;">${escapeHtml(data.accessories)}</div>
          </div>
          <div class="field">
            <div class="field-label">Estimated Repair Cost:</div>
            <div class="field-value">${escapeHtml(data.estimatedPrice)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${template.sections[3] || 'Special Notes'}</div>
        <div class="field">
          <div class="field-value" style="min-height: 60px;">${escapeHtml(data.notes)}</div>
        </div>
      </div>
    `;
  }

  // Release template
  if (templateType === 'release') {
    html += `
      <div class="section">
        <div class="section-title">${template.sections[0] || 'Repair Information'}</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Order Number:</div>
            <div class="field-value">${escapeHtml(data.orderNumber)}</div>
          </div>
          <div class="field">
            <div class="field-label">Release Date:</div>
            <div class="field-value">${escapeHtml(data.releaseDate || new Date().toLocaleDateString())}</div>
          </div>
          <div class="field">
            <div class="field-label">Repair Start Date:</div>
            <div class="field-value">${escapeHtml(data.repairStartDate)}</div>
          </div>
          <div class="field">
            <div class="field-label">Repair End Date:</div>
            <div class="field-value">${escapeHtml(data.repairEndDate)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${template.sections[1] || 'Work Completed'}</div>
        <div class="field">
          <div class="field-value" style="min-height: 60px;">${escapeHtml(data.repairWork)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${template.sections[2] || 'Pricing'}</div>
        <table>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>Subtotal</td>
            <td>${escapeHtml(data.subtotal || '___________')}</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td>${escapeHtml(data.tax || '___________')}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td>Total Cost</td>
            <td>${escapeHtml(data.totalCost || '___________')}</td>
          </tr>
          <tr>
            <td>Amount Paid</td>
            <td>${escapeHtml(data.paid || '___________')}</td>
          </tr>
          <tr>
            <td>Remaining</td>
            <td>${escapeHtml(data.remaining || '___________')}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">${template.sections[3] || 'Warranty'}</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Warranty Period (Days):</div>
            <div class="field-value">${escapeHtml(data.warranty || '30')}</div>
          </div>
          <div class="field">
            <div class="field-label">Warranty Valid Until:</div>
            <div class="field-value">${escapeHtml(data.warrantyValid)}</div>
          </div>
        </div>
      </div>
    `;
  }

  return html;
};

/**
 * Render signatures section
 */
const renderSignaturesHTML = (template: any): string => {
  return `
    <div class="signatures">
      <div class="signature-block">
        <p>Technician Signature</p>
        <div class="signature-line"></div>
        <p style="font-size: 10px;">Print Name: _________________</p>
      </div>
      <div class="signature-block">
        <p>Client Signature</p>
        <div class="signature-line"></div>
        <p style="font-size: 10px;">Print Name: _________________</p>
      </div>
    </div>
  `;
};

/**
 * Render footer
 */
const renderFooterHTML = (): string => {
  return `
    <div class="footer">
      <p>NEXX GSM Service Center © 2026 • Professional Device Repair</p>
      <p>All work is guaranteed for 30 days from completion date</p>
      <p>Document ID: ${Date.now()}</p>
    </div>
  `;
};

/**
 * Export document as HTML file
 */
export const exportHTML = (htmlContent: string, filename: string = 'document.html') => {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Print HTML document
 */
export const printDocument = (htmlContent: string) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  }
};

/**
 * Convert to PDF (requires external library like jsPDF)
 */
export const exportPDF = async (
  htmlContent: string,
  filename: string = 'document.pdf'
) => {
  try {
    // Try to use jsPDF if available (bundler may provide require)
    // @ts-expect-error - optional dependency
    const { jsPDF } = require('jspdf');
    // @ts-expect-error - optional dependency
    const html2Canvas = require('html2canvas');
    
    // Get HTML element
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    // Convert to canvas
    const canvas = await html2Canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add image to PDF, creating new pages as needed
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save PDF
    doc.save(filename);
  } catch (error) {
    console.warn('PDF export error:', error instanceof Error ? error.message : String(error));
    console.log('Fallback: Use browser print to save as PDF');
    
    // Fallback: Use browser print dialog
    printDocument(htmlContent);
  }
};

export default {
  generateHTMLDocument,
  exportHTML,
  printDocument,
  exportPDF,
};
