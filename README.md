# Translation API

A robust serverless translation API built with Deno that leverages LLM-powered translation services. This API can automatically detect source languages and translate text between different languages using ISO 639-1 language codes.

## Features

- **Serverless Architecture**: Designed for Deno Deploy serverless functions
- **Auto Language Detection**: Automatically detects the source language if not specified
- **ISO 639-1 Support**: Uses standard 2-letter language codes
- **LLM-Powered Translation**: Leverages advanced language models for high-quality translations
- **CORS Support**: Ready for cross-origin requests
- **Error Handling**: Comprehensive error handling and validation
- **Fast Cold Starts**: Optimized for serverless deployment

## API Endpoint

### POST `/`

Translates text from one language to another.

#### Request Body

```json
{
  "text": "Hello, world!",
  "from": "en",
  "to": "es"
}
```

#### Parameters

- `text` (string, required): The text to translate
- `from` (string, optional): Source language ISO 639-1 code. If not provided, the API will auto-detect the language
- `to` (string, optional): Target language ISO 639-1 code. Defaults to "en" (English)

#### Response

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

#### Error Response

```json
{
  "error": "Error description",
  "code": 400,
  "details": "Additional error details"
}
```

## Supported Language Codes

The API supports all ISO 639-1 language codes, including but not limited to:

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- `ar` - Arabic
- `hi` - Hindi

## Usage Examples

### Basic Translation

```bash
curl -X POST "https://your-api-endpoint.deno.dev/" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "from": "en",
    "to": "fr"
  }'
```

### Auto-detect Source Language

```bash
curl -X POST "https://your-api-endpoint.deno.dev/" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour, comment allez-vous?",
    "to": "en"
  }'
```

### Translate to English (default)

```bash
curl -X POST "https://your-api-endpoint.deno.dev/" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola, ¿cómo estás?"
  }'
```

## Development

### Prerequisites

- Deno installed on your system

### Running Locally

```bash
# Option 1: Single-file version (recommended for deployment testing)
deno run --allow-net --allow-env dev-single.ts

# Option 2: Modular version (for development)
deno task dev
```

The API will be available at `http://localhost:8000`

### Serverless Function

The main `main.ts` file exports a default handler function that's ready for serverless deployment:

```typescript
export default async function handler(req: Request): Promise<Response> {
  // Translation logic here
}
```

## Deployment to Deno Deploy

1. Fork or clone this repository
2. Connect your GitHub repository to Deno Deploy
3. Set the entry point to `main.ts`
4. Deploy

The API will be automatically deployed and available at your Deno Deploy URL.

## Project Structure

```
translate-api/
├── main-single.ts          # 🎯 Single-file serverless handler (recommended for Deno Deploy)
├── main.ts                 # Modular serverless handler 
├── dev-single.ts           # Development server for single-file version
├── dev.ts                  # Development server for modular version
├── services/
│   ├── translator.ts       # Translation service using LLM
│   └── language-detector.ts # Language detection service
├── utils/
│   ├── cors.ts            # CORS utilities
│   └── validation.ts      # Validation utilities
├── deno.json              # Deno configuration
└── README.md              # This file
```

## Deployment Versions

### Single-file Version (Recommended)
- **File**: `main-single.ts`
- **Use case**: Deno Deploy deployment
- **Pros**: No import issues, faster cold starts
- **Cons**: Larger file size

### Modular Version
- **File**: `main.ts` 
- **Use case**: Development and local testing
- **Pros**: Better code organization, easier maintenance
- **Cons**: May have import resolution issues on some serverless platforms

## Error Codes

- `400` - Bad Request (invalid parameters)
- `405` - Method Not Allowed (non-POST requests)
- `500` - Internal Server Error

## Environment Variables

No environment variables are required for basic functionality. The API uses the external Copilot API at `https://api.zpi.my.id/v1/ai/copilot` for translation services.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please open an issue in the GitHub repository.
