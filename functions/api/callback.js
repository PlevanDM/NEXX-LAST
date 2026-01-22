/**
 * Cloudflare Pages Function - Callback Request Handler
 * Creates lead/order in Remonline CRM + Vapi AI Voice Call
 * Uses NEXX GSM database for accurate pricing
 */

// NEXX GSM Price Database (Romania - RON/lei)
const PRICE_DB = {
  iPhone: {
    '16 Pro Max': { display: '1799-2999', battery: '599-899', charging: '799', camera: '1649', board: '1799' },
    '16 Pro': { display: '1699-2750', battery: '599-899', charging: '799', camera: '1649', board: '1799' },
    '16 Plus': { display: '1500-2550', battery: '599-899', charging: '799', camera: '1199', board: '1699' },
    '16': { display: '1500-2250', battery: '599-899', charging: '799', camera: '1199', board: '1699' },
    '15 Pro Max': { display: '1500-2800', battery: '499-799', charging: '599', camera: '999', board: '1499' },
    '15 Pro': { display: '1500-2500', battery: '499-799', charging: '599', camera: '999', board: '1499' },
    '15 Plus': { display: '1300-2300', battery: '499-799', charging: '599', camera: '849', board: '1399' },
    '15': { display: '1300-2000', battery: '499-799', charging: '599', camera: '849', board: '1399' },
    '14 Pro Max': { display: '1195-2600', battery: '449-699', charging: '499', camera: '749', board: '999' },
    '14 Pro': { display: '1145-2450', battery: '449-699', charging: '499', camera: '699', board: '999' },
    '14 Plus': { display: '995-2400', battery: '449-699', charging: '499', camera: '649', board: '999' },
    '14': { display: '995-1800', battery: '449-699', charging: '499', camera: '649', board: '999' },
    '13 Pro Max': { display: '995-2400', battery: '449-649', charging: '449', camera: '549', board: '899' },
    '13 Pro': { display: '945-2100', battery: '449-649', charging: '449', camera: '499', board: '899' },
    '13': { display: '895-1650', battery: '449-649', charging: '449', camera: '449', board: '899' },
    '13 mini': { display: '845-1650', battery: '449-649', charging: '449', camera: '399', board: '899' },
    '12 Pro Max': { display: '895-1800', battery: '399-599', charging: '399', camera: '449', board: '799' },
    '12 Pro': { display: '845-1600', battery: '399-599', charging: '399', camera: '399', board: '799' },
    '12': { display: '695-1300', battery: '399-599', charging: '399', camera: '349', board: '799' },
    '12 mini': { display: '645-1200', battery: '399-599', charging: '399', camera: '349', board: '799' },
    '11 Pro Max': { display: '745-1450', battery: '349-549', charging: '349', camera: '399', board: '699' },
    '11 Pro': { display: '695-1250', battery: '349-549', charging: '349', camera: '349', board: '699' },
    '11': { display: '545-999', battery: '349-549', charging: '349', camera: '299', board: '699' },
    'SE': { display: '395-699', battery: '299-449', charging: '299', camera: '249', board: '599' }
  },
  MacBook: {
    'Air M4': { display: '3749', battery: '999-1400', keyboard: '999', board: '1499', liquid: '999' },
    'Air M3 15': { display: '2999-3499', battery: '999-1400', keyboard: '949', board: '1499', liquid: '999' },
    'Air M3 13': { display: '2999-3499', battery: '999-1400', keyboard: '849', board: '1499', liquid: '999' },
    'Air M2 15': { display: '2599-3499', battery: '999-1400', keyboard: '849', board: '1499', liquid: '999' },
    'Air M2 13': { display: '2499-3299', battery: '949-1200', keyboard: '849', board: '1499', liquid: '749' },
    'Air M1': { display: '2299-2999', battery: '849-1100', keyboard: '749', board: '1299', liquid: '749' },
    'Pro 16 M3': { display: '3999-5499', battery: '1199-1600', keyboard: '1199', board: '1999', liquid: '1199' },
    'Pro 14 M3': { display: '3499-4999', battery: '1099-1400', keyboard: '999', board: '1799', liquid: '999' },
    'Pro 16 M2': { display: '3499-4999', battery: '1099-1500', keyboard: '1099', board: '1799', liquid: '999' },
    'Pro 14 M2': { display: '2999-4499', battery: '999-1300', keyboard: '949', board: '1699', liquid: '899' },
    'Pro M1': { display: '2499-3999', battery: '899-1200', keyboard: '849', board: '1499', liquid: '799' }
  },
  iPad: {
    'Pro 13 M4': { display: '2999', battery: '899', charging: '699', board: '1499' },
    'Pro 11 M4': { display: '2499', battery: '799', charging: '599', board: '1299' },
    'Air M2': { display: '1799', battery: '699', charging: '499', board: '999' },
    'Pro 12.9': { display: '1999-2499', battery: '799-999', charging: '599', board: '1199' },
    'Pro 11': { display: '1499-1999', battery: '699-899', charging: '499', board: '999' },
    'Air': { display: '999-1499', battery: '599-799', charging: '449', board: '899' },
    'mini': { display: '799-1299', battery: '549-749', charging: '399', board: '799' },
    '10.9': { display: '699-999', battery: '499-649', charging: '349', board: '699' }
  },
  Samsung: {
    'S24 Ultra': { display: '1499-2499', battery: '499-699', charging: '399', camera: '599', board: '999' },
    'S24+': { display: '1199-1999', battery: '449-649', charging: '349', camera: '499', board: '899' },
    'S24': { display: '999-1699', battery: '399-599', charging: '299', camera: '449', board: '799' },
    'S23 Ultra': { display: '1299-2199', battery: '449-649', charging: '349', camera: '549', board: '899' },
    'S23+': { display: '999-1799', battery: '399-599', charging: '299', camera: '449', board: '799' },
    'S23': { display: '799-1499', battery: '349-549', charging: '249', camera: '399', board: '699' },
    'Z Fold 5': { display: '2499-3999', battery: '599-899', charging: '449', board: '1299' },
    'Z Flip 5': { display: '1499-2499', battery: '499-749', charging: '399', board: '999' }
  }
};

