# AI Provider Setup Guide

This document explains how the AI provider system works in OpenResearch and how to configure it.

## Overview

OpenResearch now supports multiple AI providers with automatic fallback:

1. **Ollama (Local)** - Primary provider if available
2. **Groq (Cloud)** - Fallback provider

The system automatically detects which provider is available and persists your selection for future sessions.

## Features

- ✅ Automatic provider detection
- ✅ Persistent provider and model selection
- ✅ Automatic fallback between providers
- ✅ UI for manual provider/model selection
- ✅ Real-time status indicators
- ✅ JSONL streaming support for Ollama

## Setup Instructions

### 1. Ollama (Local) Setup

#### Installation

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [ollama.ai](https://ollama.ai)

#### Starting Ollama

```bash
ollama serve
```

#### Downloading Models

```bash
# Download Mistral (recommended)
ollama pull mistral

# Download other models
ollama pull llama2
ollama pull codellama
ollama pull gemma
```

#### Verify Installation

```bash
curl http://localhost:11434/api/tags
```

### 2. Groq (Cloud) Setup

#### Get API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key

#### Configure Environment

Create a `.env` file in the project root:

```bash
VITE_SERPER_API_KEY=your_serper_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

## How It Works

### Provider Priority

1. **Ollama Check**: System first checks if Ollama is running on `http://localhost:11434`
2. **Auto-Selection**: If Ollama is available, it becomes the primary provider
3. **Fallback**: If Ollama is unavailable or fails, system falls back to Groq
4. **Persistence**: Selected provider and model are saved to localStorage

### Provider Selection Flow

```
┌─────────────────────────────┐
│  Check Ollama Availability  │
└──────────┬──────────────────┘
           │
           ├─── Available? ───┐
           │                  │
           v                  v
    ┌──────────┐        ┌──────────┐
    │  Ollama  │        │   Groq   │
    │ (Local)  │        │ (Cloud)  │
    └──────────┘        └──────────┘
           │                  │
           └─── Both fail? ───┤
                             │
                             v
                    ┌─────────────┐
                    │ Show Error  │
                    └─────────────┘
```

### Storage Keys

The system uses localStorage to persist settings:

- `openresearch_ai_provider` - Current provider ('ollama' or 'groq')
- `openresearch_ollama_model` - Selected Ollama model
- `openresearch_groq_model` - Selected Groq model

## Using the UI

### AI Provider Settings Button

Located in the top-left of the header, the AI Provider Settings button shows:

- Current provider name (Ollama/Groq)
- Status indicator:
  - 🟢 Green: Ollama available and selected
  - 🔵 Blue: Groq selected
  - 🔴 Red: Ollama selected but unavailable

### Settings Panel

Click the button to open the settings panel where you can:

1. **Switch Provider**: Click on Ollama or Groq
2. **Select Model**: Use the dropdown to choose from available models
3. **View Status**: See real-time availability status

## Available Models

### Ollama Models

Any model you've downloaded with `ollama pull`. Common models:

- `mistral:latest` (recommended)
- `llama2:latest`
- `llama2:70b`
- `codellama:latest`
- `gemma:7b`

### Groq Models

Pre-configured cloud models:

- `mixtral-8x7b-32768` (recommended)
- `llama2-70b-4096`
- `gemma-7b-it`

## API Reference

### Core Functions

```typescript
// Check if Ollama is available
const isAvailable = await checkOllamaAvailability();

// Fetch available Ollama models
const models = await fetchOllamaModels();

// Get current AI provider and model
const { provider, model } = await getAIProvider();

// Manually set provider and model
setAIProvider('ollama', 'mistral:latest');
```

### generateAIResponse

The main function that handles AI generation:

```typescript
const response = await generateAIResponse(
  query,      // User's search query
  results,    // Search results from Serper
  source      // Search source (search, images, etc.)
);
```

This function:
1. Determines the active provider
2. Attempts generation with primary provider
3. Falls back to alternative provider on failure
4. Returns the AI-generated response

## Troubleshooting

### Ollama Not Detected

**Problem**: Settings show Ollama unavailable

**Solutions**:
1. Ensure Ollama is running: `ollama serve`
2. Check it's listening on port 11434
3. Verify with: `curl http://localhost:11434/api/tags`

### No Models Available

**Problem**: Dropdown shows no Ollama models

**Solutions**:
1. Download at least one model: `ollama pull mistral`
2. Verify: `ollama list`
3. Restart Ollama service

### Groq API Error

**Problem**: Groq requests fail

**Solutions**:
1. Verify API key in `.env` file
2. Check API key is valid at console.groq.com
3. Ensure `VITE_GROQ_API_KEY` is set correctly
4. Restart development server after changing `.env`

### Response Format Issues

**Problem**: Ollama responses are incomplete

**Solutions**:
1. The system handles JSONL streaming automatically
2. Check Ollama logs: `journalctl -u ollama -f`
3. Try a different model

## Performance Considerations

### Ollama (Local)

**Pros:**
- No API costs
- Faster for users with good hardware
- Privacy - data stays local
- No rate limits

**Cons:**
- Requires local installation
- Requires disk space for models
- Performance depends on hardware
- Model download time

**Recommended Hardware:**
- 8GB+ RAM for small models (7B parameters)
- 16GB+ RAM for medium models (13B parameters)
- 32GB+ RAM for large models (70B parameters)

### Groq (Cloud)

**Pros:**
- No local setup required
- Fast inference (fastest LLM API)
- Works on any hardware
- Multiple model options

**Cons:**
- Requires API key
- Usage costs
- Rate limits
- Internet connection required

## Best Practices

1. **Local Development**: Use Ollama for unlimited testing
2. **Production**: Configure Groq as fallback for reliability
3. **Model Selection**: Start with smaller models (mistral, llama2)
4. **Error Handling**: System handles fallback automatically
5. **Monitoring**: Check console logs for provider switches

## Environment Variables

Required variables in `.env`:

```bash
# Required for search functionality
VITE_SERPER_API_KEY=your_serper_api_key

# Required for Groq (cloud) AI
VITE_GROQ_API_KEY=your_groq_api_key

# Ollama requires no API key (runs locally)
```

## Support

For issues or questions:

1. Check this documentation
2. Review console logs for errors
3. Verify environment variables
4. Test each provider independently
5. Open an issue on GitHub

## Future Enhancements

Planned features:

- [ ] Support for additional providers (OpenAI, Anthropic, etc.)
- [ ] Custom Ollama server URL
- [ ] Model performance metrics
- [ ] Usage statistics
- [ ] Streaming responses in UI
- [ ] Model warm-up on app start
