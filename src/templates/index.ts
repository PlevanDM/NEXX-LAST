/**
 * Template exports
 */

export { NEXX_TEMPLATES, INTAKE_TEMPLATE, RELEASE_TEMPLATE, BUYBACK_TEMPLATE, RECYCLING_TEMPLATE, ESTIMATE_TEMPLATE, INVOICE_TEMPLATE, WARRANTY_TEMPLATE, TICKET_TEMPLATE, WORK_ORDER_TEMPLATE, PAYMENT_RECEIPT_TEMPLATE, SALE_INVOICE_TEMPLATE } from './nexx-document-templates';
export { NEXX_TEMPLATES as default } from './nexx-document-templates';

/** Company info — single source of truth for all document templates */
export const NEXX_COMPANY = {
  name: 'NEXX GSM',
  fullName: 'NEXX GSM Service Center',
  owner: 'Dmytro Plevan',
  phone: '+40 758 117 409',
  email: 'dmitro.plevan@gmail.com',
  city: 'Bucharest',
  country: 'Romania',
  address: 'Bucharest, Romania',
  currency: 'RON',
  warranty: 30, // days
  year: 2026,
  cui: '', // fiscal code — fill when available
  regCom: '', // trade register — fill when available
} as const;
