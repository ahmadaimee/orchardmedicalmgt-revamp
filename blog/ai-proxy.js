// OMM AI Proxy — zero npm dependencies, Node.js built-ins only
// Usage: node ai-proxy.js
// Listens on http://localhost:3002

const http  = require('http');
const https = require('https');

const PORT = 3002;

// Gemini model to use — swap to gemini-1.5-pro if you prefer
const GEMINI_MODEL = 'gemini-2.0-flash';

function sendJSON(res, statusCode, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

const server = http.createServer((req, res) => {

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    });
    res.end();
    return;
  }

  // Only handle POST /generate
  if (req.method !== 'POST' || req.url !== '/generate') {
    sendJSON(res, 404, { error: 'Not found. POST /generate' });
    return;
  }

  // Collect request body
  let rawBody = '';
  req.on('data', chunk => { rawBody += chunk.toString(); });
  req.on('end', () => {

    // Parse incoming JSON
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      sendJSON(res, 400, { error: 'Invalid JSON in request body.' });
      return;
    }

    const { prompt, apiKey, systemPrompt } = payload;

    if (!prompt || !apiKey) {
      sendJSON(res, 400, { error: 'Missing required fields: prompt and apiKey.' });
      return;
    }

    // Build Gemini request body
    const geminiBody = JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt || 'You are a helpful assistant.' }]
      },
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7
      }
    });

    const path = `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(geminiBody)
      }
    };

    const apiReq = https.request(options, apiRes => {
      let responseData = '';
      apiRes.on('data', chunk => { responseData += chunk.toString(); });
      apiRes.on('end', () => {

        // Parse Gemini response
        let parsed;
        try {
          parsed = JSON.parse(responseData);
        } catch (e) {
          sendJSON(res, 500, { error: 'Failed to parse Gemini API response.' });
          return;
        }

        // Check for API-level errors
        if (parsed.error) {
          sendJSON(res, 500, { error: parsed.error.message || JSON.stringify(parsed.error) });
          return;
        }

        // Extract text from Gemini response structure
        try {
          const text = parsed.candidates[0].content.parts[0].text;
          sendJSON(res, 200, { result: text });
        } catch (e) {
          sendJSON(res, 500, { error: 'Unexpected Gemini response structure: ' + JSON.stringify(parsed).slice(0, 200) });
        }
      });
    });

    // Handle network-level errors
    apiReq.on('error', err => {
      sendJSON(res, 500, { error: 'Network error contacting Gemini API: ' + err.message });
    });

    apiReq.write(geminiBody);
    apiReq.end();
  });
});

server.listen(PORT, () => {
  console.log('OMM AI Proxy running on http://localhost:' + PORT + ' — Keep this terminal open while using the AI generator.');
});
