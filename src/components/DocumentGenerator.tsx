import React, { useState } from 'react';
import { cn } from '@/utils';
import useTranslation from '@/hooks/useTranslation';
import { NEXX_TEMPLATES } from '@/templates/nexx-document-templates';

type TemplateType = 'intake' | 'release' | 'buyback' | 'recycling';

export interface DocumentGeneratorProps {
  templateType: TemplateType;
  formData?: Record<string, any>;
  onGenerate?: (template: TemplateType, format: 'pdf' | 'html') => void;
  theme?: 'light' | 'dark';
}

/**
 * NEXX GSM Document HTML Generator
 * Generates print-ready HTML for all document types
 */
export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  templateType,
  formData = {},
  onGenerate,
  theme = 'light',
}) => {
  const { language } = useTranslation();
  const [format, setFormat] = useState<'pdf' | 'html'>('pdf');

  const getTemplate = () => {
    const template = NEXX_TEMPLATES[templateType];
    const langKey = (language as keyof typeof template) || 'en';
    return template[langKey] || template.en;
  };

  const renderIntakeDocument = () => {
    const template = getTemplate();
    const data = {
      date: formData.date || new Date().toLocaleDateString(),
      orderNumber: formData.orderNumber || 'ORD-2026-001',
      customerName: formData.customerName || '_________________',
      customerPhone: formData.customerPhone || '_________________',
      deviceType: formData.deviceType || '_________________',
      deviceBrand: formData.deviceBrand || '_________________',
      deviceModel: formData.deviceModel || '_________________',
      deviceSerial: formData.deviceSerial || '_________________',
      deviceIMEI: formData.deviceIMEI || '_________________',
      condition: formData.condition || '_________________',
      damage: formData.damage || '_________________',
      accessories: formData.accessories || '_________________',
      estimatedPrice: formData.estimatedPrice || '_________________',
      ...formData,
    };

    return (
      <div className="print:p-8 print:bg-white max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b-2 border-black pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">NEXX GSM</h1>
              <p className="text-sm">Service Center</p>
              <p className="text-xs text-gray-600">Str. Victoriei 15, Bucharest, Romania</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">{template.title}</h2>
              <p className="text-xs">Bucharest, {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Order Number and Date */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-semibold">Order Number:</label>
            <p className="border-b border-gray-400 min-h-6">{data.orderNumber}</p>
          </div>
          <div>
            <label className="font-semibold">Date:</label>
            <p className="border-b border-gray-400 min-h-6">{data.date}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="font-bold text-sm mb-2 underline">{Object.values(template.sections)[0]}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-semibold text-xs">Name:</label>
              <p className="border-b border-gray-400 min-h-5">{data.customerName}</p>
            </div>
            <div>
              <label className="font-semibold text-xs">Phone:</label>
              <p className="border-b border-gray-400 min-h-5">{data.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div>
          <h3 className="font-bold text-sm mb-2 underline">{Object.values(template.sections)[1]}</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <label className="font-semibold text-xs">Device Type:</label>
              <p className="border-b border-gray-400 min-h-5">{data.deviceType}</p>
            </div>
            <div>
              <label className="font-semibold text-xs">Brand:</label>
              <p className="border-b border-gray-400 min-h-5">{data.deviceBrand}</p>
            </div>
            <div>
              <label className="font-semibold text-xs">Model:</label>
              <p className="border-b border-gray-400 min-h-5">{data.deviceModel}</p>
            </div>
            <div>
              <label className="font-semibold text-xs">Serial Number:</label>
              <p className="border-b border-gray-400 min-h-5">{data.deviceSerial}</p>
            </div>
            <div>
              <label className="font-semibold text-xs">IMEI:</label>
              <p className="border-b border-gray-400 min-h-5">{data.deviceIMEI}</p>
            </div>
            <div>
              <label className="font-semibold text-xs">Condition:</label>
              <p className="border-b border-gray-400 min-h-5">{data.condition}</p>
            </div>
          </div>
        </div>

        {/* Damage and Accessories */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-semibold text-xs">Visible Damage:</label>
            <p className="border-b border-gray-400 min-h-12">{data.damage}</p>
          </div>
          <div>
            <label className="font-semibold text-xs">Accessories:</label>
            <p className="border-b border-gray-400 min-h-12">{data.accessories}</p>
          </div>
        </div>

        {/* Estimated Price */}
        <div className="text-sm">
          <label className="font-semibold text-xs">Estimated Repair Cost:</label>
          <p className="border-b border-gray-400 min-h-5">{data.estimatedPrice}</p>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t-2 border-black">
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold mb-8">Technician Signature:</p>
              <div className="border-b-2 border-black h-12"></div>
              <p className="text-xs text-center mt-1">_________________</p>
            </div>
            <div>
              <p className="font-semibold mb-8">Client Signature:</p>
              <div className="border-b-2 border-black h-12"></div>
              <p className="text-xs text-center mt-1">_________________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black pt-4 text-center text-xs text-gray-600 mt-8">
          <p>NEXX GSM © 2026 • Professional Device Repair Service</p>
          <p>Document ID: {templateType.toUpperCase()}-{Date.now()}</p>
        </div>
      </div>
    );
  };

  // Release Document Template
  const renderReleaseDocument = () => {
    const template = getTemplate();
    const data = {
      date: formData.date || new Date().toLocaleDateString(),
      orderNumber: formData.orderNumber || 'ORD-2026-001',
      repairWork: formData.repairWork || '_________________',
      totalCost: formData.totalCost || '_________________',
      warranty: formData.warranty || '30',
      ...formData,
    };

    return (
      <div className="print:p-8 print:bg-white max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b-2 border-black pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">NEXX GSM</h1>
              <p className="text-sm">Service Center</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">{template.title}</h2>
              <p className="text-xs">Date: {data.date}</p>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <label className="font-semibold">Order Number:</label>
            <p className="border-b border-gray-400 min-h-6">{data.orderNumber}</p>
          </div>
          <div>
            <label className="font-semibold">Repair Date:</label>
            <p className="border-b border-gray-400 min-h-6">{data.date}</p>
          </div>
          <div>
            <label className="font-semibold">Warranty (days):</label>
            <p className="border-b border-gray-400 min-h-6">{data.warranty}</p>
          </div>
        </div>

        {/* Work Performed */}
        <div>
          <h3 className="font-bold text-sm mb-2 underline">{Object.values(template.sections)[1]}</h3>
          <p className="border-b border-gray-400 min-h-16 text-sm">{data.repairWork}</p>
        </div>

        {/* Cost Summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-400 pb-2">
              <span>Total Cost:</span>
              <span className="font-bold">{data.totalCost}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t-2 border-black">
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold mb-8">Technician:</p>
              <div className="border-b-2 border-black h-12"></div>
            </div>
            <div>
              <p className="font-semibold mb-8">Client:</p>
              <div className="border-b-2 border-black h-12"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black pt-4 text-center text-xs text-gray-600 mt-8">
          <p>NEXX GSM © 2026 • All repairs covered by warranty</p>
        </div>
      </div>
    );
  };

  // Buyback Document Template
  const renderBuybackDocument = () => {
    const template = getTemplate();
    const data = {
      date: formData.date || new Date().toLocaleDateString(),
      orderNumber: formData.orderNumber || 'ORD-2026-001',
      oldDevice: formData.oldDevice || '_________________',
      deviceValue: formData.deviceValue || '_________________',
      newDevice: formData.newDevice || '_________________',
      discount: formData.discount || '_________________',
      finalPrice: formData.finalPrice || '_________________',
      ...formData,
    };

    return (
      <div className="print:p-8 print:bg-white max-w-4xl mx-auto space-y-6">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-2xl font-bold">NEXX GSM</h1>
          <h2 className="text-xl font-bold text-blue-600">{template.title}</h2>
          <p className="text-xs">Date: {data.date}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-3 underline">{Object.values(template.sections)[0]}</h3>
            <p>Device: {data.oldDevice}</p>
            <p className="border-b border-gray-400 mt-2">Value: {data.deviceValue}</p>
          </div>
          <div>
            <h3 className="font-bold mb-3 underline">{Object.values(template.sections)[1]}</h3>
            <p>Device: {data.newDevice}</p>
            <p className="border-b border-gray-400 mt-2">Trade-in Discount: {data.discount}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-80 space-y-2 text-sm">
            <div className="flex justify-between border-b-2 border-black pb-2 font-bold">
              <span>Final Price:</span>
              <span>{data.finalPrice}</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t-2 border-black">
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold mb-8">Signature:</p>
              <div className="border-b-2 border-black h-12"></div>
            </div>
            <div>
              <p className="font-semibold mb-8">Client:</p>
              <div className="border-b-2 border-black h-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Recycling Document Template
  const renderRecyclingDocument = () => {
    const template = getTemplate();
    const data = {
      date: formData.date || new Date().toLocaleDateString(),
      orderNumber: formData.orderNumber || 'ACT-2026-001',
      equipment: formData.equipment || '_________________',
      quantity: formData.quantity || '0',
      weight: formData.weight || '_________________',
      sender: formData.sender || '_________________',
      receiver: formData.receiver || '_________________',
      ...formData,
    };

    return (
      <div className="print:p-8 print:bg-white max-w-4xl mx-auto space-y-6">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-2xl font-bold">NEXX GSM</h1>
          <h2 className="text-xl font-bold text-green-600">{template.title}</h2>
          <p className="text-xs">Date: {data.date}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-2">{Object.values(template.sections)[0]}</h3>
            <p className="border-b border-gray-400 min-h-12">{data.sender}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">{Object.values(template.sections)[1]}</h3>
            <p className="border-b border-gray-400 min-h-12">{data.receiver}</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-2 underline">{Object.values(template.sections)[2]}</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left p-2">Equipment</th>
                <th className="text-center p-2">Qty</th>
                <th className="text-right p-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-400">
                <td className="p-2">{data.equipment}</td>
                <td className="text-center p-2">{data.quantity}</td>
                <td className="text-right p-2">{data.weight}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t-2 border-black">
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold mb-8">Sender Signature:</p>
              <div className="border-b-2 border-black h-12"></div>
            </div>
            <div>
              <p className="font-semibold mb-8">Receiver Signature:</p>
              <div className="border-b-2 border-black h-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(document.querySelector('.document-content')?.innerHTML || '');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleExportPDF = () => {
    // Would need jsPDF or similar library
    console.log('PDF export triggered');
    onGenerate?.(templateType, 'pdf');
  };

  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="flex gap-3 mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print
        </button>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      <div className="document-content bg-white p-8 rounded border-2 border-gray-300 print:border-0 print:p-0 print:rounded-none">
        {templateType === 'intake' && renderIntakeDocument()}
        {templateType === 'release' && renderReleaseDocument()}
        {templateType === 'buyback' && renderBuybackDocument()}
        {templateType === 'recycling' && renderRecyclingDocument()}
      </div>

      <style>{`
        @media print {
          body, html {
            margin: 0;
            padding: 0;
            background: white;
          }
          .document-content {
            box-shadow: none;
            border: none;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentGenerator;
