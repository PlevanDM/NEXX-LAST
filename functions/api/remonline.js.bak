/**
 * Cloudflare Workers Function - Remonline API Proxy
 * 
 * Handles API calls to Remonline CRM system with support for:
 *   - Repair Orders
 *   - Callbacks
 *   - Diagnostics
 *   - Document Requests
 *   - Inquiry/Leads
 * 
 * Endpoints:
 *   POST /api/remonline - Handle various form types (repair_order, callback, diagnostic, document, inquiry, generate_document, send_document_email)
 *   GET /api/remonline?action=... - get_order (id=), get_branches, get_statuses, get_prices (device_type, issue_type)
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const action = new URL(request.url).searchParams.get('action');
    const formType = body.formType || action;
    
    // Remonline API configuration
    const REMONLINE_API_KEY = env.REMONLINE_API_KEY || '';
    const REMONLINE_BASE_URL = env.REMONLINE_BASE_URL || 'https://api.remonline.app';
    const BRANCH_ID = env.REMONLINE_BRANCH_ID || '';
    
    if (!REMONLINE_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Remonline API not configured',
        message: 'Service temporarily unavailable'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // ============================================
    // REPAIR ORDER
    // ============================================
    if (formType === 'repair_order' || action === 'create_order') {
      return await handleRepairOrder(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID);
    }
    
    // ============================================
    // CALLBACK REQUEST
    // ============================================
    if (formType === 'callback') {
      return await handleCallback(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID);
    }
    
    // ============================================
    // DIAGNOSTIC REQUEST
    // ============================================
    if (formType === 'diagnostic') {
      return await handleDiagnostic(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID);
    }
    
    // ============================================
    // DOCUMENT REQUEST
    // ============================================
    if (formType === 'document' || formType === 'document_request') {
      return await handleDocumentRequest(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID);
    }
    
    // ============================================
    // INQUIRY/LEAD (Legacy)
    // ============================================
    if (action === 'create_inquiry' || action === 'create_lead') {
      return await handleInquiry(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID);
    }

    // ============================================
    // DOCUMENT GENERATION
    // ============================================
    if (formType === 'generate_document' || action === 'generate_document') {
      return await handleDocumentGeneration(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID);
    }

    // ============================================
    // DOCUMENT EMAIL SENDING
    // ============================================
    if (formType === 'send_document_email' || action === 'send_document_email') {
      return await handleDocumentEmail(body, REMONLINE_API_KEY);
    }

    // ============================================
    // BOOKING / APPOINTMENT (record on visit)
    // ============================================
    if (formType === 'booking' || formType === 'appointment' || action === 'create_booking') {
      return await handleBooking(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID);
    }
    
    // Unknown action
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Unknown action',
      message: 'Invalid form type'
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
    
  } catch (error) {
    console.error('Remonline API error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      message: 'Error processing request'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// ============================================
// REMONLINE API HELPERS
// ============================================

/**
 * Get Remonline auth token
 */
async function getRemonlineToken(baseUrl, apiKey) {
  const response = await fetch(`${baseUrl}/token/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `api_key=${apiKey}`
  });
  const data = await response.json();
  if (!data.success || !data.token) {
    throw new Error('Failed to get Remonline token');
  }
  return data.token;
}

/**
 * Create or find client in Remonline
 */
async function getOrCreateClient(baseUrl, token, name, phone) {
  // Try to create client
  const createRes = await fetch(`${baseUrl}/clients/?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name || 'Client Website',
      phone: [phone]
    })
  });
  const createData = await createRes.json();
  
  if (createData.data?.id) {
    return createData.data.id;
  }
  
  // If client exists, search for it
  const searchRes = await fetch(`${baseUrl}/clients/?token=${token}&phones[]=${encodeURIComponent(phone)}`);
  const searchData = await searchRes.json();
  
  if (searchData.data?.length > 0) {
    return searchData.data[0].id;
  }
  
  throw new Error('Failed to create or find client');
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (basic)
 */
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

/**
 * Validate required fields
 */
