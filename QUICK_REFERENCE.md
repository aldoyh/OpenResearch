# Quick Reference Guide - OpenResearch Tools

## 🚀 Quick Start

1. **Start the app**: `npm run dev`
2. **Open**: `http://localhost:5173/`
3. **Search** for anything
4. **Use tools** on any result

## 🎯 Tool Buttons (on every result)

| Button | Icon | Action | Use Case |
|--------|------|--------|----------|
| **Rephrase** | 🔄 | Makes content clearer | Understanding complex articles |
| **Rewrite** | ✍️ | Creates fresh perspective | Content adaptation |
| **Save** | 💾 | Saves to local storage | Research collection |

## 💡 How to Use

### Rephrase an Article
1. Click **Rephrase** button
2. Wait 3-10 seconds
3. View rephrased content below
4. Optionally save the result

### Rewrite an Article
1. Click **Rewrite** button
2. Wait 3-10 seconds
3. View rewritten content below
4. Optionally save the result

### Save an Article
1. Click **Save** button
2. File downloads automatically
3. Also saved to localStorage
4. Access via floating bookmark button

## 📚 Saved Articles

### Access Your Saved Articles
1. Look for floating bookmark button (bottom-right)
2. Click to open panel
3. Browse saved articles (left side)
4. Click any article to preview (right side)

### Manage Saved Articles
- **Download**: Click download icon → Gets .md file
- **Delete**: Click delete icon → Confirms → Removes article
- **View Original**: Click external link → Opens source URL

## 🤖 AI Provider

### Automatic Selection
- System checks for **Ollama** first
- If available → Uses Ollama
- If not → Falls back to **Groq**

### Manual Configuration
- Open **AI Provider Settings** (settings icon)
- Select preferred provider
- Choose model from dropdown
- Settings persist across sessions

## ⚡ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search | `Enter` in search box |
| Close modal | `Esc` or click X |
| Toggle theme | Click moon/sun icon |

## 🎨 Result Types with Tools

All these result types have the tools:

- ✅ **Web** - Standard search results
- ✅ **News** - News articles with images
- ✅ **Scholar** - Academic papers with metadata
- 🚧 **Videos** - Video results (basic view)
- 🚧 **Images** - Image results (basic view)
- 🚧 **Shopping** - Shopping results (basic view)
- 🚧 **Places** - Location results (basic view)

## 🔍 Search Tips

### Best Results for Tools
- Use **Web**, **News**, or **Scholar** searches
- These have full article content
- Tools work best with text-heavy results

### Quick Research Workflow
1. Search for topic
2. Rephrase complex articles
3. Save important findings
4. Review saved articles later
5. Download as markdown

## 📱 Mobile Usage

- All features work on mobile
- Tools are fully responsive
- Saved articles panel adapts
- Touch-friendly buttons

## ⚠️ Troubleshooting

### Tools Not Working?
- Check AI provider is configured
- Verify Ollama is running (if using Ollama)
- Check Groq API key (if using Groq)
- Look for errors in console (F12)

### Can't Save Articles?
- Check localStorage is enabled
- Clear old articles if storage full
- Ensure browser allows downloads

### Slow Processing?
- AI processing takes 3-10 seconds
- Wait for loading spinner
- Don't click multiple times

## 💾 Data Management

### Where Are Articles Saved?
- **LocalStorage**: In your browser
- **Downloads**: In your Downloads folder
- **Format**: Markdown (.md files)

### How to Backup?
1. Open Saved Articles panel
2. Download all articles individually
3. Or export localStorage:
   ```javascript
   localStorage.getItem('saved_articles')
   ```

### How to Clear?
1. Delete articles one by one, or
2. Clear all in browser settings, or
3. Run in console:
   ```javascript
   localStorage.removeItem('saved_articles')
   ```

## 🌙 Dark Mode

- Toggle with moon/sun icon (top-right)
- Persists across sessions
- Affects all components
- Tools remain fully functional

## 🔗 Integration

### With Ollama
- Install Ollama locally
- Run `ollama serve`
- Pull a model: `ollama pull mistral`
- App auto-detects

### With Groq
- Get API key from Groq
- Add to `.env` file:
  ```
  VITE_GROQ_API_KEY=your_key_here
  ```
- Restart dev server

## 📊 Supported Content

### Best For:
- ✅ News articles
- ✅ Blog posts
- ✅ Academic papers
- ✅ Documentation
- ✅ Wikipedia articles

### Limited Support:
- ⚠️ Videos (metadata only)
- ⚠️ Images (descriptions only)
- ⚠️ Paywalled content
- ⚠️ Login-required pages

## 🎓 Pro Tips

1. **Batch Research**: Save multiple articles, review later
2. **Compare Versions**: Rephrase vs Rewrite for different perspectives
3. **Cite Sources**: Original URLs preserved in metadata
4. **Organize**: Use descriptive search queries for easier retrieval
5. **Export**: Download all articles for offline access

## 🆘 Support

### Getting Help
1. Check this guide first
2. Review error messages
3. Check browser console (F12)
4. Verify AI provider setup
5. Test with simple articles first

### Common Issues

**"Failed to extract content"**
→ URL might be blocked by CORS or require authentication

**"No response from AI"**
→ Check provider configuration and network

**"Storage limit reached"**
→ Delete old articles or clear storage

## 🎉 That's It!

You're ready to use all the powerful tools in OpenResearch!

**Happy researching! 🚀**

---

*Quick Reference v1.0 - Last updated: October 28, 2025*
