/**
 * TypeScript Type Definitions for NEXX v9.0
 */

// Device types for calculator
export type DeviceType = 'iphone' | 'android' | 'macbook' | 'laptop' | 'ipad' | 'watch';

// Service for calculator
export interface Service {
  id: string;
  name: string;
  price: number;
  time: number; // minutes
  category?: string;
}

// Device definition for calculator
export interface Device {
  id: DeviceType;
  name: string;
  emoji: string;
  icon: string; // Font Awesome icon class
}

// Booking form data
export interface BookingFormData {
  name: string;
  phone: string;
  device: string;
  comment?: string;
  service?: string;
}

// Booking API response (RO App)
export interface BookingResponse {
  success: boolean;
  message: string;
  orderId?: string;
  error?: string;
}

// FAQ Item
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// Gallery Image
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

// Stat for stats section
export interface Stat {
  id: string;
  icon: string;
  value: string;
  label: string;
  description?: string;
}

// Trust badge
export interface TrustBadge {
  id: string;
  icon: string;
  text: string;
  variant?: 'success' | 'warning' | 'info';
}

// Price calculation result
export interface PriceCalculation {
  services: Service[];
  totalPrice: number;
  totalTime: number;
  device: DeviceType;
  currency: string;
}

// Component props types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  hover?: boolean;
  className?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Navigation menu item
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  protected?: boolean; // Requires authentication
}

// Theme type
export type Theme = 'light' | 'dark' | 'auto';

// Language type
export type Language = 'uk' | 'en' | 'ru';

// Animation variants
export interface AnimationVariants {
  initial: any;
  animate: any;
  exit?: any;
  transition?: any;
}

// API response wrapper
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// NEXX Database types
export interface NEXXDatabaseAuth {
  authenticated: boolean;
  timestamp: number;
}

export interface KnowledgeBaseSection {
  id: string;
  title: string;
  content: any;
  icon: string;
}

// Calculator services database
export interface CalculatorServicesDB {
  [device: string]: Service[];
}

export const CALCULATOR_SERVICES: CalculatorServicesDB = {
  iphone: [
    { id: 'screen', name: 'Заміна дисплея', price: 80, time: 30 },
    { id: 'battery', name: 'Заміна батареї', price: 45, time: 20 },
    { id: 'charging', name: 'Ремонт зарядки', price: 35, time: 25 },
    { id: 'speaker', name: 'Заміна динаміка', price: 30, time: 20 },
    { id: 'camera', name: 'Заміна камери', price: 55, time: 30 },
    { id: 'water', name: 'Чистка після залиття', price: 70, time: 60 },
    { id: 'glass', name: 'Заміна заднього скла', price: 60, time: 45 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 15 },
  ],
  android: [
    { id: 'screen', name: 'Заміна дисплея', price: 65, time: 40 },
    { id: 'battery', name: 'Заміна батареї', price: 35, time: 25 },
    { id: 'charging', name: 'Ремонт зарядки', price: 30, time: 30 },
    { id: 'speaker', name: 'Заміна динаміка', price: 25, time: 20 },
    { id: 'camera', name: 'Заміна камери', price: 45, time: 35 },
    { id: 'water', name: 'Чистка після залиття', price: 60, time: 60 },
    { id: 'software', name: 'Програмне забезпечення', price: 25, time: 30 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 15 },
  ],
  macbook: [
    { id: 'screen', name: 'Заміна екрану', price: 250, time: 90 },
    { id: 'battery', name: 'Заміна батареї', price: 120, time: 60 },
    { id: 'keyboard', name: 'Заміна клавіатури', price: 150, time: 90 },
    { id: 'ssd', name: 'Заміна SSD', price: 80, time: 45 },
    { id: 'cleaning', name: 'Чистка від пилу', price: 45, time: 60 },
    { id: 'thermal', name: 'Заміна термопасти', price: 35, time: 45 },
    { id: 'water', name: 'Чистка після залиття', price: 150, time: 120 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 30 },
  ],
  laptop: [
    { id: 'screen', name: 'Заміна екрану', price: 120, time: 60 },
    { id: 'battery', name: 'Заміна батареї', price: 60, time: 30 },
    { id: 'keyboard', name: 'Заміна клавіатури', price: 70, time: 60 },
    { id: 'ram', name: 'Збільшення RAM', price: 40, time: 30 },
    { id: 'ssd', name: 'Заміна SSD', price: 50, time: 30 },
    { id: 'cleaning', name: 'Чистка від пилу', price: 35, time: 45 },
    { id: 'thermal', name: 'Заміна термопасти', price: 25, time: 30 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 20 },
  ],
  ipad: [
    { id: 'screen', name: 'Заміна дисплея', price: 120, time: 60 },
    { id: 'battery', name: 'Заміна батареї', price: 65, time: 45 },
    { id: 'charging', name: 'Ремонт зарядки', price: 45, time: 30 },
    { id: 'button', name: 'Заміна кнопки', price: 40, time: 30 },
    { id: 'camera', name: 'Заміна камери', price: 50, time: 35 },
    { id: 'water', name: 'Чистка після залиття', price: 80, time: 90 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 20 },
  ],
  watch: [
    { id: 'screen', name: 'Заміна дисплея', price: 90, time: 45 },
    { id: 'battery', name: 'Заміна батареї', price: 55, time: 30 },
    { id: 'crown', name: 'Ремонт Digital Crown', price: 40, time: 30 },
    { id: 'sensor', name: 'Заміна датчика', price: 30, time: 20 },
    { id: 'water', name: 'Чистка після залиття', price: 45, time: 30 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 15 },
  ],
};