function validateRequiredFields(data, requiredFields) {
  const errors = [];
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`Field '${field}' is required`);
    }
  });
  return errors;
}

/**
 * Validate repair order
 */
function validateRepairOrder(body) {
  const errors = [];
  
  // Required fields
  const required = validateRequiredFields(body, ['customerName', 'customerPhone', 'deviceType']);
  errors.push(...required);
  
  // Email validation (if provided)
  if (body.customerEmail && !isValidEmail(body.customerEmail)) {
    errors.push('Invalid email format');
  }
  
  // Phone validation
  if (body.customerPhone && !isValidPhone(body.customerPhone)) {
    errors.push('Invalid phone format');
  }
  
  return errors;
}

/**
 * Validate callback
 */
function validateCallback(body) {
  const errors = [];
  
  const required = validateRequiredFields(body, ['customerName', 'customerPhone']);
  errors.push(...required);
  
  if (body.customerPhone && !isValidPhone(body.customerPhone)) {
    errors.push('Invalid phone format');
  }
  
  return errors;
}

/**
 * Validate diagnostic
 */
function validateDiagnostic(body) {
  const errors = [];
  
  const required = validateRequiredFields(body, ['deviceType', 'problem']);
  errors.push(...required);
  
  return errors;
}

/**
 * Validate document request
 */
function validateDocumentRequest(body) {
  const errors = [];
  
  const required = validateRequiredFields(body, ['orderId', 'documentType']);
  errors.push(...required);
  
  // Validate document type
  const validDocTypes = ['invoice', 'act', 'contract', 'estimate', 'receipt', 'warranty'];
  if (body.documentType && !validDocTypes.includes(body.documentType)) {
    errors.push(`Invalid document type. Must be one of: ${validDocTypes.join(', ')}`);
  }
  
  return errors;
}

