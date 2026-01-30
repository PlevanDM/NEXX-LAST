/**
 * Cloudflare Pages Function - AI Test Endpoint
 * Demonstrates both prompt and messages formats
 * 
 * GET /api/ai-test - Test AI with both formats
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    try {
      const tasks = [];

      // Prompt - simple completion style input
      let simple = {
        prompt: 'Tell me a joke about Cloudflare'
      };
      let response = await env.AI.run('@cf/meta/llama-3-8b-instruct', simple);
      tasks.push({ 
        format: 'prompt',
        inputs: simple, 
        response: response?.response || response,
        usage: response?.usage || null
      });

      // Messages - chat style input
      let chat = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Who won the world series in 2020?' }
        ]
      };
      response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);
      tasks.push({ 
        format: 'messages',
        inputs: chat, 
        response: response?.response || response,
        usage: response?.usage || null
      });

      return new Response(
        JSON.stringify({
          success: true,
          model: '@cf/meta/llama-3-8b-instruct',
          tests: tasks
        }),
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('AI Test error:', error);
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
