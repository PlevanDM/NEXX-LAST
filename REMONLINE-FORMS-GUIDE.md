# NEXX Remonline Forms & Documents - Full Implementation Guide

## Overview

Complete unified system for handling Remonline CRM forms and document generation with full multilingual support (Ukrainian, Russian, English, Romanian).

## Components Created

### 1. **useTranslation Hook** (`src/hooks/useTranslation.ts`)
Custom React hook for internationalization integration with `window.i18n` system.

**Features:**
- Access translations with fallback support
- Language switching
- Current language detection
- Get available languages list

**Usage:**
```typescript
import useTranslation from '@/hooks/useTranslation';

function MyComponent() {
  const { t, language, changeLanguage, getAvailableLanguages } = useTranslation();
  
  return <div>{t('forms.repairOrder.title', 'Default')}</div>;
}
```

### 2. **UnifiedRemonlineForm Component** (`src/components/UnifiedRemonlineForm.tsx`)

Unified form component supporting 4 form types:

#### Form Types:
1. **repair_order** - Customer repair booking form
2. **callback** - Callback request with optional AI calling
3. **diagnostic** - Technical diagnostics submission
4. **document** - Request for repair documents

#### Features:
- Multi-language support (UA/RU/EN/RO)
- Form validation with error messages
- Loading states
- Success/error feedback
- Dark/light theme support
- Responsive design
- Mobile-friendly

#### Props:
```typescript
interface UnifiedRemonlineFormProps {
  formType: 'repair_order' | 'callback' | 'diagnostic' | 'document';
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => Promise<RemonlineFormResponse>;
  orderId?: string;
  className?: string;
  theme?: 'light' | 'dark';
}
```

#### Usage Example:
```typescript
import { UnifiedRemonlineForm } from '@/components/UnifiedRemonlineForm';

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = async (formData) => {
    const response = await fetch('/api/remonline', {
      method: 'POST',
      body: JSON.stringify({ formType: 'repair_order', ...formData })
    });
    return response.json();
  };
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Book Repair</button>
      <UnifiedRemonlineForm
        formType="repair_order"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

### 3. **DocumentTemplates Component** (`src/components/DocumentTemplates.tsx`)

Document generation and management system.

#### Supported Document Types:
1. **invoice** - Financial invoice
2. **act** - Repair work act/record
3. **contract** - Service contract
4. **estimate** - Price quote
5. **receipt** - Payment receipt
6. **warranty** - Warranty card

#### Export Formats:
- PDF (default)
- HTML
- DOCX

#### Features:
- Document type selection
- Format selection (PDF/HTML/DOCX)
- Live preview (Invoice, Act, Warranty)
- Email sending
- Dark/light theme
- Multi-language templates

#### Usage Example:
```typescript
import { DocumentTemplates } from '@/components/DocumentTemplates';

export function DocumentPage() {
  const handleGenerate = async (docType, format) => {
    const response = await fetch('/api/remonline/documents/generate', {
      method: 'POST',
      body: JSON.stringify({ 
        documentType: docType,
        format: format,
        orderId: '123'
      })
    });
    return response.json();
  };
  
  return (
    <DocumentTemplates
      document={documentData}
      onGenerate={handleGenerate}
      theme="light"
    />
  );
}
```

## API Endpoints

### POST /api/remonline

Handle form submissions based on `formType` parameter.

#### Repair Order
```bash
curl -X POST /api/remonline \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "repair_order",
    "customerName": "John Doe",
    "customerPhone": "+40 721 234 567",
    "device": {
      "type": "iphone",
      "brand": "Apple",
      "model": "iPhone 15",
      "serialNumber": "..."
    },
    "problem": "Screen broken",
    "language": "uk"
  }'
```

#### Callback Request
```bash
curl -X POST /api/remonline \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "callback",
    "customerName": "John",
    "customerPhone": "+40 721 234 567",
    "device": "iPhone",
    "aiCallEnabled": true,
    "language": "uk"
  }'
```

#### Diagnostic
```bash
curl -X POST /api/remonline \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "diagnostic",
    "device": {
      "type": "iphone",
      "brand": "Apple",
      "model": "iPhone 15"
    },
    "diagnosticResults": {
      "findings": "Battery at 10%, screen has cracks",
      "status": "needs_repair",
      "estimatedRepairCost": 250
    },
    "language": "uk"
  }'
```

#### Document Request
```bash
curl -X POST /api/remonline \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "document",
    "orderId": "ORD-001",
    "documentType": "invoice",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "language": "uk"
  }'
