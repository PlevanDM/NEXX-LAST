import React, { useState } from 'react';
import { cn } from '@/utils';
import useTranslation from '@/hooks/useTranslation';
import { NEXX_TEMPLATES } from '@/templates/nexx-document-templates';

type TemplateType = 'intake' | 'release' | 'buyback' | 'recycling';

interface NexxDocumentTemplatesProps {
  templateType?: TemplateType;
  onGenerate?: (templateType: TemplateType, format: 'pdf' | 'html' | 'docx') => Promise<any>;
  theme?: 'light' | 'dark';
  className?: string;
}

/**
 * NEXX GSM Document Templates Component
 * Supports: Intake, Release, Buyback, Recycling
 * Languages: UK, RU, EN, RO
 * Formats: PDF, HTML, DOCX
 */
export const NexxDocumentTemplates: React.FC<NexxDocumentTemplatesProps> = ({
  templateType = 'intake',
  onGenerate,
  theme = 'light',
  className,
}) => {
  const { t, language } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(templateType);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'html' | 'docx'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const bgTheme = theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
  const borderTheme = theme === 'dark' ? 'border-slate-700' : 'border-slate-300';
  const cardBgTheme = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50';
  const textMutedTheme = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const templates: Array<{ id: TemplateType; label: string; icon: string; description: string }> = [
    {
      id: 'intake',
      label: 'Intake / Приемка',
      icon: '📥',
      description: 'Device intake form / Форма прийому пристрою',
    },
    {
      id: 'release',
      label: 'Release / Выдача',
      icon: '📤',
      description: 'Device release / completion / Видача відремонтованого',
    },
    {
      id: 'buyback',
      label: 'Buyback / Выкуп',
      icon: '💰',
      description: 'Device buyback / trade-in / Виконання послуги',
    },
    {
      id: 'recycling',
      label: 'Recycling / Утилизация',
      icon: '♻️',
      description: 'Device recycling / disposal / Утилізація',
    },
  ];

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    try {
      await onGenerate?.(selectedTemplate, selectedFormat);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTemplateContent = () => {
    const template = NEXX_TEMPLATES[selectedTemplate];
    const langKey = (language as keyof typeof template) || 'en';
    return template[langKey] || template.en;
  };

  const renderPreview = () => {
    const content = getTemplateContent();

    return (
      <div className={`${cardBgTheme} p-8 rounded-lg border ${borderTheme} space-y-6`}>
        {/* Header */}
        <div className="border-b border-slate-300 pb-4">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">{content.title}</h1>
          {(content as { subtitle?: string }).subtitle && (
            <p className={`text-sm ${textMutedTheme}`}>{(content as { subtitle?: string }).subtitle}</p>
          )}
          <p className={`text-xs ${textMutedTheme} mt-2`}>
            NEXX GSM Service Center • {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Form Fields Preview */}
        <div className="space-y-4">
          {Object.entries(content.form).slice(0, 8).map(([key, label]) => (
            <div key={key} className="grid grid-cols-3 gap-4">
              <div className={`p-2 rounded border ${borderTheme}`}>
                <p className="text-xs font-semibold mb-1">{label}</p>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
          <p className={`text-sm ${textMutedTheme} italic`}>... {Object.keys(content.form).length} fields total</p>
        </div>

        {/* Sections */}
        <div className="border-t border-slate-300 pt-4">
          <h3 className="font-semibold mb-3">Document Sections:</h3>
          <ul className="space-y-2">
            {Object.values(content.sections).map((section, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span className="text-sm">{section}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-300 pt-4 flex justify-between">
          <div className="text-xs text-gray-400">NEXX GSM © 2026</div>
          <div className="text-xs text-gray-400">Document ID: {selectedTemplate.toUpperCase()}-{Date.now()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(`${bgTheme} rounded-lg p-6`, className)}>
      <h2 className="text-2xl font-bold mb-6">NEXX GSM Document Templates</h2>

      {/* Template Selection */}
      <div className="mb-8">
        <label className={`block font-semibold mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          Select Template Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={cn(
                'p-4 rounded-lg border-2 transition-all text-left',
                selectedTemplate === tmpl.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : `border-${borderTheme} hover:border-blue-300`
              )}
            >
              <div className="text-2xl mb-2">{tmpl.icon}</div>
              <p className="font-semibold text-sm">{tmpl.label}</p>
              <p className={`text-xs ${textMutedTheme}`}>{tmpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-8">
        <label className={`block font-semibold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          Export Format
        </label>
        <div className="flex gap-3">
          {(['pdf', 'html', 'docx'] as const).map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={cn(
                'px-4 py-2 rounded-lg border-2 font-medium transition-all uppercase text-sm',
                selectedFormat === format
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : `border-${borderTheme} hover:border-blue-300`
              )}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleGenerateDocument}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : `Generate ${selectedFormat.toUpperCase()}`}
        </button>
        <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
          Print Preview
        </button>
        <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
          Email
        </button>
      </div>

      {/* Preview */}
      <div className="mt-8 border-t border-slate-300 pt-8">
        <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
        {renderPreview()}
      </div>

      {/* Info */}
      <div className={`mt-8 p-4 ${cardBgTheme} rounded-lg border ${borderTheme}`}>
        <p className={`text-sm ${textMutedTheme}`}>
          <strong>Template Info:</strong> This preview shows the structure and fields available in the selected template.
          The actual document will be generated with the data you provide.
        </p>
      </div>
    </div>
  );
};

export default NexxDocumentTemplates;
