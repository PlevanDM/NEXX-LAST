/**
 * API endpoint for dynamic price estimation
 * Fetches real-time prices from external sources and calculates estimates
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { brand, deviceType, model, issue } = body;
    
    if (!brand || !deviceType || !issue) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: brand, deviceType, issue' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Base price calculation
    let basePrice = 0;
    let priceRange = { min: 0, max: 0, avg: 0 };
    
    // Try to fetch from Remonline API if available
    if (env.REMONLINE_API_KEY && env.REMONLINE_BASE_URL) {
      try {
        const remonlineResponse = await fetch(
          `${env.REMONLINE_BASE_URL}/api/v1/parts/search?query=${encodeURIComponent(model || brand)}`,
          {
            headers: {
              'Authorization': `Bearer ${env.REMONLINE_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (remonlineResponse.ok) {
          const partsData = await remonlineResponse.json();
          // Use Remonline prices if available
          if (partsData && partsData.length > 0) {
            const relevantPart = partsData.find(p => 
              p.name?.toLowerCase().includes(issue.toLowerCase()) ||
              p.category?.toLowerCase().includes(issue.toLowerCase())
            );
            if (relevantPart && relevantPart.price) {
              basePrice = relevantPart.price;
            }
          }
        }
      } catch (e) {
        console.warn('Remonline API unavailable, using fallback:', e);
      }
    }
    
    // Fallback: Calculate based on rules
    if (!basePrice || basePrice === 0) {
      // Issue type multipliers
      const issueMultipliers = {
        'screen': { phone: 150, tablet: 250, laptop: 450 },
        'battery': { phone: 90, tablet: 120, laptop: 250 },
        'charging': { phone: 70, tablet: 90, laptop: 120 },
        'camera': { phone: 140, tablet: 150 },
        'motherboard': { phone: 350, tablet: 400, laptop: 600 }
      };
      
      const multiplier = issueMultipliers[issue]?.[deviceType] || 100;
      
      // Brand multipliers
      const brandMultipliers = {
        'apple': 1.2,
        'samsung': 1.1,
        'xiaomi': 0.9,
        'huawei': 1.0
      };
      
      const brandMultiplier = brandMultipliers[brand.toLowerCase()] || 1.0;
      
      basePrice = multiplier * brandMultiplier;
    }
    
    // Calculate range (±20%)
    priceRange = {
      min: Math.round(basePrice * 0.8),
      max: Math.round(basePrice * 1.2),
      avg: Math.round(basePrice)
    };
    
    return new Response(JSON.stringify({
      success: true,
      price: priceRange,
      source: basePrice > 0 ? 'calculated' : 'estimated',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('Price estimation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