export const DEVICES: Device[] = [
  { id: 'iphone', name: 'iPhone', emoji: '📱', icon: 'fa-mobile-screen' },
  { id: 'android', name: 'Android', emoji: '🤖', icon: 'fa-mobile' },
  { id: 'macbook', name: 'MacBook', emoji: '💻', icon: 'fa-laptop' },
  { id: 'laptop', name: 'Ноутбук', emoji: '🖥️', icon: 'fa-laptop-code' },
  { id: 'ipad', name: 'iPad', emoji: '📱', icon: 'fa-tablet-screen-button' },
  { id: 'watch', name: 'Apple Watch', emoji: '⌚', icon: 'fa-clock' },
];

// ============================================
// REMONLINE FORMS & DOCUMENTS TYPES
// ============================================

// Form types
export type RemonlineFormType = 'repair_order' | 'callback' | 'diagnostic' | 'document' | 'document_request';
export type DocumentType = 'invoice' | 'act' | 'contract' | 'estimate' | 'receipt' | 'warranty_card';
export type Language = 'uk' | 'ru' | 'en' | 'ro';

// Repair Order Form
export interface RepairOrderForm {
  id?: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  device: {
    type: string; // iPhone, MacBook, etc.
    brand: string;
    model: string;
    serialNumber?: string;
  };
  problem: string;
  problemDetails?: string;
  estimatedCost?: number;
  preferredDate?: string;
  preferredTime?: string;
  comments?: string;
  source: string; // 'website_form', 'callback', etc.
  language: Language;
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed';
  createdAt?: string;
}

// Callback Form
export interface CallbackForm {
  id?: string;
  customerName: string;
  customerPhone: string;
  device?: string;
  problem?: string;
  preferredTime?: string;
  language: Language;
  aiCallEnabled?: boolean;
  timestamp?: string;
}

// Diagnostic Form
export interface DiagnosticForm {
  id?: string;
  orderId?: string;
  customerId?: string;
  device: {
    type: string;
    brand: string;
    model: string;
  };
  diagnosticResults: {
    status: string; // 'working', 'defective', 'needs_repair'
    findings: string;
    estimatedRepairCost?: number;
    estimatedRepairTime?: number;
  };
  technician?: string;
  timestamp?: string;
  language: Language;
}

// Document Form (for requesting documents)
export interface DocumentRequestForm {
  id?: string;
  orderId: string;
  documentType: DocumentType;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  language: Language;
  includeDetails?: boolean;
  timestamp?: string;
}

// Document Structure
export interface RemonlineDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  issueDate: string;
  dueDate?: string;
  order: {
    id: string;
    customerId?: string;
  };
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    taxId?: string;
  };
  items: DocumentItem[];
  subtotal: number;
  tax?: number;
  total: number;
  currency: string;
  language: Language;
  notes?: string;
  signature?: string;
  terms?: string;
  watermark?: string;
}

export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

// Unified Response from Remonline API
export interface RemonlineFormResponse {
  success: boolean;
  id?: string;
  formId?: string;
  documentId?: string;
  message: string;
  warning?: string;
  error?: string;
  redirectUrl?: string;
  data?: any;
}

// Document generation response
export interface DocumentGenerationResponse {
  success: boolean;
  documentId?: string;
  downloadUrl?: string;
  previewUrl?: string;
  format: string; // 'pdf', 'html', 'docx'
  message: string;
}

// Form validation result
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings?: Record<string, string[]>;
}
