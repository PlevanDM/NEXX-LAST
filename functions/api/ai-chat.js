/**
 * Cloudflare Pages Function - AI Chat Handler
 * Uses Cloudflare AI Gateway with Llama 3.1 8B Instruct
 * 
 * POST /api/ai-chat - Chat with AI assistant
 */

export default {
  async fetch(request, env) {
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
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    try {
      const body = await request.json();
      const { prompt, messages, gatewayId, max_tokens = 512, temperature = 0.7 } = body;

      // Support both prompt (simple) and messages (chat) formats
      let aiOptions;
      
      if (messages && Array.isArray(messages)) {
        // Chat style input with messages
        aiOptions = {
          messages: messages,
          max_tokens: max_tokens,
          temperature: temperature,
        };
      } else if (prompt && typeof prompt === 'string') {
        // Simple completion style input with prompt
        aiOptions = {
          prompt: prompt,
          max_tokens: max_tokens,
          temperature: temperature,
        };
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Either "prompt" (string) or "messages" (array) is required' 
          }),
          { status: 400, headers: corsHeaders }
        );
      }

      const gatewayOptions = gatewayId ? {
        gateway: {
          id: gatewayId
        }
      } : undefined;

      const response = await env.AI.run(
        '@cf/meta/llama-3.1-8b-instruct',
        aiOptions,
        gatewayOptions
      );

      // Extract response text (handle both formats)
      const responseText = response?.response || response || 'No response generated';

      return new Response(
        JSON.stringify({
          success: true,
          response: responseText,
          model: '@cf/meta/llama-3.1-8b-instruct',
          format: messages ? 'messages' : 'prompt',
          usage: response?.usage || null
        }),
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('AI Chat error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || 'AI service error'
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
