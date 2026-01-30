/**
 * Remonline Forms & Documents - Component Exports
 * Central export point for all form-related components
 */

export { UnifiedRemonlineForm } from './UnifiedRemonlineForm';
export type { } from './UnifiedRemonlineForm';

export { DocumentTemplates } from './DocumentTemplates';
export type { } from './DocumentTemplates';

// Re-export types
export type {
  RepairOrderForm,
  CallbackForm,
  DiagnosticForm,
  DocumentRequestForm,
  RemonlineDocument,
  DocumentItem,
  RemonlineFormResponse,
  DocumentGenerationResponse,
  FormValidationResult,
  RemonlineFormType,
  DocumentType,
  Language,
} from '@/types';

// Export examples for reference
export * from './REMONLINE-EXAMPLES';
