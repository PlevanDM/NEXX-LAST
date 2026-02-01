/**
 * Cloudflare Pages Function - AI Assistant for NEXX Service
 * Provides AI-powered customer support and repair information
 * 
 * POST /api/ai-assistant - Get AI assistance for repair questions
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

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
      const { question, device, problem, language = 'ro' } = body;

      if (!question || typeof question !== 'string') {
        return new Response(
          JSON.stringify({ success: false, error: 'Question is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Build context-aware prompt for NEXX service
      const langMap = {
        'ro': 'română',
        'uk': 'ucraineană',
        'en': 'engleză',
        'ru': 'rusă'
      };
      
      const langName = langMap[language] || 'română';

      const systemPrompt = `Ești asistentul virtual al NEXX GSM, un service de reparații pentru telefoane, laptopuri și tablete în România.
Răspunde întotdeauna în ${langName}.
Fii prietenos, profesional și oferă informații utile despre reparații.
${device ? `Dispozitivul clientului: ${device}` : ''}
${problem ? `Problema: ${problem}` : ''}`;

      // Use Cloudflare AI with Llama 3.1
      // Note: Some models support messages format, others use prompt
      let aiResponse;
      try {
        // Try messages format first (if supported)
        aiResponse = await env.AI.run(
          '@cf/meta/llama-3.1-8b-instruct',
          {
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: question
              }
            ],
            max_tokens: 512,
            temperature: 0.7,
          }
        );
      } catch (e) {
        // Fallback to prompt format
        const fullPrompt = `${systemPrompt}\n\nÎntrebare client: ${question}\n\nRăspuns:`;
        aiResponse = await env.AI.run(
          '@cf/meta/llama-3.1-8b-instruct',
          {
            prompt: fullPrompt,
            max_tokens: 512,
            temperature: 0.7,
          }
        );
      }

      // Extract response text
      const answer = aiResponse.response || aiResponse || 'Nu pot răspunde la această întrebare momentan.';

      return new Response(
        JSON.stringify({
          success: true,
          answer: answer,
          model: '@cf/meta/llama-3.1-8b-instruct',
          language: language
        }),
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('AI Assistant error:', error);
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
