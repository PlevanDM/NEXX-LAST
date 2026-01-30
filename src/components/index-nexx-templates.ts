/**
 * NEXX GSM Document Templates Components
 */

export { NexxDocumentTemplates } from './NexxDocumentTemplates';
export type { } from './NexxDocumentTemplates';

export { DocumentGenerator } from './DocumentGenerator';
export type { DocumentGeneratorProps } from './DocumentGenerator';

// Export examples for reference
export * from './NEXX-TEMPLATES-EXAMPLES';

// Re-export utils
export { generateHTMLDocument, exportHTML, printDocument, exportPDF } from '@/utils/nexx-pdf-generator';

// Re-export templates
export { NEXX_TEMPLATES } from '@/templates/nexx-document-templates';
