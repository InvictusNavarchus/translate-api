# Translation API - Complete Usage Guide

## Quick Start

### 1. Basic Translation
```bash
curl -X POST "https://your-api-endpoint.deno.dev" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "from": "en",
    "to": "es"
  }'
```

**Response:**
```json
{
  "code": 200,
  "status": "Success",
  "data": {
    "translatedText": "¡Hola, mundo!",
    "sourceLanguage": "en",
    "targetLanguage": "es",
    "originalText": "Hello, world!"
  }
}
```

### 2. Auto-Detect Source Language
```bash
curl -X POST "https://your-api-endpoint.deno.dev" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour le monde!",
    "to": "en"
  }'
```

### 3. Default to English Translation
```bash
curl -X POST "https://your-api-endpoint.deno.dev" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola mundo!"
  }'
```

## JavaScript/TypeScript Usage

```typescript
async function translateText(text: string, from?: string, to?: string) {
  const response = await fetch('https://your-api-endpoint.deno.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, from, to }),
  });
  
  return await response.json();
}

// Usage
const result = await translateText("Hello!", "en", "es");
console.log(result.data.translatedText); // "¡Hola!"
```

## Python Usage

```python
import requests
import json

def translate_text(text, from_lang=None, to_lang="en"):
    url = "https://your-api-endpoint.deno.dev"
    
    payload = {"text": text}
    if from_lang:
        payload["from"] = from_lang
    if to_lang:
        payload["to"] = to_lang
    
    response = requests.post(url, json=payload)
    return response.json()

# Usage
result = translate_text("Hello!", "en", "es")
print(result["data"]["translatedText"])  # ¡Hola!
```

## Common Language Codes

| Code | Language | Code | Language |
|------|----------|------|----------|
| `en` | English | `es` | Spanish |
| `fr` | French | `de` | German |
| `it` | Italian | `pt` | Portuguese |
| `ru` | Russian | `ja` | Japanese |
| `ko` | Korean | `zh` | Chinese |
| `ar` | Arabic | `hi` | Hindi |
| `th` | Thai | `vi` | Vietnamese |
| `tr` | Turkish | `pl` | Polish |
| `nl` | Dutch | `sv` | Swedish |

## Error Handling

### 400 Bad Request
```json
{
  "error": "Missing or invalid 'text' parameter",
  "code": 400
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed. Use POST.",
  "code": 405
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": 500,
  "details": "Error description"
}
```

## Rate Limiting

Currently, there are no built-in rate limits, but it's recommended to:
- Implement client-side throttling
- Cache translations when possible
- Batch requests when translating multiple texts

## Best Practices

1. **Cache Results**: Cache translations to avoid redundant API calls
2. **Handle Errors**: Always implement proper error handling
3. **Validate Input**: Validate text content before sending requests
4. **Use Appropriate Timeouts**: Set reasonable timeout values for requests
5. **Batch Processing**: For multiple translations, consider batching

## Integration Examples

### React Component
```jsx
import { useState } from 'react';

function TranslationComponent() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://your-api-endpoint.deno.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, to: 'es' }),
      });
      
      const result = await response.json();
      setTranslation(result.data.translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text to translate"
      />
      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
      {translation && <p>Translation: {translation}</p>}
    </div>
  );
}
```

### Node.js Express Integration
```javascript
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/translate', async (req, res) => {
  try {
    const { text, from, to } = req.body;
    
    const response = await fetch('https://your-api-endpoint.deno.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, from, to }),
    });
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Translation service unavailable' });
  }
});

app.listen(3000);
```

## Testing

Run the included test suite:
```bash
# Start the API server
deno run --allow-net --allow-env main.ts

# In another terminal, run tests
deno run --allow-net test.ts
```

## Monitoring and Debugging

### Enable Debug Logging
Add environment variable:
```bash
DEBUG=true deno run --allow-net --allow-env main.ts
```

### Health Check Endpoint
The API automatically handles CORS preflight requests, which can serve as a basic health check:
```bash
curl -X OPTIONS "https://your-api-endpoint.deno.dev"
```

## Support

For issues, feature requests, or questions:
1. Check the README.md for common solutions
2. Review the error messages carefully
3. Test with the provided examples
4. Submit issues with detailed reproduction steps
