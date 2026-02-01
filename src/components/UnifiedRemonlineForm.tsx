import React, { useState } from 'react';
import { cn } from '@/utils';
import useTranslation from '@/hooks/useTranslation';
import {
  RepairOrderForm,
  CallbackForm,
  DiagnosticForm,
  DocumentRequestForm,
  RemonlineFormResponse,
  FormValidationResult,
} from '@/types';

type FormType = 'repair_order' | 'callback' | 'diagnostic' | 'document';

interface UnifiedRemonlineFormProps {
  formType: FormType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => Promise<RemonlineFormResponse>;
  orderId?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * Unified Remonline Form Component
 * Supports multiple form types with multilingual support (UK/RU/EN/RO)
 */
export const UnifiedRemonlineForm: React.FC<UnifiedRemonlineFormProps> = ({
  formType,
  isOpen,
  onClose,
  onSubmit,
  orderId,
  className,
  theme = 'light',
}) => {
  const { t, language } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [repairOrder, setRepairOrder] = useState<RepairOrderForm>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    device: {
      name: '',
      type: '',
      brand: '',
      model: '',
    },
    problem: '',
    source: 'website_form',
    language: (language as any) || 'uk',
  });

  const [callback, setCallback] = useState<CallbackForm>({
    customerName: '',
    customerPhone: '',
    device: '',
    problem: '',
    language: (language as any) || 'uk',
    aiCallEnabled: true,
  });

  const [diagnostic, setDiagnostic] = useState<DiagnosticForm>({
    device: {
      name: '',
      type: '',
      brand: '',
      model: '',
    },
    diagnosticResults: {
      status: '',
      findings: '',
    },
    language: (language as any) || 'uk',
  });

  const [documentRequest, setDocumentRequest] = useState<DocumentRequestForm>({
    orderId: orderId || '',
    documentType: 'invoice',
    customerName: '',
    customerEmail: '',
    language: (language as any) || 'uk',
  });

  // Validation functions
  const validateRepairOrder = (): FormValidationResult => {
    const errors: Record<string, string[]> = {};

    if (!repairOrder.customerName || repairOrder.customerName.length < 2) {
      errors.customerName = [t('validation.nameRequired', 'Name is required (min 2 characters)')];
    }
    if (!repairOrder.customerPhone) {
      errors.customerPhone = [t('validation.phoneInvalid', 'Phone is required')];
    }
    if (!repairOrder.device.type) {
      errors.deviceType = [t('validation.deviceRequired', 'Device type is required')];
    }
    if (!repairOrder.problem) {
      errors.problem = [t('validation.required', 'This field is required')];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validateCallback = (): FormValidationResult => {
    const errors: Record<string, string[]> = {};

    if (!callback.customerName || callback.customerName.length < 2) {
      errors.customerName = [t('validation.nameRequired', 'Name is required (min 2 characters)')];
    }
    if (!callback.customerPhone) {
      errors.customerPhone = [t('validation.phoneInvalid', 'Phone is required')];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validateDiagnostic = (): FormValidationResult => {
    const errors: Record<string, string[]> = {};

    if (!diagnostic.device.type) {
      errors.deviceType = [t('validation.deviceRequired', 'Device type is required')];
    }
    if (!diagnostic.diagnosticResults.findings) {
      errors.findings = [t('validation.required', 'This field is required')];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validateDocumentRequest = (): FormValidationResult => {
    const errors: Record<string, string[]> = {};

    if (!documentRequest.orderId) {
      errors.orderId = [t('validation.orderNotFound', 'Order ID is required')];
    }
    if (!documentRequest.customerName || documentRequest.customerName.length < 2) {
      errors.customerName = [t('validation.nameRequired', 'Name is required (min 2 characters)')];
    }
    if (!documentRequest.customerEmail || !documentRequest.customerEmail.includes('@')) {
      errors.customerEmail = [t('validation.invalidEmail', 'Valid email is required')];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  // Submit handlers
  const handleRepairOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateRepairOrder();

    if (!validation.isValid) {
      setError(t('validation.required', 'Please fill all required fields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onSubmit?.(repairOrder);
      if (response?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError(response?.error || t('validation.submitError', 'Error submitting form'));
      }
    } catch (err: any) {
      setError(err.message || t('validation.submitError', 'Error submitting form'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCallback();

    if (!validation.isValid) {
      setError(t('validation.required', 'Please fill all required fields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onSubmit?.(callback);
      if (response?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError(response?.error || t('validation.submitError', 'Error submitting form'));
      }
    } catch (err: any) {
      setError(err.message || t('validation.submitError', 'Error submitting form'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosticSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDiagnostic();

    if (!validation.isValid) {
      setError(t('validation.required', 'Please fill all required fields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onSubmit?.(diagnostic);
      if (response?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError(response?.error || t('validation.submitError', 'Error submitting form'));
      }
    } catch (err: any) {
      setError(err.message || t('validation.submitError', 'Error submitting form'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDocumentRequest();

    if (!validation.isValid) {
      setError(t('validation.required', 'Please fill all required fields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onSubmit?.(documentRequest);
      if (response?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError(response?.error || t('validation.submitError', 'Error submitting form'));
      }
    } catch (err: any) {
      setError(err.message || t('validation.submitError', 'Error submitting form'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const bgTheme = theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
  const borderTheme = theme === 'dark' ? 'border-slate-700' : 'border-slate-300';
  const headerTheme = theme === 'dark' ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-blue-600 to-blue-700';
  const inputTheme =
    theme === 'dark'
      ? 'bg-slate-800 border-slate-600 text-white focus:border-blue-400'
      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div
        className={cn(
          `${bgTheme} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200`,
          className
        )}
      >
        {/* Header */}
        <div className={`${headerTheme} p-6 text-white`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                {formType === 'repair_order' && t('forms.repairOrder.title', 'Repair Order')}
                {formType === 'callback' && t('forms.callback.title', 'Callback')}
                {formType === 'diagnostic' && t('forms.diagnostic.title', 'Diagnostic')}
                {formType === 'document' && t('forms.document.title', 'Document')}
              </h2>
              <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-blue-100'} text-sm mt-1`}>
                {formType === 'repair_order' && t('forms.repairOrder.subtitle', 'Submit device for repair')}
                {formType === 'callback' && t('forms.callback.subtitle', 'We will call you back')}
                {formType === 'diagnostic' && t('forms.diagnostic.subtitle', 'Get professional diagnostics')}
                {formType === 'document' && t('forms.document.subtitle', 'Request documents')}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white/20 hover:bg-white/30'} flex items-center justify-center transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className={`mb-4 p-3 ${theme === 'dark' ? 'bg-red-900/30 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-600'} border rounded-lg text-sm`}>
              {error}
            </div>
          )}

          {success && (
            <div className={`mb-4 p-3 ${theme === 'dark' ? 'bg-green-900/30 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-600'} border rounded-lg text-sm`}>
              {formType === 'repair_order' && t('forms.repairOrder.success', 'Form submitted successfully!')}
              {formType === 'callback' && t('forms.callback.success', 'Callback requested!')}
              {formType === 'diagnostic' && t('forms.diagnostic.success', 'Diagnostic submitted!')}
              {formType === 'document' && t('forms.document.success', 'Document requested!')}
            </div>
          )}

          {/* Repair Order Form */}
          {formType === 'repair_order' && (
            <form onSubmit={handleRepairOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.repairOrder.device', 'Device')} *
                  </label>
                  <select
                    value={repairOrder.device.type}
                    onChange={(e) => setRepairOrder({ ...repairOrder, device: { ...repairOrder.device, type: e.target.value } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                    required
                  >
                    <option value="">Select device...</option>
                    <option value="iphone">iPhone</option>
                    <option value="android">Android</option>
                    <option value="macbook">MacBook</option>
                    <option value="laptop">Laptop</option>
                    <option value="ipad">iPad</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.repairOrder.brand', 'Brand')}
                  </label>
                  <input
                    type="text"
                    value={repairOrder.device.brand}
                    onChange={(e) => setRepairOrder({ ...repairOrder, device: { ...repairOrder.device, brand: e.target.value } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                    placeholder="Apple, Samsung..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.repairOrder.model', 'Model')}
                  </label>
                  <input
                    type="text"
                    value={repairOrder.device.model}
                    onChange={(e) => setRepairOrder({ ...repairOrder, device: { ...repairOrder.device, model: e.target.value } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                    placeholder="iPhone 15, MacBook Pro..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.repairOrder.serialNumber', 'Serial Number')}
                  </label>
                  <input
                    type="text"
                    value={repairOrder.device.serialNumber || ''}
                    onChange={(e) => setRepairOrder({ ...repairOrder, device: { ...repairOrder.device, serialNumber: e.target.value } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.repairOrder.customerName', 'Name')} *
                </label>
                <input
                  type="text"
                  value={repairOrder.customerName}
                  onChange={(e) => setRepairOrder({ ...repairOrder, customerName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.repairOrder.customerPhone', 'Phone')} *
                  </label>
                  <input
                    type="tel"
                    value={repairOrder.customerPhone}
                    onChange={(e) => setRepairOrder({ ...repairOrder, customerPhone: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                    placeholder="+40 XXX XXX XXX"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.repairOrder.customerEmail', 'Email')}
                  </label>
                  <input
                    type="email"
                    value={repairOrder.customerEmail || ''}
                    onChange={(e) => setRepairOrder({ ...repairOrder, customerEmail: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.repairOrder.problem', 'Problem')} *
                </label>
                <textarea
                  value={repairOrder.problem}
                  onChange={(e) => setRepairOrder({ ...repairOrder, problem: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all resize-none ${inputTheme}`}
                  rows={3}
                  placeholder="Describe your device problem..."
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.repairOrder.problemDetails', 'Additional Details')}
                </label>
                <textarea
                  value={repairOrder.problemDetails || ''}
                  onChange={(e) => setRepairOrder({ ...repairOrder, problemDetails: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all resize-none ${inputTheme}`}
                  rows={2}
                  placeholder="Any additional information..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? t('forms.repairOrder.submitting', 'Submitting...') : t('forms.repairOrder.submit', 'Submit Order')}
              </button>
            </form>
          )}

          {/* Callback Form */}
          {formType === 'callback' && (
            <form onSubmit={handleCallbackSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.callback.customerName', 'Name')} *
                </label>
                <input
                  type="text"
                  value={callback.customerName}
                  onChange={(e) => setCallback({ ...callback, customerName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.callback.customerPhone', 'Phone')} *
                </label>
                <input
                  type="tel"
                  value={callback.customerPhone}
                  onChange={(e) => setCallback({ ...callback, customerPhone: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  placeholder="+40 XXX XXX XXX"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.callback.device', 'Device Type')}
                </label>
                <input
                  type="text"
                  value={callback.device || ''}
                  onChange={(e) => setCallback({ ...callback, device: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  placeholder="iPhone, MacBook..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.callback.problem', 'Describe your problem')}
                </label>
                <textarea
                  value={callback.problem || ''}
                  onChange={(e) => setCallback({ ...callback, problem: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all resize-none ${inputTheme}`}
                  rows={3}
                  placeholder="What's the issue?"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="aiCall"
                  checked={callback.aiCallEnabled || false}
                  onChange={(e) => setCallback({ ...callback, aiCallEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label htmlFor="aiCall" className={`ml-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.callback.aiCallEnabled', 'Allow AI to call')}
                </label>
              </div>

              {callback.aiCallEnabled && (
                <div className={`p-3 ${theme === 'dark' ? 'bg-blue-900/30 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-600'} border rounded-lg text-sm`}>
                  {t('forms.callback.aiWillCall', 'AI will call within 10 seconds')}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? t('forms.callback.submitting', 'Submitting...') : t('forms.callback.submit', 'Request Callback')}
              </button>
            </form>
          )}

          {/* Diagnostic Form */}
          {formType === 'diagnostic' && (
            <form onSubmit={handleDiagnosticSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.diagnostic.device', 'Device')} *
                  </label>
                  <select
                    value={diagnostic.device.type}
                    onChange={(e) => setDiagnostic({ ...diagnostic, device: { ...diagnostic.device, type: e.target.value } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="iphone">iPhone</option>
                    <option value="android">Android</option>
                    <option value="macbook">MacBook</option>
                    <option value="laptop">Laptop</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.diagnostic.brand', 'Brand')}
                  </label>
                  <input
                    type="text"
                    value={diagnostic.device.brand}
                    onChange={(e) => setDiagnostic({ ...diagnostic, device: { ...diagnostic.device, brand: e.target.value } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.diagnostic.model', 'Model')}
                  </label>
                  <input
                    type="text"
                    value={diagnostic.device.model}
                    onChange={(e) => setDiagnostic({ ...diagnostic, device: { ...diagnostic.device, model: e.target.value } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.diagnostic.findings', 'Diagnostic Findings')} *
                </label>
                <textarea
                  value={diagnostic.diagnosticResults.findings}
                  onChange={(e) =>
                    setDiagnostic({
                      ...diagnostic,
                      diagnosticResults: { ...diagnostic.diagnosticResults, findings: e.target.value },
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all resize-none ${inputTheme}`}
                  rows={4}
                  placeholder="What did you find during diagnostics?"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.diagnostic.status', 'Status')}
                  </label>
                  <select
                    value={diagnostic.diagnosticResults.status}
                    onChange={(e) =>
                      setDiagnostic({
                        ...diagnostic,
                        diagnosticResults: { ...diagnostic.diagnosticResults, status: e.target.value },
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  >
                    <option value="">Select status...</option>
                    <option value="working">Working</option>
                    <option value="defective">Defective</option>
                    <option value="needs_repair">Needs Repair</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('forms.diagnostic.estimatedRepairCost', 'Estimated Repair Cost')}
                  </label>
                  <input
                    type="number"
                    value={diagnostic.diagnosticResults.estimatedRepairCost || 0}
                    onChange={(e) =>
                      setDiagnostic({
                        ...diagnostic,
                        diagnosticResults: { ...diagnostic.diagnosticResults, estimatedRepairCost: parseFloat(e.target.value) },
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? t('forms.diagnostic.submitting', 'Submitting...') : t('forms.diagnostic.submit', 'Submit Diagnostic')}
              </button>
            </form>
          )}

          {/* Document Request Form */}
          {formType === 'document' && (
            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.document.orderId', 'Order ID')} *
                </label>
                <input
                  type="text"
                  value={documentRequest.orderId}
                  onChange={(e) => setDocumentRequest({ ...documentRequest, orderId: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  placeholder="Enter order ID"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.document.type', 'Document Type')} *
                </label>
                <select
                  value={documentRequest.documentType}
                  onChange={(e) => setDocumentRequest({ ...documentRequest, documentType: e.target.value as any })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  required
                >
                  <option value="invoice">{t('documents.types.invoice', 'Invoice')}</option>
                  <option value="act">{t('documents.types.act', 'Repair Act')}</option>
                  <option value="contract">{t('documents.types.contract', 'Contract')}</option>
                  <option value="estimate">{t('documents.types.estimate', 'Estimate')}</option>
                  <option value="receipt">{t('documents.types.receipt', 'Receipt')}</option>
                  <option value="warranty">{t('documents.types.warranty', 'Warranty')}</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.document.customerName', 'Name')} *
                </label>
                <input
                  type="text"
                  value={documentRequest.customerName}
                  onChange={(e) => setDocumentRequest({ ...documentRequest, customerName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.document.customerEmail', 'Email')} *
                </label>
                <input
                  type="email"
                  value={documentRequest.customerEmail}
                  onChange={(e) => setDocumentRequest({ ...documentRequest, customerEmail: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${inputTheme}`}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.document.address', 'Shipping Address')}
                </label>
                <textarea
                  value={documentRequest.customerAddress || ''}
                  onChange={(e) => setDocumentRequest({ ...documentRequest, customerAddress: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all resize-none ${inputTheme}`}
                  rows={2}
                  placeholder="Your full address..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeDetails"
                  checked={documentRequest.includeDetails || false}
                  onChange={(e) => setDocumentRequest({ ...documentRequest, includeDetails: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label htmlFor="includeDetails" className={`ml-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t('forms.document.includeDetails', 'Include full details')}
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? t('forms.document.submitting', 'Submitting...') : t('forms.document.submit', 'Request Document')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedRemonlineForm;
