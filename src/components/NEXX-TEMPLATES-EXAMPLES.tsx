/**
 * NEXX GSM Document Templates - Practical Usage Examples
 * Complete examples for implementing document templates in your application
 */

import React, { useState } from 'react';
import { NexxDocumentTemplates } from '@/components/NexxDocumentTemplates';
import { DocumentGenerator } from '@/components/DocumentGenerator';
import useTranslation from '@/hooks/useTranslation';
import { generateHTMLDocument, printDocument, exportHTML } from '@/utils/nexx-pdf-generator';
import { NEXX_TEMPLATES } from '@/templates/nexx-document-templates';

// ============================================
// EXAMPLE 1: Simple Template Display
// ============================================

export function SimpleDocumentViewer() {
  return (
    <div className="container mx-auto py-8">
      <h1>NEXX GSM Document Templates</h1>
      <NexxDocumentTemplates templateType="intake" theme="light" />
    </div>
  );
}

// ============================================
// EXAMPLE 2: Document Generation with Form Data
// ============================================

type FormDataShape = Record<string, string | undefined>;
export function DocumentWithFormData() {
  const [formData, setFormData] = useState<FormDataShape>({
    orderNumber: 'ORD-2026-001',
    date: new Date().toLocaleDateString(),
    customerName: 'John Doe',
    customerPhone: '+40 721 234 567',
    customerEmail: 'john@example.com',
    deviceType: 'iPhone',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 15 Pro',
    deviceColor: 'Space Black',
    deviceSerial: 'ABC123XYZ',
    deviceIMEI: '123456789012345',
    condition: 'Good - Minor scratches on case',
    damage: 'Cracked screen',
    accessories: 'Charger included, no box',
    estimatedPrice: '250 lei',
    notes: 'Customer mentioned water exposure, needs full inspection'
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1>Generate Intake Document</h1>
      
      {/* Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-bold mb-4">Fill in the details:</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Order Number"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="border rounded px-3 py-2"
          />
          {/* More fields... */}
        </div>
      </div>

      {/* Document */}
      <DocumentGenerator
        templateType="intake"
        formData={formData}
        theme="light"
      />
    </div>
  );
}

// ============================================
// EXAMPLE 3: Direct HTML Generation
// ============================================

export function DirectHTMLGeneration() {
  const handleGenerateAndPrint = () => {
    const orderData = {
      orderNumber: 'ORD-2026-001',
      customerName: 'Jane Smith',
      deviceType: 'MacBook',
      deviceModel: 'MacBook Pro 16"',
      estimatedPrice: '800 lei'
    };

    // Generate HTML
    const html = generateHTMLDocument('intake', 'en', orderData);

    // Print directly
    printDocument(html);
  };

  const handleGenerateAndExport = () => {
    const orderData = {
      orderNumber: 'ORD-2026-002',
      customerName: 'Bob Johnson',
      deviceType: 'Samsung Galaxy',
      // ... more data
    };

    // Generate HTML
    const html = generateHTMLDocument('release', 'ro', orderData);

    // Export as HTML file
    exportHTML(html, `document-${Date.now()}.html`);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleGenerateAndPrint}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate & Print Intake
      </button>
      <button
        onClick={handleGenerateAndExport}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Generate & Export Release
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Batch Document Generation
// ============================================

export async function batchGenerateDocuments() {
  const orders = [
    {
      type: 'intake' as const,
      language: 'uk' as const,
      data: { orderNumber: 'ORD-001', customerName: 'Client 1' }
    },
    {
      type: 'intake' as const,
      language: 'ru' as const,
      data: { orderNumber: 'ORD-002', customerName: 'Client 2' }
    },
    {
      type: 'release' as const,
      language: 'en' as const,
      data: { orderNumber: 'ORD-003', customerName: 'Client 3' }
    },
    {
      type: 'recycling' as const,
      language: 'ro' as const,
      data: { orderNumber: 'ORD-004', customerName: 'Client 4' }
    }
  ];

  for (const order of orders) {
    const html = generateHTMLDocument(order.type, order.language, order.data);
    exportHTML(html, `${order.type}-${order.data.orderNumber}.html`);
  }

  console.log(`Generated ${orders.length} documents`);
}

// ============================================
// EXAMPLE 5: Intake Form Component
// ============================================

export function IntakeFormExample() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1>Device Intake Form</h1>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info */}
          <fieldset className="border p-4 rounded">
            <legend className="font-bold">Customer Information</legend>
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={formData.customerName || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="tel"
              name="customerPhone"
              placeholder="Phone"
              value={formData.customerPhone || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="email"
              name="customerEmail"
              placeholder="Email"
              value={formData.customerEmail || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </fieldset>

          {/* Device Info */}
          <fieldset className="border p-4 rounded">
            <legend className="font-bold">Device Information</legend>
            <input
              type="text"
              name="deviceType"
              placeholder="Device Type (iPhone, MacBook, etc)"
              value={formData.deviceType || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="text"
              name="deviceBrand"
              placeholder="Brand"
              value={formData.deviceBrand || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="deviceModel"
              placeholder="Model"
              value={formData.deviceModel || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="deviceSerial"
              placeholder="Serial Number"
              value={formData.deviceSerial || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </fieldset>

          {/* Condition Info */}
          <fieldset className="border p-4 rounded">
            <legend className="font-bold">Condition & Damage</legend>
            <input
              type="text"
              name="condition"
              placeholder="Overall Condition"
              value={formData.condition || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <textarea
              name="damage"
              placeholder="Visible Damage"
              value={formData.damage || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              rows={3}
            />
            <input
              type="text"
              name="estimatedPrice"
              placeholder="Estimated Repair Cost"
              value={formData.estimatedPrice || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </fieldset>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Preview & Print
          </button>
        </form>
      ) : (
        <div>
          <button
            onClick={() => setShowPreview(false)}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Form
          </button>
          <DocumentGenerator
            templateType="intake"
            formData={formData}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 6: Multi-Language Support
// ============================================

export function MultiLanguageDocumentGenerator() {
  const { language, getAvailableLanguages, changeLanguage } = useTranslation();

  const handleGenerateInLanguage = (lang: 'uk' | 'ru' | 'en' | 'ro') => {
    const data = {
      orderNumber: 'ORD-2026-100',
      customerName: 'International Client',
      deviceType: 'iPhone',
      estimatedPrice: '300 lei'
    };

    const html = generateHTMLDocument('intake', lang, data);
    printDocument(html);
  };

  return (
    <div className="p-4">
      <h2>Generate in Different Languages</h2>
      <div className="flex gap-2 flex-wrap">
        {getAvailableLanguages().map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleGenerateInLanguage(lang.code as any)}
            className={`px-4 py-2 rounded text-white ${
              language === lang.code ? 'bg-blue-700' : 'bg-blue-600'
            } hover:bg-blue-700`}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Document Pipeline
// ============================================

interface RepairOrder {
  id: string;
  customer: { name: string; phone: string };
  device: { type: string; model: string; serial: string };
  status: 'intake' | 'in-progress' | 'release';
}

export function DocumentPipeline() {
  const [order, setOrder] = useState<RepairOrder>({
    id: 'ORD-2026-999',
    customer: { name: 'Test User', phone: '+40 700 000 000' },
    device: { type: 'iPhone', model: 'iPhone 15', serial: 'ABC123' },
    status: 'intake'
  });

  const handleGenerateIntake = () => {
    const data = {
      orderNumber: order.id,
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      deviceType: order.device.type,
      deviceModel: order.device.model,
      deviceSerial: order.device.serial
    };

    const html = generateHTMLDocument('intake', 'en', data);
    printDocument(html);
  };

  const handleGenerateRelease = () => {
    const data = {
      orderNumber: order.id,
      deviceType: order.device.type,
      deviceModel: order.device.model,
      repairWork: 'Screen replacement, battery test',
      totalCost: '350 lei',
      warranty: 30
    };

    const html = generateHTMLDocument('release', 'en', data);
    printDocument(html);
  };

  return (
    <div className="p-4 border rounded">
      <h3>Order #{order.id}</h3>
      <p>Status: {order.status}</p>

      <div className="mt-4 flex gap-2">
        {order.status === 'intake' && (
          <button
            onClick={handleGenerateIntake}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Print Intake
          </button>
        )}
        {order.status === 'release' && (
          <button
            onClick={handleGenerateRelease}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Print Release
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 8: Release Form Example
// ============================================

export function ReleaseFormExample() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    orderNumber: 'ORD-2026-001',
    date: new Date().toLocaleDateString(),
    repairWork: 'Screen replacement with original parts',
    totalCost: '350 lei',
    warranty: '30'
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1>Device Release Form</h1>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="border p-4 rounded">
            <legend className="font-bold">Repair Information</legend>
            <input
              type="text"
              name="orderNumber"
              placeholder="Order Number"
              value={formData.orderNumber}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <textarea
              name="repairWork"
              placeholder="Work Performed"
              value={formData.repairWork}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              rows={3}
              required
            />
            <input
              type="text"
              name="totalCost"
              placeholder="Total Cost"
              value={formData.totalCost}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="number"
              name="warranty"
              placeholder="Warranty (days)"
              value={formData.warranty}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </fieldset>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Preview & Print
          </button>
        </form>
      ) : (
        <div>
          <button
            onClick={() => setShowPreview(false)}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Form
          </button>
          <DocumentGenerator
            templateType="release"
            formData={formData}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 9: Buyback Form Example
// ============================================

export function BuybackFormExample() {
  const [formData, setFormData] = useState({
    orderNumber: 'BUY-2026-001',
    date: new Date().toLocaleDateString(),
    oldDevice: 'iPhone 13 Pro Max',
    deviceValue: '1500 lei',
    newDevice: 'iPhone 15 Pro Max',
    discount: '800 lei',
    finalPrice: '3200 lei'
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1>Device Buyback/Trade-in Form</h1>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="border p-4 rounded">
            <legend className="font-bold">Trade-in Information</legend>
            <input
              type="text"
              name="orderNumber"
              placeholder="Transaction Number"
              value={formData.orderNumber}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="text"
              name="oldDevice"
              placeholder="Old Device Description"
              value={formData.oldDevice}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="text"
              name="deviceValue"
              placeholder="Buyback Value"
              value={formData.deviceValue}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="newDevice"
              placeholder="New Device"
              value={formData.newDevice}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="discount"
              placeholder="Trade-in Discount"
              value={formData.discount}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="finalPrice"
              placeholder="Final Price"
              value={formData.finalPrice}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </fieldset>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Preview & Print
          </button>
        </form>
      ) : (
        <div>
          <button
            onClick={() => setShowPreview(false)}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Form
          </button>
          <DocumentGenerator
            templateType="buyback"
            formData={formData}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 10: Recycling/E-waste Form Example
// ============================================

export function RecyclingFormExample() {
  const [formData, setFormData] = useState({
    orderNumber: 'REC-2026-001',
    date: new Date().toLocaleDateString(),
    sender: 'NEXX GSM Service Center',
    receiver: 'Green Recycling Solutions',
    equipment: 'Mixed Electronic Devices',
    quantity: '50',
    weight: '120 kg'
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1>E-waste Recycling Transfer Form</h1>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="border p-4 rounded">
            <legend className="font-bold">E-waste Information</legend>
            <input
              type="text"
              name="orderNumber"
              placeholder="Recycling Batch Number"
              value={formData.orderNumber}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              type="text"
              name="sender"
              placeholder="Sender Organization"
              value={formData.sender}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="receiver"
              placeholder="Receiver Organization"
              value={formData.receiver}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <textarea
              name="equipment"
              placeholder="Equipment Description"
              value={formData.equipment}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
              rows={2}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity (units)"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="weight"
              placeholder="Total Weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </fieldset>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Preview & Print
          </button>
        </form>
      ) : (
        <div>
          <button
            onClick={() => setShowPreview(false)}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Form
          </button>
          <DocumentGenerator
            templateType="recycling"
            formData={formData}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 11: Template Configuration
// ============================================

export function TemplateConfiguration() {
  const availableTemplates = Object.keys(NEXX_TEMPLATES);
  const availableLanguages = ['uk', 'ru', 'en', 'ro'];
  const availableFormats = ['pdf', 'html', 'docx'];

  return (
    <div className="p-4">
      <h2>Template Configuration Info</h2>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <h3 className="font-bold">Available Templates ({availableTemplates.length})</h3>
          <ul>
            {availableTemplates.map((t) => (
              <li key={t}>✓ {t}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Supported Languages ({availableLanguages.length})</h3>
          <ul>
            {availableLanguages.map((l) => (
              <li key={l}>✓ {l}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Export Formats ({availableFormats.length})</h3>
          <ul>
            {availableFormats.map((f) => (
              <li key={f}>✓ {f.toUpperCase()}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Export all examples
// ============================================

export default {
  SimpleDocumentViewer,
  DocumentWithFormData,
  DirectHTMLGeneration,
  batchGenerateDocuments,
  IntakeFormExample,
  MultiLanguageDocumentGenerator,
  DocumentPipeline,
  ReleaseFormExample,
  BuybackFormExample,
  RecyclingFormExample,
  TemplateConfiguration
};
