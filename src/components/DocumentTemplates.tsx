import React, { useState } from 'react';
import { cn } from '@/utils';
import useTranslation from '@/hooks/useTranslation';
import { RemonlineDocument, DocumentType, DocumentGenerationResponse } from '@/types';

interface DocumentTemplatesProps {
  document?: RemonlineDocument;
  onGenerate?: (docType: DocumentType, format: 'pdf' | 'html' | 'docx') => Promise<DocumentGenerationResponse>;
  theme?: 'light' | 'dark';
  className?: string;
}

/**
 * Document Templates Component for Remonline
 * Supports: Invoice, Act, Contract, Estimate, Receipt, Warranty Card
 * Supports multiple formats: PDF, HTML, DOCX
 * Multilingual: UK/RU/EN/RO
 */
export const DocumentTemplates: React.FC<DocumentTemplatesProps> = ({
  document,
  onGenerate,
  theme = 'light',
  className,
}) => {
  const { t, language } = useTranslation();
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('invoice');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'html' | 'docx'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bgTheme = theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
  const borderTheme = theme === 'dark' ? 'border-slate-700' : 'border-slate-300';
  const cardBgTheme = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50';
  const textMutedTheme = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  // Document type info
  const documentTypes: Array<{ id: DocumentType; label: string; description: string }> = [
    {
      id: 'invoice',
      label: t('documents.types.invoice', 'Invoice'),
      description: 'Financial document for payment',
    },
    {
      id: 'act',
      label: t('documents.types.act', 'Repair Act'),
      description: 'Detailed repair work record',
    },
    {
      id: 'contract',
      label: t('documents.types.contract', 'Contract'),
      description: 'Service agreement and terms',
    },
    {
      id: 'estimate',
      label: t('documents.types.estimate', 'Estimate'),
      description: 'Price quote and labor estimate',
    },
    {
      id: 'receipt',
      label: t('documents.types.receipt', 'Receipt'),
      description: 'Payment confirmation',
    },
    {
      id: 'warranty',
      label: t('documents.types.warranty', 'Warranty Card'),
      description: 'Warranty terms and conditions',
    },
  ];

  const handleGenerateDocument = async () => {
    if (!document) {
      setError(t('validation.documentNotFound', 'No document to generate'));
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await onGenerate?.(selectedDocType, selectedFormat);
      if (response?.success) {
        // Handle download or preview
        if (response.downloadUrl) {
          window.open(response.downloadUrl, '_blank');
        }
      } else {
        setError(response?.message || t('validation.submitError', 'Error generating document'));
      }
    } catch (err: any) {
      setError(err.message || t('validation.submitError', 'Error generating document'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Invoice Template Preview
  const renderInvoicePreview = () => (
    <div className={`${cardBgTheme} p-6 rounded-lg border ${borderTheme}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b border-slate-300 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-blue-600">NEXX Service Center</h3>
              <p className={`text-sm ${textMutedTheme}`}>Professional Device Repair</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{t('documents.types.invoice', 'Invoice')}</p>
              <p className={`text-sm ${textMutedTheme}`}>#{document?.documentNumber || 'INV-001'}</p>
            </div>
          </div>
        </div>

        {/* Customer & Order Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">{t('documents.sections.customerInfo', 'Customer')}</p>
            <p>{document?.customer.name || 'Customer Name'}</p>
            <p className={textMutedTheme}>{document?.customer.phone || 'Phone'}</p>
            <p className={textMutedTheme}>{document?.customer.email || 'Email'}</p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${textMutedTheme}`}>
              {t('documents.fields.issueDate', 'Issue Date')}: {document?.issueDate || '2026-01-23'}
            </p>
            {document?.dueDate && (
              <p className={`text-sm ${textMutedTheme}`}>
                {t('documents.fields.dueDate', 'Due Date')}: {document.dueDate}
              </p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-slate-300 pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${borderTheme}`}>
                <th className="text-left font-semibold pb-2">Description</th>
                <th className="text-center font-semibold pb-2">Qty</th>
                <th className="text-right font-semibold pb-2">Price</th>
                <th className="text-right font-semibold pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {document?.items.map((item, idx) => (
                <tr key={idx} className={`border-b ${borderTheme}`}>
                  <td className="py-2">{item.description}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">{item.unitPrice}</td>
                  <td className="text-right py-2 font-semibold">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('documents.fields.subtotal', 'Subtotal')}</span>
              <span>{document?.subtotal || 0}</span>
            </div>
            {document?.tax && (
              <div className="flex justify-between text-sm">
                <span>{t('documents.fields.tax', 'Tax')}</span>
                <span>{document.tax}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t border-slate-300 pt-2">
              <span>{t('documents.fields.total', 'Total')}</span>
              <span>
                {document?.total || 0} {document?.currency || 'RON'}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {document?.notes && (
          <div className={`text-sm ${textMutedTheme} border-t ${borderTheme} pt-4`}>
            <p className="font-semibold mb-1">Notes:</p>
            <p>{document.notes}</p>
          </div>
        )}

        {/* Terms */}
        {document?.terms && (
          <div className={`text-xs ${textMutedTheme} border-t ${borderTheme} pt-4`}>
            <p className="font-semibold mb-1">Terms & Conditions:</p>
            <p>{document.terms}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Repair Act Template Preview
  const renderActPreview = () => (
    <div className={`${cardBgTheme} p-6 rounded-lg border ${borderTheme}`}>
      <div className="space-y-4">
        <div className="border-b border-slate-300 pb-4">
          <h3 className="text-2xl font-bold text-blue-600">{t('documents.types.act', 'Repair Act')}</h3>
          <p className={`text-sm ${textMutedTheme}`}>Order #{document?.order.id || 'ORD-001'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">{t('documents.sections.customerInfo', 'Customer')}</p>
            <p>{document?.customer.name || 'Customer'}</p>
            <p className={textMutedTheme}>{document?.customer.phone || 'Phone'}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Device</p>
            <p>
              {document?.items[0]?.description || 'Device'}
            </p>
            <p className={textMutedTheme}>Date: {document?.issueDate || '2026-01-23'}</p>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-4">
          <p className="font-semibold mb-2">Work Performed:</p>
          <div className="space-y-2">
            {document?.items.map((item, idx) => (
              <div key={idx} className={`p-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'} rounded`}>
                <p className="font-medium">{item.description}</p>
                <p className={`text-sm ${textMutedTheme}`}>
                  Cost: {item.total} {document.currency}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-300 pt-4">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between font-bold text-lg">
                <span>{t('documents.fields.total', 'Total')}</span>
                <span>
                  {document?.total || 0} {document?.currency || 'RON'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-4 mt-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-semibold mb-8">Technician Signature</p>
              <div className="border-b-2 border-slate-400 w-40"></div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold mb-8">Customer Signature</p>
              <div className="border-b-2 border-slate-400 w-40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Warranty Card Template Preview
  const renderWarrantyPreview = () => (
    <div className={`${cardBgTheme} p-6 rounded-lg border ${borderTheme}`}>
      <div className="space-y-4">
        <div className="text-center border-b border-slate-300 pb-4">
          <h3 className="text-2xl font-bold text-blue-600">{t('documents.types.warranty', 'Warranty Card')}</h3>
          <p className={`text-sm ${textMutedTheme}`}>Valid for 30 days from repair completion</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Order Number</p>
            <p className="text-lg font-mono">{document?.documentNumber || 'WRT-001'}</p>
          </div>
          <div>
            <p className="font-semibold">Repair Date</p>
            <p className="text-lg font-mono">{document?.issueDate || '2026-01-23'}</p>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-yellow-50'} p-4 rounded border ${theme === 'dark' ? 'border-slate-600' : 'border-yellow-200'}`}>
          <p className="font-semibold mb-2">What's Covered:</p>
          <ul className="text-sm space-y-1">
            <li>✓ All repaired components</li>
            <li>✓ Manufacturing defects</li>
            <li>✓ Parts replacement if failed</li>
            <li>✓ Free diagnostic support</li>
          </ul>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-red-50'} p-4 rounded border ${theme === 'dark' ? 'border-slate-600' : 'border-red-200'}`}>
          <p className="font-semibold mb-2">Not Covered:</p>
          <ul className="text-sm space-y-1">
            <li>✗ Physical damage or drops</li>
            <li>✗ Water damage after repair</li>
            <li>✗ Unauthorized modifications</li>
            <li>✗ Normal wear and tear</li>
          </ul>
        </div>

        <div className="border-t border-slate-300 pt-4">
          <p className="font-semibold mb-2">Contact for Support</p>
          <p className={`text-sm ${textMutedTheme}`}>
            Email: info@nexx.ro
            <br />
            Phone: +40 721 234 567
            <br />
            Hours: Mon-Fri 10:00-19:00
          </p>
        </div>

        <div className="border-t border-slate-300 pt-4 text-xs text-center mt-8 mb-4">
          <p>{t('documents.sections.signature', 'NEXX Service Center')}</p>
          <p className={textMutedTheme}>Official stamp</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(`${bgTheme} rounded-lg p-6`, className)}>
      <h2 className="text-2xl font-bold mb-6">{t('documents.sections.orderDetails', 'Document Templates')}</h2>

      {error && (
        <div className={`mb-4 p-3 ${theme === 'dark' ? 'bg-red-900/30 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-600'} border rounded-lg text-sm`}>
          {error}
        </div>
      )}

      {/* Document Type Selection */}
      <div className="mb-6">
        <label className={`block font-semibold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          {t('forms.document.type', 'Select Document Type')}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {documentTypes.map((docType) => (
            <button
              key={docType.id}
              onClick={() => setSelectedDocType(docType.id)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all text-left',
                selectedDocType === docType.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : `border-${borderTheme} hover:border-blue-300`
              )}
            >
              <p className="font-semibold text-sm">{docType.label}</p>
              <p className={`text-xs ${textMutedTheme}`}>{docType.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className={`block font-semibold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          {t('documents.actions.generate', 'Export Format')}
        </label>
        <div className="flex gap-3">
          {(['pdf', 'html', 'docx'] as const).map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={cn(
                'px-4 py-2 rounded-lg border-2 font-medium transition-all uppercase text-sm',
                selectedFormat === format ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : `border-${borderTheme} hover:border-blue-300`
              )}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleGenerateDocument}
          disabled={isGenerating || !document}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : `${t('documents.actions.generate', 'Generate')} ${selectedFormat.toUpperCase()}`}
        </button>
        <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
          {t('documents.actions.preview', 'Preview')}
        </button>
        <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
          {t('documents.actions.email', 'Email')}
        </button>
      </div>

      {/* Preview */}
      <div className="mt-8 border-t border-slate-300 pt-8">
        <h3 className="text-lg font-semibold mb-4">{t('documents.actions.preview', 'Preview')}</h3>
        {selectedDocType === 'invoice' && renderInvoicePreview()}
        {selectedDocType === 'act' && renderActPreview()}
        {selectedDocType === 'warranty' && renderWarrantyPreview()}
        {!['invoice', 'act', 'warranty'].includes(selectedDocType) && (
          <div className={`${cardBgTheme} p-6 rounded-lg border ${borderTheme} text-center ${textMutedTheme}`}>
            <p>Preview for {selectedDocType} document type coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentTemplates;