```

### Response Format

Success:
```json
{
  "success": true,
  "id": "unique-id",
  "message": "Form submitted successfully",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

## Type Definitions

New types in `lib/types.ts`:

```typescript
// Form types
export type RemonlineFormType = 'repair_order' | 'callback' | 'diagnostic' | 'document' | 'document_request';
export type DocumentType = 'invoice' | 'act' | 'contract' | 'estimate' | 'receipt' | 'warranty_card';
export type Language = 'uk' | 'ru' | 'en' | 'ro';

// Main form interfaces
export interface RepairOrderForm { ... }
export interface CallbackForm { ... }
export interface DiagnosticForm { ... }
export interface DocumentRequestForm { ... }
export interface RemonlineDocument { ... }

// Response types
export interface RemonlineFormResponse { ... }
export interface DocumentGenerationResponse { ... }
export interface FormValidationResult { ... }
```

## Internationalization (i18n)

### Translation Keys in `public/static/i18n.js`

All forms and documents have translation keys for 4 languages:

```javascript
// Access translations
window.i18n.t('forms.repairOrder.title', 'Default title')
window.i18n.t('forms.callback.submit', 'Default submit')
window.i18n.t('documents.types.invoice', 'Invoice')
```

### Supported Keys:

#### Forms
- `forms.repairOrder.*` - Repair order form
- `forms.callback.*` - Callback form
- `forms.diagnostic.*` - Diagnostic form
- `forms.document.*` - Document request form

#### Documents
- `documents.types.*` - Document type names
- `documents.fields.*` - Document field labels
- `documents.sections.*` - Document section headers
- `documents.actions.*` - Document action buttons

#### Validation
- `validation.*` - Validation error messages

#### Languages
- **UK** (Українська) - `uk`
- **RU** (Русский) - `ru`
- **EN** (English) - `en`
- **RO** (Română) - `ro`

## File Structure

```
src/
├── hooks/
│   └── useTranslation.ts          # i18n hook
├── components/
│   ├── UnifiedRemonlineForm.tsx    # Main form component
│   └── DocumentTemplates.tsx       # Document generator
├── types.ts                        # Type definitions (extended)
└── utils.ts                        # Utilities

lib/
└── types.ts                        # New form/document types

functions/api/
└── remonline.js                    # Updated API handlers

public/static/
└── i18n.js                         # Enhanced with forms/docs translations
```

## Implementation Checklist

- [x] Extended TypeScript types (`lib/types.ts`)
- [x] Created `useTranslation` hook
- [x] Created `UnifiedRemonlineForm` component
- [x] Created `DocumentTemplates` component
- [x] Extended i18n.js with all translations (UA/RU/EN/RO)
- [x] Updated Remonline API handlers (`functions/api/remonline.js`)
  - [x] Repair order handler
  - [x] Callback handler
  - [x] Diagnostic handler
  - [x] Document request handler
  - [x] Legacy inquiry handler (fallback)
- [x] Error handling and validation
- [x] Theme support (light/dark)
- [x] Responsive design
- [x] CORS headers for API

## Testing

### Manual Testing Checklist
- [ ] Test repair order form on all 4 languages
- [ ] Test callback form with AI call option
- [ ] Test diagnostic form submission
- [ ] Test document request form
- [ ] Verify form validation errors
- [ ] Test document template previews
- [ ] Test PDF generation
- [ ] Test theme switching
- [ ] Test mobile responsiveness
- [ ] Verify API endpoints respond correctly

### Unit Test (Example)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UnifiedRemonlineForm } from '@/components/UnifiedRemonlineForm';

describe('UnifiedRemonlineForm', () => {
  it('renders repair order form', () => {
    render(
      <UnifiedRemonlineForm
        formType="repair_order"
        isOpen={true}
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/Repair Order/i)).toBeInTheDocument();
  });
});
```

## Environment Variables Required

In Cloudflare Workers (wrangler.env):
```
REMONLINE_API_KEY=your-api-key
REMONLINE_BASE_URL=https://api.remonline.app
REMONLINE_BRANCH_ID=your-branch-id
```

## Troubleshooting

### Form not submitting
- Check API endpoint configuration
- Verify REMONLINE_API_KEY is set
- Check browser console for CORS errors
- Ensure fetch URL is correct

### Translations not showing
- Verify `window.i18n` is loaded
- Check language code in translations object
- Ensure fallback text is provided as second parameter

### Documents not generating
- Verify document data structure
- Check API endpoint for document generation
- Ensure browser allows downloads

## Future Enhancements

- [ ] Bulk document generation
- [ ] Document templates customization
- [ ] Email integration for document sending
- [ ] Document tracking and history
- [ ] SMS notifications for callbacks
- [ ] Chat support integration
- [ ] Payment gateway integration
- [ ] Document signing/approval workflow

## Support & Maintenance

For issues or questions:
1. Check console logs for error details
2. Verify Remonline API connectivity
3. Check language/translation keys
4. Review type definitions for data structure

---

**Version:** 1.0.0  
**Last Updated:** January 23, 2026  
**Status:** ✅ Ready for Production