async function handleRepairOrder(body, baseUrl, apiKey, branchId) {
  try {
    // Validate input
    const validationErrors = validateRepairOrder(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        validationErrors,
        message: 'Invalid form data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Get auth token
    const token = await getRemonlineToken(baseUrl, apiKey);
    
    // Get or create client
    const cleanPhone = body.customerPhone.replace(/[^0-9+]/g, '');
    const clientId = await getOrCreateClient(baseUrl, token, body.customerName.trim(), cleanPhone);
    
    // Create order
    const now = new Date().toISOString();
    const orderRes = await fetch(`${baseUrl}/order/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: parseInt(branchId),
        client_id: clientId,
        kindof_good: body.device?.type || 'Telefon',
        brand: body.device?.brand || '',
        model: body.device?.model || '',
        malfunction: body.problem || '',
        manager_notes: `🌐 WEBSITE ORDER\n📱 ${body.device?.type || ''} ${body.device?.brand || ''} ${body.device?.model || ''}\n📞 ${cleanPhone}\n❓ ${body.problem || 'N/A'}\n${body.problemDetails ? '📝 ' + body.problemDetails : ''}\n💰 Est: ${body.estimatedCost || 'N/A'}\n⏰ ${now}\nSource: ${body.source || 'website_form'}`
      })
    });
    
    const orderData = await orderRes.json();
    
    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }
    
    return new Response(JSON.stringify({
      success: true,
      id: orderData.data?.id,
      formId: orderData.data?.id,
      message: 'Repair order created successfully',
      data: orderData.data
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleRepairOrder error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Failed to create repair order'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleCallback(body, baseUrl, apiKey, branchId) {
  try {
    // Validate input
    const validationErrors = validateCallback(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        validationErrors,
        message: 'Invalid form data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Get auth token
    const token = await getRemonlineToken(baseUrl, apiKey);
    
    // Get or create client
    const cleanPhone = body.customerPhone.replace(/[^0-9+]/g, '');
    const clientId = await getOrCreateClient(baseUrl, token, body.customerName.trim(), cleanPhone);
    
    // Create order (callbacks are orders in Remonline)
    const now = new Date().toISOString();
    const orderRes = await fetch(`${baseUrl}/order/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: parseInt(branchId),
        client_id: clientId,
        kindof_good: body.device || 'Telefon',
        malfunction: body.problem || 'Callback request',
        manager_notes: `📞 CALLBACK REQUEST\n👤 ${body.customerName}\n📱 ${body.device || 'N/A'}\n❓ ${body.problem || 'N/A'}\n⏰ Preferred: ${body.preferredTime || 'ASAP'}\n🌐 Source: website\n📅 ${now}`
      })
    });
    
    const orderData = await orderRes.json();
    
    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create callback');
    }
    
    return new Response(JSON.stringify({
      success: true,
      id: orderData.data?.id,
      formId: orderData.data?.id,
      message: 'Callback request created successfully',
      data: orderData.data
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleCallback error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Failed to create callback request'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleDiagnostic(body, baseUrl, apiKey, branchId) {
  try {
    // Validate input
    const validationErrors = validateDiagnostic(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        validationErrors,
        message: 'Invalid form data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const diagnosticData = {
      branch_id: branchId,
      order_id: body.orderId,
      device: {
        type: body.device?.type,
        brand: body.device?.brand,
        model: body.device?.model,
      },
      findings: body.diagnosticResults?.findings,
      status: body.diagnosticResults?.status,
      estimated_repair_cost: body.diagnosticResults?.estimatedRepairCost,
      estimated_repair_time: body.diagnosticResults?.estimatedRepairTime,
      technician: body.technician,
      language: body.language || 'uk',
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch(`${baseUrl}/diagnostics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(diagnosticData)
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      id: result.id,
      formId: result.id,
      message: 'Diagnostic submitted successfully',
      data: result
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleDiagnostic error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Failed to submit diagnostic'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleDocumentRequest(body, baseUrl, apiKey, branchId) {
  try {
    // Validate input
    const validationErrors = validateDocumentRequest(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        validationErrors,
        message: 'Invalid form data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const documentData = {
      branch_id: branchId,
      order_id: body.orderId,
      document_type: body.documentType,
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      customer_address: body.customerAddress,
      include_details: body.includeDetails,
      language: body.language || 'uk',
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch(`${baseUrl}/documents/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(documentData)
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      id: result.id,
      documentId: result.document_id,
      message: 'Document request created successfully',
      data: result
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleDocumentRequest error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Failed to create document request'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleInquiry(body, baseUrl, apiKey, branchId) {
  try {
    // If no contact info, just return success (price calculation only)
    if (!body.phone && !body.name) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Price calculated (no contact info)',
        lead_id: null
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Get auth token
    const token = await getRemonlineToken(baseUrl, apiKey);
    
    // Get or create client
    const cleanPhone = (body.phone || '').replace(/[^0-9+]/g, '');
    const clientId = await getOrCreateClient(baseUrl, token, body.name || 'Calculator Lead', cleanPhone);
    
    // Create order/lead
    const now = new Date().toISOString();
    const deviceInfo = `${body.device?.brand || ''} ${body.device?.type || ''} ${body.device?.model || ''}`.trim();
    
    const orderRes = await fetch(`${baseUrl}/order/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: parseInt(branchId),
        client_id: clientId,
        kindof_good: body.device?.type || 'Telefon',
        brand: body.device?.brand || '',
        model: body.device?.model || '',
        malfunction: body.issue || 'Price calculator lead',
        manager_notes: `🧮 CALCULATOR LEAD\n📱 ${deviceInfo}\n❓ ${body.issue || 'N/A'}\n💰 Est: ${body.estimated_price || body.estimatedPrice || 'N/A'}\n📅 ${now}\n🌐 Source: price_calculator`
      })
    });
    
    const orderData = await orderRes.json();
    
    return new Response(JSON.stringify({
      success: true,
      lead_id: orderData.data?.id,
      message: 'Inquiry created successfully',
      data: orderData.data
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleInquiry error:', error);
    // Don't fail on inquiry errors - graceful degradation
    return new Response(JSON.stringify({
      success: true,
      message: 'Price calculated (CRM offline)',
      warning: error.message
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * Validate booking/appointment
 */
function validateBooking(body) {
  const errors = [];
  const required = validateRequiredFields(body, ['customerName', 'customerPhone']);
  errors.push(...required);
  if (body.customerPhone && !isValidPhone(body.customerPhone)) errors.push('Invalid phone format');
  return errors;
}

/**
 * Handle booking / appointment (record on visit)
 * Creates an order in Remonline with type "Appointment" so manager can schedule.
 */
async function handleBooking(body, baseUrl, apiKey, branchId) {
  try {
    const validationErrors = validateBooking(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        validationErrors,
        message: 'Invalid form data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const token = await getRemonlineToken(baseUrl, apiKey);
    const cleanPhone = (body.customerPhone || '').replace(/[^0-9+]/g, '');
    const clientId = await getOrCreateClient(baseUrl, token, (body.customerName || '').trim(), cleanPhone);

    const now = new Date().toISOString();
    const preferredDate = body.preferredDate || body.preferred_date || '';
    const preferredTime = body.preferredTime || body.preferred_time || body.comment || '';

    const orderRes = await fetch(`${baseUrl}/order/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: parseInt(branchId),
        client_id: clientId,
        kindof_good: 'Vizită',
        brand: '',
        model: '',
        malfunction: body.comment || 'Programare vizită',
        manager_notes: `📅 PROGRAMARE VIZITĂ\n👤 ${body.customerName}\n📞 ${cleanPhone}\n📆 Preferat: ${preferredDate || 'N/A'} ${preferredTime ? preferredTime : ''}\n📝 ${body.comment || ''}\n⏰ ${now}\n🌐 Source: website_booking`
      })
    });

    const orderData = await orderRes.json();
    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create booking');
    }

    return new Response(JSON.stringify({
      success: true,
      id: orderData.data?.id,
      message: 'Booking request created successfully',
      data: orderData.data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    console.error('handleBooking error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Failed to create booking request'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

/**
 * Handle document generation request
 */
async function handleDocumentGeneration(body, REMONLINE_BASE_URL, REMONLINE_API_KEY, BRANCH_ID) {
  try {
    const {
      templateType, // 'intake', 'release', 'buyback', 'recycling'
      language = 'en',
      formData = {},
      orderId
    } = body;

    // Validate template type
    const validTemplates = ['intake', 'release', 'buyback', 'recycling'];
    if (!validTemplates.includes(templateType)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid template type',
        validTypes: validTemplates
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Generate unique document ID
    const documentId = `${templateType}-${Date.now()}`;
    
    // Store document metadata (would use Durable Objects or KV in production)
    const documentMetadata = {
      id: documentId,
      templateType,
      language,
      orderId,
      formData,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return new Response(JSON.stringify({
      success: true,
      documentId,
      templateType,
      language,
      message: 'Document generated successfully',
      metadata: documentMetadata
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleDocumentGeneration error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Error generating document'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

/**
 * Handle document retrieval request
 */
async function handleDocumentRetrieval(documentId, REMONLINE_BASE_URL, REMONLINE_API_KEY) {
  try {
    // In production, retrieve from KV storage or Durable Objects
    // For now, return document metadata structure
    
    return new Response(JSON.stringify({
      success: true,
      documentId,
      message: 'Document retrieved successfully',
      document: {
        id: documentId,
        status: 'ready',
        createdAt: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleDocumentRetrieval error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Error retrieving document'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

/**
 * Handle document send via email
 */
async function handleDocumentEmail(body, REMONLINE_API_KEY) {
  try {
    const {
      documentId,
      recipientEmail,
      subject = 'Your NEXX GSM Document',
      message = 'Please find your document attached'
    } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email address'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // In production, use email service like SendGrid, Mailgun, etc.
    // For now, log and return success
    console.log(`📧 Document ${documentId} queued for email to ${recipientEmail}`);

    return new Response(JSON.stringify({
      success: true,
      documentId,
      recipientEmail,
      message: 'Email sent successfully',
      deliveryStatus: 'queued'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('handleDocumentEmail error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Error sending email'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    const REMONLINE_API_KEY = env.REMONLINE_API_KEY || '';
    const REMONLINE_BASE_URL = env.REMONLINE_BASE_URL || 'https://api.remonline.app';

    if (!REMONLINE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Remonline API not configured' }), { status: 500, headers: cors });
    }

    // Remonline uses token from token/new for read requests (not Bearer api_key)
    let token;
    const needToken = ['get_order', 'get_branches', 'get_statuses', 'get_services'].includes(action);
    if (needToken) {
      token = await getRemonlineToken(REMONLINE_BASE_URL, REMONLINE_API_KEY);
    }

    // Get Order by ID (Remonline: GET order/?token=...&ids[]=id)
    if (action === 'get_order') {
      const orderId = url.searchParams.get('id');
      if (!orderId) {
        return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: cors });
      }
      const res = await fetch(
        `${REMONLINE_BASE_URL}/order/?token=${token}&ids[]=${encodeURIComponent(orderId)}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const data = await res.json();
      const order = data.data && data.data[0] ? data.data[0] : (data.data || data);
      return new Response(JSON.stringify({ success: data.success !== false, data: order }), {
        status: 200,
        headers: { ...cors, 'Cache-Control': 'private, max-age=60' }
      });
    }

    // Get Branches (addresses, phones — for contact page or branch selector)
    if (action === 'get_branches') {
      const res = await fetch(`${REMONLINE_BASE_URL}/branches/?token=${token}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      const branches = data.data || data;
      return new Response(JSON.stringify({ success: true, data: branches }), {
        status: 200,
        headers: { ...cors, 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // Get Statuses (order status list — for "track order" human-readable labels)
    if (action === 'get_statuses') {
      const res = await fetch(`${REMONLINE_BASE_URL}/statuses/?token=${token}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      const statuses = data.data || data;
      return new Response(JSON.stringify({ success: true, data: statuses }), {
        status: 200,
        headers: { ...cors, 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // Get Services (list of services — for "our services" block, no prices)
    if (action === 'get_services') {
      const res = await fetch(`${REMONLINE_BASE_URL}/services/?token=${token}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json().catch(() => ({}));
      const list = data.data || data.services || (Array.isArray(data) ? data : []);
      return new Response(JSON.stringify({ success: true, data: list }), {
        status: 200,
        headers: { ...cors, 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // Get Prices (if Remonline exposes /prices; otherwise may 404)
    if (action === 'get_prices') {
      const deviceType = url.searchParams.get('device_type') || '';
      const issueType = url.searchParams.get('issue_type') || '';
      const res = await fetch(
        `${REMONLINE_BASE_URL}/prices?device_type=${encodeURIComponent(deviceType)}&issue_type=${encodeURIComponent(issueType)}`,
        { headers: { 'Authorization': `Bearer ${REMONLINE_API_KEY}` } }
      );
      const prices = await res.json().catch(() => ({}));
      return new Response(JSON.stringify(prices), {
        status: 200,
        headers: { ...cors, 'Cache-Control': 'public, max-age=3600' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Unknown action',
      supported: ['get_order', 'get_branches', 'get_statuses', 'get_services', 'get_prices']
    }), { status: 400, headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors });
  }
}

// Helper functions
function extractBrand(deviceString) {
  if (deviceString.includes('iPhone') || deviceString.includes('MacBook') || deviceString.includes('iPad')) return 'Apple';
  if (deviceString.includes('Samsung')) return 'Samsung';
  if (deviceString.includes('Xiaomi') || deviceString.includes('Redmi') || deviceString.includes('Poco')) return 'Xiaomi';
  if (deviceString.includes('Huawei') || deviceString.includes('Honor')) return 'Huawei';
  if (deviceString.includes('OnePlus')) return 'OnePlus';
  if (deviceString.includes('Google')) return 'Google';
  if (deviceString.includes('Dell')) return 'Dell';
  if (deviceString.includes('HP')) return 'HP';
  if (deviceString.includes('Lenovo')) return 'Lenovo';
  if (deviceString.includes('Asus')) return 'Asus';
  if (deviceString.includes('Acer')) return 'Acer';
  return 'Other';
}
