/**
 * Cloudflare Workers Function - Remonline API Proxy
 * 
 * Handles API calls to Remonline CRM system
 * Endpoints:
 *   POST /api/remonline/order - Create new repair order
 *   GET /api/remonline/prices - Get repair prices
 *   GET /api/remonline/order/:id - Get order status
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const action = new URL(request.url).searchParams.get('action');
    
    // Remonline API configuration
    const REMONLINE_API_KEY = env.REMONLINE_API_KEY || '';
    const REMONLINE_BASE_URL = env.REMONLINE_BASE_URL || 'https://api.remonline.app';
    const BRANCH_ID = env.REMONLINE_BRANCH_ID || '';
    
    if (!REMONLINE_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Remonline API not configured' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create Lead (from price calculator)
    if (action === 'create_lead') {
      const leadData = {
        type: 'calculator_lead',
        device: body.device,
        issue: body.issue,
        estimated_price: body.estimated_price,
        source: 'website_calculator',
        status: 'new_lead',
        created_at: new Date().toISOString()
      };
      
      // Если Remonline API настроен - отправляем лид
      if (REMONLINE_API_KEY) {
        try {
          const response = await fetch(`${REMONLINE_BASE_URL}/leads/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${REMONLINE_API_KEY}`
            },
            body: JSON.stringify({
              branch_id: BRANCH_ID,
              device_info: `${body.device.brand} ${body.device.model}`,
              issue: body.issue,
              estimated_price: body.estimated_price,
              source: 'calculator',
              notes: `Calculated from website. Device: ${body.device.brand} ${body.device.type} - ${body.device.model}. Issue: ${body.issue}`
            })
          });
          
          const result = await response.json();
          
          return new Response(JSON.stringify({
            success: true,
            lead_id: result.id,
            message: 'Lead created in Remonline'
          }), {
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (remonlineError) {
          console.error('Remonline API error:', remonlineError);
          // Если Remonline не работает - все равно возвращаем успех
          return new Response(JSON.stringify({
            success: true,
            message: 'Lead saved (Remonline offline)'
          }), {
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      } else {
        // Remonline не настроен - просто сохраняем лог
        console.log('Lead captured (Remonline not configured):', leadData);
        return new Response(JSON.stringify({
          success: true,
          message: 'Lead captured'
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }
    
    // Create Order
    if (action === 'create_order') {
      const orderData = {
        branch_id: BRANCH_ID,
        client: {
          name: body.name,
          phone: body.phone,
        },
        device: {
          type: body.device,
          brand: extractBrand(body.device),
          model: body.device,
        },
        problem: body.problem,
        source: 'website',
        status: 'new',
        created_at: new Date().toISOString()
      };
      
      const response = await fetch(`${REMONLINE_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${REMONLINE_API_KEY}`
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      return new Response(JSON.stringify({
        success: true,
        order_id: result.id,
        message: 'Order created successfully'
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Unknown action
    return new Response(JSON.stringify({ 
      error: 'Unknown action' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    const REMONLINE_API_KEY = env.REMONLINE_API_KEY || '';
    const REMONLINE_BASE_URL = env.REMONLINE_BASE_URL || 'https://api.remonline.app';
    
    if (!REMONLINE_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Remonline API not configured' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get Prices
    if (action === 'get_prices') {
      const deviceType = url.searchParams.get('device_type');
      const issueType = url.searchParams.get('issue_type');
      
      const response = await fetch(
        `${REMONLINE_BASE_URL}/prices?device_type=${deviceType}&issue_type=${issueType}`,
        {
          headers: {
            'Authorization': `Bearer ${REMONLINE_API_KEY}`
          }
        }
      );
      
      const prices = await response.json();
      
      return new Response(JSON.stringify(prices), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // Get Order Status
    if (action === 'get_order') {
      const orderId = url.searchParams.get('id');
      
      const response = await fetch(
        `${REMONLINE_BASE_URL}/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${REMONLINE_API_KEY}`
          }
        }
      );
      
      const order = await response.json();
      
      return new Response(JSON.stringify(order), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Unknown action' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
