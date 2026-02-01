// REMONLINE FORMS - USAGE EXAMPLES
// Примеры использования унифицированной системы форм и документов
// Examples of using the unified forms and documents system

// ============================================
// EXAMPLE 1: Repair Order Form
// ============================================

import React, { useState } from 'react';
import { UnifiedRemonlineForm } from '@/components/UnifiedRemonlineForm';
import { RemonlineFormResponse } from '@/types';

export function RepairOrderExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/remonline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'repair_order',
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        Book Repair
      </button>

      <UnifiedRemonlineForm
        formType="repair_order"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        theme="light"
      />
    </>
  );
}

// ============================================
// EXAMPLE 2: Callback Request with AI
// ============================================

export function CallbackFormExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCallbackSubmit = async (formData) => {
    const payload = {
      formType: 'callback',
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      device: formData.device,
      problem: formData.problem,
      preferredTime: formData.preferredTime,
      aiCallEnabled: formData.aiCallEnabled || true, // AI calling enabled by default
      language: 'uk', // Auto-detect from window.i18n
    };

    try {
      const response = await fetch('/api/remonline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.aiCallEnabled) {
        // AI will call within 10 seconds
        console.log('AI assistant will call shortly...');
      }

      return data;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded">
        Request Callback
      </button>

      <UnifiedRemonlineForm
        formType="callback"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCallbackSubmit}
        theme="light"
      />
    </>
  );
}

// ============================================
// EXAMPLE 3: Diagnostic Form (Internal Use)
// ============================================

export function DiagnosticFormExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDiagnosticSubmit = async (formData) => {
    return await fetch('/api/remonline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'diagnostic',
        ...formData,
      }),
    }).then((res) => res.json());
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-purple-600 text-white rounded">
        Submit Diagnostic
      </button>

      <UnifiedRemonlineForm
        formType="diagnostic"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleDiagnosticSubmit}
      />
    </>
  );
}

// ============================================
// EXAMPLE 4: Document Request Form
// ============================================

export function DocumentRequestExample({ orderId }: { orderId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDocumentRequest = async (formData: Record<string, unknown>) => {
    return await fetch('/api/remonline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'document',
        orderId: orderId, // Pass the order ID
        ...formData,
      }),
    }).then((res) => res.json());
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-amber-600 text-white rounded">
        Request Document
      </button>

      <UnifiedRemonlineForm
        formType="document"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleDocumentRequest}
        orderId={orderId}
      />
    </>
  );
}

// ============================================
// EXAMPLE 5: Document Templates
// ============================================

import { DocumentTemplates } from '@/components/DocumentTemplates';
import { RemonlineDocument, DocumentGenerationResponse } from '@/types';

export function DocumentTemplatesExample({ document }: { document: RemonlineDocument }) {
  const handleGenerateDocument = async (docType, format) => {
    try {
      const response = await fetch('/api/remonline/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          format: format, // 'pdf', 'html', or 'docx'
          orderId: document.order.id,
          documentId: document.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const data: DocumentGenerationResponse = await response.json();

      if (data.success && data.downloadUrl) {
        // Open download in new tab
        window.open(data.downloadUrl, '_blank');
      }

      return data;
    } catch (error) {
      console.error('Error generating document:', error);
      return {
        success: false,
        format: format,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return (
    <DocumentTemplates
      document={document}
      onGenerate={handleGenerateDocument}
      theme="light"
    />
  );
}

// ============================================
// EXAMPLE 6: Using useTranslation Hook
// ============================================

import useTranslation from '@/hooks/useTranslation';

export function TranslationExample() {
  const { t, language, changeLanguage, getAvailableLanguages } = useTranslation();

  return (
    <div>
      <h1>{t('forms.repairOrder.title', 'Repair Order')}</h1>
      <p>{t('forms.repairOrder.subtitle', 'Submit your device for repair')}</p>

      <div className="flex gap-2">
        {getAvailableLanguages().map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-4 py-2 rounded ${
              language === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Full Page Component
// ============================================

export function FullRepairPageExample() {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<RemonlineDocument | null>(null);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NEXX Service Center</h1>
          <p className="text-gray-600">{t('hero.description', 'Professional device repair services')}</p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Repair Order Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-lg font-semibold mb-2">{t('forms.repairOrder.title', 'Book Repair')}</h3>
            <p className="text-gray-600 text-sm mb-4">{t('forms.repairOrder.subtitle', 'Submit device for repair')}</p>
            <button
              onClick={() => setActiveForm('repair_order')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              {t('buttons.book', 'Book')}
            </button>
          </div>

          {/* Callback Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-lg font-semibold mb-2">{t('forms.callback.title', 'Callback')}</h3>
            <p className="text-gray-600 text-sm mb-4">{t('forms.callback.subtitle', 'Get a call back')}</p>
            <button
              onClick={() => setActiveForm('callback')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
            >
              {t('buttons.callBack', 'Call Me')}
            </button>
          </div>

          {/* Diagnostic Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">{t('forms.diagnostic.title', 'Diagnostic')}</h3>
            <p className="text-gray-600 text-sm mb-4">{t('forms.diagnostic.subtitle', 'Device diagnostics')}</p>
            <button
              onClick={() => setActiveForm('diagnostic')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition"
            >
              {t('buttons.submit', 'Submit')}
            </button>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">{t('forms.document.title', 'Documents')}</h3>
            <p className="text-gray-600 text-sm mb-4">{t('forms.document.subtitle', 'Request documents')}</p>
            <button
              onClick={() => setActiveForm('document')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded transition"
            >
              {t('buttons.submit', 'Request')}
            </button>
          </div>
        </div>

        {/* Document Templates Section */}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('documents.sections.orderDetails', 'Order Documents')}</h2>
            <DocumentTemplates
              document={selectedOrder}
              onGenerate={async (docType, format) => {
                // Implement document generation
                return {
                  success: true,
                  documentId: selectedOrder.id,
                  downloadUrl: '#',
                  format: format,
                  message: 'Document ready',
                };
              }}
            />
          </div>
        )}

        {/* Active Form Modal */}
        {activeForm && (
          <UnifiedRemonlineForm
            formType={activeForm as any}
            isOpen={true}
            onClose={() => setActiveForm(null)}
            onSubmit={async (data) => {
              try {
                const response = await fetch('/api/remonline', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    formType: activeForm,
                    ...data,
                  }),
                });
                return await response.json();
              } catch (error: any) {
                return { success: false, error: error.message };
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 8: API Response Handling
// ============================================

async function handleFormSubmission(formData: any) {
  try {
    const response = await fetch('/api/remonline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result: RemonlineFormResponse = await response.json();

    if (result.success) {
      console.log('✅ Form submitted successfully:', result.id);

      // Handle success
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }

      // Show success message
      alert(result.message || 'Form submitted successfully!');

      return result;
    } else {
      console.error('❌ Form submission failed:', result.error);

      // Show error message
      alert(result.message || 'An error occurred during submission');

      return result;
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error. Please try again.');
    return null;
  }
}

// ============================================
// Export all examples
// ============================================

export default {
  RepairOrderExample,
  CallbackFormExample,
  DiagnosticFormExample,
  DocumentRequestExample,
  DocumentTemplatesExample,
  TranslationExample,
  FullRepairPageExample,
  handleFormSubmission,
};
