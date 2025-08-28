# Project Overview: OpenResearch.ai

**OpenResearch** is an AI-powered search engine that provides users with a comprehensive and dynamic search experience. It leverages the X.ai API (Grok2) and Serper.dev to combine cutting-edge AI technologies with robust search capabilities across multiple content types. Built with a modern, user-friendly interface, users can easily access and explore a vast array of information from a single platform.

## Technologies

- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** React Context API (AppContext)
- **AI Providers:** Ollama (local), Groq (cloud)
- **APIs:** X.ai (Grok2), Serper.dev (for search results)
- **Linting:** ESLint with TypeScript and React plugins
- **Testing:** Vitest

## Key Features

- **Multi-Modal Search**: Seamless search across various content types:
  - Web Search
  - Images
  - Videos
  - News
  - Places
  - Shopping
  - Scholarly Articles
  - Patents
- **AI-Enhanced Results**: Summarizes search results using either a locally running Ollama model or a cloud-based Groq model.
- **Arabic & English Localization**: Bi-directional UI support for Arabic (RTL) and English (LTR).
- **Dark/Light Theme**: User-selectable color scheme.

## Development Setup

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- NPM or Yarn for dependency management.
- API keys for Serper.dev and either Groq or a locally running Ollama instance.

### Environment Variables

Create a `.env` file in the root directory. Required variables are:

```env
VITE_SERPER_API_KEY=your_serper_api_key
# For X.ai (Grok2)
VITE_XAI_API_KEY=your_xai_api_key
# For Groq (alternative AI provider)
VITE_GROQ_API_KEY=your_groq_api_key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/justmalhar/OpenResearch.git
cd OpenResearch

# Install dependencies
npm install
```

### Development Commands

- **`npm run dev`**: Starts the development server with hot reloading.
- **`npm run build`**: Builds the application for production.
- **`npm run preview`**: Previews the production build locally.
- **`npm run lint`**: Lints the codebase using ESLint.
- **`npm run test`**: Runs tests using Vitest.

## Architecture

The application is structured as a standard React/Vite project:

- **`src/App.tsx`**: The main application component, orchestrating the search flow, state, and UI. It includes components for search bar, source selection, results display, and AI response.
- **`src/contexts/AppContext.tsx`**: Manages global application state like theme (dark/light), language (ar/en), and selected AI provider.
- **`src/components/`**: Contains UI components like `SearchBar`, `SourceSelector`, `SearchResults`, `AIResponse`, `ThemeToggle`, etc.
- **`src/services/`**: Houses API interaction logic, primarily in `api.ts` for calling Ollama/Groq and `search.ts` (inferred, likely for Serper.dev).
- **`src/types.ts`**: Defines TypeScript interfaces and types used throughout the application (e.g., `SearchResult`, `SearchSource`, `AIProvider`).

## Key Implementation Details

- **AI Provider Selection**: Users can choose between Ollama (running locally) and Groq (cloud API). The application checks the availability of the Ollama endpoint and models.
- **Search Flow**:
  1. User enters a query and selects a source.
  2. App calls the search service (Serper.dev) to get raw results.
  3. Raw results are displayed.
  4. App sends the query and raw results to the selected AI provider (Ollama/Groq) to generate a summary.
  5. AI summary is displayed.
- **RTL/LTR Support**: The UI dynamically adjusts based on the selected language (Arabic/English) using TailwindCSS and conditional class application.