// Get price estimate for device and problem
function getPriceEstimate(device, problem) {
  if (!device) return null;
  const d = device.toLowerCase();
  
  // Detect device category and model
  let category = null;
  let model = null;
  
  // iPhone detection
  if (d.includes('iphone')) {
    category = 'iPhone';
    if (d.includes('16 pro max')) model = '16 Pro Max';
    else if (d.includes('16 pro')) model = '16 Pro';
    else if (d.includes('16 plus')) model = '16 Plus';
    else if (d.includes('16')) model = '16';
    else if (d.includes('15 pro max')) model = '15 Pro Max';
    else if (d.includes('15 pro')) model = '15 Pro';
    else if (d.includes('15 plus')) model = '15 Plus';
    else if (d.includes('15')) model = '15';
    else if (d.includes('14 pro max')) model = '14 Pro Max';
    else if (d.includes('14 pro')) model = '14 Pro';
    else if (d.includes('14 plus')) model = '14 Plus';
    else if (d.includes('14')) model = '14';
    else if (d.includes('13 pro max')) model = '13 Pro Max';
    else if (d.includes('13 pro')) model = '13 Pro';
    else if (d.includes('13 mini')) model = '13 mini';
    else if (d.includes('13')) model = '13';
    else if (d.includes('12 pro max')) model = '12 Pro Max';
    else if (d.includes('12 pro')) model = '12 Pro';
    else if (d.includes('12 mini')) model = '12 mini';
    else if (d.includes('12')) model = '12';
    else if (d.includes('11 pro max')) model = '11 Pro Max';
    else if (d.includes('11 pro')) model = '11 Pro';
    else if (d.includes('11')) model = '11';
    else if (d.includes('se')) model = 'SE';
  }
  // MacBook detection  
  else if (d.includes('macbook')) {
    category = 'MacBook';
    if (d.includes('air') && d.includes('m4')) model = 'Air M4';
    else if (d.includes('air') && d.includes('m3') && d.includes('15')) model = 'Air M3 15';
    else if (d.includes('air') && d.includes('m3')) model = 'Air M3 13';
    else if (d.includes('air') && d.includes('m2') && d.includes('15')) model = 'Air M2 15';
    else if (d.includes('air') && d.includes('m2')) model = 'Air M2 13';
    else if (d.includes('air') && d.includes('m1')) model = 'Air M1';
    else if (d.includes('pro') && d.includes('16') && d.includes('m3')) model = 'Pro 16 M3';
    else if (d.includes('pro') && d.includes('14') && d.includes('m3')) model = 'Pro 14 M3';
    else if (d.includes('pro') && d.includes('16') && d.includes('m2')) model = 'Pro 16 M2';
    else if (d.includes('pro') && d.includes('14') && d.includes('m2')) model = 'Pro 14 M2';
    else if (d.includes('pro') && d.includes('m1')) model = 'Pro M1';
    else if (d.includes('air')) model = 'Air M1';
    else if (d.includes('pro')) model = 'Pro M1';
  }
  // iPad detection
  else if (d.includes('ipad')) {
    category = 'iPad';
    if (d.includes('pro') && d.includes('13') && d.includes('m4')) model = 'Pro 13 M4';
    else if (d.includes('pro') && d.includes('11') && d.includes('m4')) model = 'Pro 11 M4';
    else if (d.includes('air') && d.includes('m2')) model = 'Air M2';
    else if (d.includes('pro') && d.includes('12.9')) model = 'Pro 12.9';
    else if (d.includes('pro') && d.includes('11')) model = 'Pro 11';
    else if (d.includes('air')) model = 'Air';
    else if (d.includes('mini')) model = 'mini';
    else model = '10.9';
  }
  // Samsung detection
  else if (d.includes('samsung') || d.includes('galaxy')) {
    category = 'Samsung';
    if (d.includes('s24 ultra')) model = 'S24 Ultra';
    else if (d.includes('s24+') || d.includes('s24 plus')) model = 'S24+';
    else if (d.includes('s24')) model = 'S24';
    else if (d.includes('s23 ultra')) model = 'S23 Ultra';
    else if (d.includes('s23+') || d.includes('s23 plus')) model = 'S23+';
    else if (d.includes('s23')) model = 'S23';
    else if (d.includes('fold') && d.includes('5')) model = 'Z Fold 5';
    else if (d.includes('flip') && d.includes('5')) model = 'Z Flip 5';
  }
  
  if (!category || !model || !PRICE_DB[category]?.[model]) {
    return null;
  }
  
  const prices = PRICE_DB[category][model];
  const p = problem?.toLowerCase() || '';
  
  // Detect repair type from problem
  if (p.includes('ecran') || p.includes('display') || p.includes('spart') || p.includes('crapat')) {
    return { type: 'Display', price: prices.display };
  }
  if (p.includes('baterie') || p.includes('battery') || p.includes('descarc') || p.includes('incarc')) {
    return { type: 'Baterie', price: prices.battery };
  }
  if (p.includes('port') || p.includes('mufa') || p.includes('charging') || p.includes('nu se incarca')) {
    return { type: 'Port încărcare', price: prices.charging };
  }
  if (p.includes('camer') || p.includes('foto') || p.includes('video')) {
    return { type: 'Cameră', price: prices.camera };
  }
  if (p.includes('placa') || p.includes('board') || p.includes('nu porneste') || p.includes('nu functioneaza')) {
    return { type: 'Reparație placă', price: prices.board };
  }
  if (p.includes('apa') || p.includes('lichid') || p.includes('water') || p.includes('udat')) {
    return { type: 'Deteriorare lichid', price: prices.liquid || prices.board };
  }
  if (p.includes('tastatura') || p.includes('keyboard')) {
    return { type: 'Tastatură', price: prices.keyboard };
  }
  
  // Default to display if can't determine
  return { type: 'Consultație', price: 'GRATUIT pentru comenzi online' };
}

