/**
 * Cloudflare Workers Function - Booking Form Handler
 * 
 * POST /api/booking - Обработка формы бронирования
 * Отправка в Remonline + Email уведомление
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON in request body'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Улучшенная валидация
    const errors = [];
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('Numele este obligatoriu (min. 2 caractere)');
    }
    if (!body.phone || typeof body.phone !== 'string') {
      errors.push('Telefonul este obligatoriu');
    } else {
      const cleanedPhone = body.phone.replace(/\D/g, '');
      if (cleanedPhone.length < 10) {
        errors.push('Telefonul trebuie să conțină cel puțin 10 cifre');
      }
    }
    
    if (errors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: errors.join('. '),
        errors: errors
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Простая защита от спама
    const honeypot = body._honeypot;
    if (honeypot) {
      // Если honeypot заполнен - это бот
      return new Response(JSON.stringify({
        success: true,
        message: 'Cerere primită' // Боту отвечаем успехом
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Создаем заказ
    const orderData = {
      timestamp: new Date().toISOString(),
      client: {
        name: body.name,
        phone: body.phone
      },
      device: body.device || 'Nu specificat',
      problem: body.problem || 'Nu specificat',
      source: 'website_booking_form',
      status: 'new'
    };
    
    // Если Remonline включен - отправляем туда
    if (env.REMONLINE_API_KEY) {
      try {
        const remonlineResponse = await fetch(`${env.REMONLINE_BASE_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.REMONLINE_API_KEY}`
          },
          body: JSON.stringify({
            branch_id: env.REMONLINE_BRANCH_ID,
            client: orderData.client,
            device: { type: orderData.device },
            problem: orderData.problem,
            source: 'website'
          })
        });
        
        if (remonlineResponse.ok) {
          const result = await remonlineResponse.json();
          orderData.remonline_id = result.id;
        }
      } catch (e) {
        console.error('Remonline error:', e);
      }
    }
    
    // Отправляем email уведомление (если настроен)
    if (env.EMAIL_API_KEY) {
      try {
        await fetch('https://api.mailgun.net/v3/nexxgsm.com/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa('api:' + env.EMAIL_API_KEY)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            from: 'NEXX Service <noreply@nexxgsm.com>',
            to: 'info@nexx.ro',
            subject: `Comandă nouă: ${body.device}`,
            text: `
Comandă nouă de pe site:

Client: ${body.name}
Telefon: ${body.phone}
Dispozitiv: ${body.device}
Problemă: ${body.problem}

Data: ${new Date().toLocaleString('ro-RO')}
            `
          })
        });
      } catch (e) {
        console.error('Email error:', e);
      }
    }
    
    // Отправляем в Telegram (если настроен)
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      try {
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: `🔔 *Comandă nouă NEXX GSM*\n\n👤 Client: ${body.name}\n📱 Telefon: ${body.phone}\n📲 Dispozitiv: ${body.device}\n⚠️ Problemă: ${body.problem}`,
            parse_mode: 'Markdown'
          })
        });
      } catch (e) {
        console.error('Telegram error:', e);
      }
    }
    
    // Успешный ответ
    return new Response(JSON.stringify({
      success: true,
      message: 'Mulțumim! Te vom suna în curând.',
      order_id: orderData.remonline_id || null
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Eroare la procesarea cererii'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
