# ⚡ СРОЧНЫЕ ДОДЕЛКИ - QUICK FIX LIST

## 🔴 КРИТИЧЕСКОЕ (ДЕЛАТЬ В ПЕРВУЮ ОЧЕРЕДЬ)

### 1. Исправить NexxDocumentTemplates - добавить default value
```typescript
// File: src/components/NexxDocumentTemplates.tsx
// Line: 8
// BEFORE
interface NexxDocumentTemplatesProps {
  templateType?: TemplateType;

// AFTER
interface NexxDocumentTemplatesProps {
  templateType?: TemplateType = 'intake'; // ❌ СИНТАКСИС ОШИБКА!

// ПРАВИЛЬНО:
export const NexxDocumentTemplates: React.FC<NexxDocumentTemplatesProps> = ({
  templateType = 'intake', // ✅ ЗДЕСЬ!
```

### 2. Добавить недостающие рендеры в DocumentGenerator
```typescript
// File: src/components/DocumentGenerator.tsx
// ДОБАВИТЬ после renderIntakeDocument():

// renderReleaseDocument()
// renderBuybackDocument()
// renderRecyclingDocument()

// И в handleExportDocument:
if (templateType === 'release') renderReleaseDocument();
if (templateType === 'buyback') renderBuybackDocument();
if (templateType === 'recycling') renderRecyclingDocument();
```

### 3. Реализовать PDF экспорт
```typescript
// File: src/utils/nexx-pdf-generator.ts
// Line: 454

export const exportPDF = async (
  htmlContent: string,
  filename: string = 'document.pdf'
) => {
  // ТЕКУЩЕЕ (BAD):
  console.warn('PDF export requires jsPDF library to be installed');
  
  // НУЖНО (GOOD):
  try {
    const jsPDF = require('jspdf');
    const doc = new jsPDF();
    doc.html(htmlContent);
    doc.save(filename);
  } catch (e) {
    console.warn('jsPDF not installed');
  }
};
```

### 4. Добавить API endpoints для документов
```javascript
// File: functions/api/remonline.js
// ADD after existing handlers:

// POST /api/documents/generate
if (action === 'generate_document') {
  const { documentType, language, data } = body;
  // Generate document from template
  return generateDocument(documentType, language, data);
}

// GET /api/documents/:id
if (action === 'get_document') {
  const { documentId } = body;
  // Get document by ID
  return getDocumentById(documentId);
}

// POST /api/documents/:id/send
if (action === 'send_document') {
  const { documentId, email } = body;
  // Send document via email
  return sendDocumentEmail(documentId, email);
}
```

---

## 🟡 ВАЖНОЕ (ДЕЛАТЬ ВО ВТОРУЮ ОЧЕРЕДЬ)

### 1. Добавить все i18n ключи в i18n.js
```javascript
// public/static/i18n.js
// ADD before meta: line for each language:

nexxIntakeForm: {
  title: 'Device Intake',
  fields: {
    customerName: 'Name',
    // ... все поля
  }
},

nexxReleaseForm: {
  // ...
},

nexxBuybackForm: {
  // ...
},

nexxRecyclingForm: {
  // ...
}
```

### 2. Добавить недостающие примеры
```typescript
// File: src/components/NEXX-TEMPLATES-EXAMPLES.tsx
// ADD EXAMPLE 9: Release Form
// ADD EXAMPLE 10: Buyback Form
// ADD EXAMPLE 11: Recycling Form
// ADD EXAMPLE 12: Batch API Integration
```

### 3. Добавить print стили
```css
/* Add to each component */
@media print {
  .no-print { display: none; }
  .document { 
    page-break-inside: avoid;
    page-break-after: always;
  }
  body {
    margin: 0;
    padding: 10mm;
  }
}
```

### 4. Расширить типы в lib/types.ts
```typescript
// ADD:
export interface NexxDocumentTemplatesProps {
  templateType?: TemplateType;
  onExport?: (format: 'pdf' | 'html' | 'docx') => Promise<void>;
  onEmail?: (recipient: string) => Promise<void>;
  onPrint?: () => void;
  language?: Language;
}

export interface DocumentGeneratorProps {
  templateType: TemplateType;
  formData?: Record<string, any>;
  onGenerate?: (template: TemplateType, format: 'pdf' | 'html') => void;
  theme?: 'light' | 'dark';
  onPrint?: () => void;
  onPreview?: () => void;
}
```

---

## ✅ ДОДЕЛАНО (МОЖНО ПРОПУСТИТЬ)

- ✅ Компоненты созданы
- ✅ Шаблоны готовы
- ✅ Примеры работают
- ✅ Документация полная
- ✅ Импорты исправлены
- ✅ Linting прошел

---

## 📋 TODO ДЛЯ БЫСТРОГО ФИКСА (30-60 мин)

- [ ] 1. Добавить default `templateType = 'intake'` в NexxDocumentTemplates
- [ ] 2. Реализовать 3 недостающих рендер функции в DocumentGenerator
- [ ] 3. Добавить jsPDF интеграцию в exportPDF()
- [ ] 4. Добавить 3 новых API endpoint в remonline.js
- [ ] 5. Добавить недостающие i18n ключи
- [ ] 6. Добавить 3 недостающих примера
- [ ] 7. Добавить @media print стили

**Время на доделку:** ~1-2 часа  
**Сложность:** Low-Medium  
**Риск:** Low