export async function onRequest(context) {
  const { request } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), 
      { status: 405, headers: corsHeaders });
  }
  
  try {
    // Parse body
    const body = await request.json();
    const { phone, name, device, problem } = body;
    
    // Validate phone
    if (!phone || phone.length < 9) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Număr de telefon invalid' 
      }), { status: 400, headers: corsHeaders });
    }
    
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    // Format phone for international calls
    let internationalPhone = cleanPhone;
    if (cleanPhone.startsWith('07')) {
      internationalPhone = '+40' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('+')) {
      internationalPhone = '+40' + cleanPhone;
    }
    
    // Get price estimate from database
    const priceEstimate = getPriceEstimate(device, problem);
    
    // Remonline integration
    const REMONLINE_API_KEY = '55f93eacf65e94ef55e6fed9fd41f8c4';
    const REMONLINE_BASE = 'https://api.remonline.app';
    const BRANCH_ID = 218970;
    const ORDER_TYPE = 334611;
    
    // Vapi AI Voice Agent
    const VAPI_API_KEY = 'ae7cb2c0-9b24-48cf-9115-fb15f5042d73';
    const VAPI_PHONE_ID = 'a6714bf1-21e8-44df-921a-6a5235e72f0b';
    const VAPI_ASSISTANT_ID = '96cd370d-806f-4cbe-993e-381a5df85d46';
    
    let orderId = null;
    let remonlineSuccess = false;
    let vapiCallId = null;
    
    try {
      // Get Remonline token
      const tokenRes = await fetch(`${REMONLINE_BASE}/token/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `api_key=${REMONLINE_API_KEY}`
      });
      const tokenJson = await tokenRes.json();
      
      if (tokenJson.success && tokenJson.token) {
        const token = tokenJson.token;
        
        // Create client
        const clientRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || 'Client Website',
            phone: [cleanPhone]
          })
        });
        const clientJson = await clientRes.json();
        
        let clientId = clientJson.data?.id;
        
        // If client exists, search for it
        if (!clientId) {
          const searchRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}&phones[]=${encodeURIComponent(cleanPhone)}`);
          const searchJson = await searchRes.json();
          if (searchJson.data?.length > 0) {
            clientId = searchJson.data[0].id;
          }
        }
        
        if (clientId) {
          // Create order with bonus tag and price estimate
          const now = new Date().toISOString();
          const priceNote = priceEstimate 
            ? `\n💰 Estimare: ${priceEstimate.type} - ${priceEstimate.price} lei` 
            : '';
          
          const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              branch_id: BRANCH_ID,
              order_type: ORDER_TYPE,
              client_id: clientId,
              kindof_good: device?.toLowerCase().includes('macbook') ? 'Laptop' : 'Telefon',
              brand: getBrand(device),
              model: device || '',
              malfunction: problem || 'Callback de pe website',
              manager_notes: `🌐 CALLBACK WEBSITE\n🎁 BONUS: DIAGNOSTIC GRATUIT!\n📱 ${device || 'N/A'}\n📞 ${cleanPhone}\n❓ ${problem || 'N/A'}${priceNote}\n⏰ ${now}\n✅ Comandă online - diagnostic gratuit inclus`
            })
          });
          const orderJson = await orderRes.json();
          
          if (orderJson.success && orderJson.data) {
            orderId = orderJson.data.id;
            remonlineSuccess = true;
          }
        }
      }
    } catch (e) {
      console.error('Remonline error:', e.message);
    }
    
    // Build dynamic price context for AI
    const priceContext = priceEstimate 
      ? `\n\nESTIMARE PREȚ pentru ${device}:\n- Tip reparație: ${priceEstimate.type}\n- Preț estimat: ${priceEstimate.price} lei\n- Notă: Prețul final se stabilește după diagnostic. Diagnosticul este GRATUIT!`
      : '';
    
    // Vapi AI Voice Call - Call customer back with AI
    try {
      const vapiRes = await fetch('https://api.vapi.ai/call/phone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistantId: VAPI_ASSISTANT_ID,
          phoneNumberId: VAPI_PHONE_ID,
          customer: {
            number: internationalPhone,
            name: name || 'Client'
          },
          assistantOverrides: {
            variableValues: {
              customerName: name || 'domnule/doamnă',
              device: device || 'dispozitiv',
              problem: problem || 'problemă necunoscută',
              orderId: orderId || 'în procesare',
              priceEstimate: priceEstimate ? `${priceEstimate.type}: ${priceEstimate.price} lei` : 'se va stabili la diagnostic'
            },
            firstMessage: `Bună ziua${name ? ', ' + name : ''}! Sunt asistentul virtual NEXX GSM. Ați lăsat o cerere pe site-ul nostru pentru ${device || 'reparație'}. ${problem ? 'Am înțeles că aveți problema: ' + problem + '.' : ''} ${priceEstimate ? `Am o estimare de preț pentru dumneavoastră: ${priceEstimate.type} - ${priceEstimate.price} lei.` : ''} Vă sun să confirmăm detaliile. Când vă este convenabil să treceți la service?`,
            model: {
              messages: [
                {
                  role: 'system',
                  content: `Ești asistentul vocal AI pentru NEXX GSM - service de reparații telefoane și laptopuri în București.

INFORMAȚII DESPRE CLIENT:
- Nume: ${name || 'Necunoscut'}
- Telefon: ${cleanPhone}
- Dispozitiv: ${device || 'Necunoscut'}
- Problemă: ${problem || 'Necunoscută'}
- ID Comandă: ${orderId || 'În procesare'}${priceContext}

OBIECTIVE:
1. Confirmă detaliile comenzii
2. Dacă ai estimare de preț, menționeaz-o și explică că prețul final se stabilește după diagnostic
3. Întreabă când poate veni la service
4. Menționează bonusul: DIAGNOSTIC GRATUIT pentru comenzile online
5. Dă adresa: NEXX GSM, București (confirma locația exactă cu ei)
6. Menționează programul: Luni-Vineri 10:00-19:00, Sâmbătă 10:00-15:00

BAZA DE PREȚURI NEXX GSM (lei):
📱 iPhone:
- Display iPhone 16 Pro Max: 1799-2999 lei
- Display iPhone 15 Pro: 1500-2500 lei
- Display iPhone 14: 995-1800 lei
- Display iPhone 13: 895-1650 lei
- Display iPhone 12: 695-1300 lei
- Baterie iPhone (toate): 399-899 lei
- Port încărcare iPhone: 349-799 lei

💻 MacBook:
- Display MacBook Air: 2299-3749 lei
- Display MacBook Pro: 2499-5499 lei
- Baterie MacBook: 849-1600 lei
- Tastatură MacBook: 749-1199 lei
- Reparație placă: 1299-1999 lei

📱 Samsung:
- Display S24 Ultra: 1499-2499 lei
- Display S23 Ultra: 1299-2199 lei
- Baterie Samsung: 349-699 lei

📱 iPad:
- Display iPad Pro: 1499-2999 lei
- Display iPad Air: 999-1799 lei
- Baterie iPad: 499-999 lei

STIL:
- Vorbește în română, prietenos și profesional
- Răspunsuri scurte și clare (max 2-3 propoziții)
- Confirmă mereu ce spune clientul
- Dacă nu înțelegi, cere să repete politicos
- Folosește „dumneavoastră" nu „tu"

REGULI IMPORTANTE:
- Diagnosticul este MEREU GRATUIT pentru comenzile online!
- Prețul final se stabilește doar după diagnostic fizic
- Nu promite prețuri exacte, doar intervale orientative
- Dacă clientul întreabă de un dispozitiv care nu e în listă, spune că trebuie verificat la service

La final, mulțumește și confirmă că un specialist va contacta pentru programare exactă.`
                }
              ]
            }
          }
        })
      });
      
      if (vapiRes.ok) {
        const vapiJson = await vapiRes.json();
        vapiCallId = vapiJson.id;
        console.log('Vapi call initiated:', vapiCallId);
      } else {
        const errorText = await vapiRes.text();
        console.error('Vapi error:', errorText);
      }
    } catch (e) {
      console.error('Vapi call error:', e.message);
    }
    
    // Always return success to user
    return new Response(JSON.stringify({
      success: true,
      order_id: orderId,
      call_id: vapiCallId,
      price_estimate: priceEstimate,
      message: remonlineSuccess 
        ? 'Mulțumim! AI-ul nostru vă va suna în câteva secunde!' 
        : 'Cererea a fost primită! Vă contactăm în curând.'
    }), { status: 200, headers: corsHeaders });
    
  } catch (error) {
    console.error('Callback error:', error.message);
    return new Response(JSON.stringify({
      success: false,
      error: 'Eroare server'
    }), { status: 500, headers: corsHeaders });
  }
}

function getBrand(device) {
  if (!device) return '';
  const d = device.toLowerCase();
  if (d.includes('iphone') || d.includes('macbook') || d.includes('ipad')) return 'Apple';
  if (d.includes('samsung') || d.includes('galaxy')) return 'Samsung';
  if (d.includes('xiaomi') || d.includes('redmi') || d.includes('poco')) return 'Xiaomi';
  if (d.includes('huawei') || d.includes('honor')) return 'Huawei';
  return '';
}
