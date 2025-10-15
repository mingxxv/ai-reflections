# Content Management

This directory contains all editable content for the AI Reflections application. Content is stored in markdown files for easy editing and version control.

## Directory Structure

```
content/
├── modules/           # Module definitions
│   └── modules.md
├── journal/           # Journal-related content
│   ├── prompts.md
│   └── suggestions.md
├── ai-chat/           # AI Chat feature content
│   ├── emotion-prompts.md
│   ├── daily-questions.md
│   ├── badges.md
│   ├── journeys.md
│   ├── materials-shop.md
│   └── material-prompts.md
└── ui/                # UI labels and text
    └── labels.md
```

## How It Works

### Current System (File-Based)

1. **Content Storage**: All content is stored in markdown files in this directory
2. **Content Loading**: The `lib/content.ts` utility reads and parses these files
3. **Caching**: Content is cached in memory to improve performance
4. **Components**: Components use wrapper functions in `lib/mockData.ts` and `lib/promptPolicy.ts`

### Future System (API-Based)

When you're ready to connect a backend:

1. **No component changes needed**: Components will continue to work as-is
2. **Update lib/content.ts**: Replace file reading functions with API calls
3. **Same data structure**: Ensure your API returns the same data structure
4. **Gradual migration**: Migrate one content type at a time

## Editing Content

### Modules (`modules/modules.md`)

Each module is defined with a section header (`##`) followed by properties:

```markdown
## module-slug

- **id**: 1
- **title**: Module Title
- **description**: Module description text
- **icon**: 🎯
- **color**: #3B82F6
- **slug**: module-slug
- **category**: Category Name
- **enabled**: true
```

**Properties:**
- `id`: Unique numeric identifier (string)
- `title`: Display name of the module
- `description`: Brief description (1-2 sentences)
- `icon`: Emoji icon (single emoji)
- `color`: Hex color code (e.g., #3B82F6)
- `slug`: URL-friendly identifier (lowercase, hyphens)
- `category`: Category name (e.g., Fatherhood, Career, Wellness)
- `enabled`: true/false - whether the module is available

### Journal Prompts (`journal/prompts.md`)

Prompts are organized by user experience level:

```markdown
## Beginner Prompts

### beginner_1
- **text**: What did you do today?
- **difficulty**: easy

### beginner_2
- **text**: How did you feel about your interactions with others today?
- **difficulty**: challenging
```

**Sections:**
- `## Beginner Prompts`: For users journaling once a week
- `## Amateur Prompts`: For users journaling every 2 days
- `## Pro Prompts`: For daily journalers

**Properties:**
- `text`: The prompt question
- `difficulty`: easy or challenging

### Journal Suggestions (`journal/suggestions.md`)

Contextual writing suggestions based on content length and user level:

```markdown
## Content Length: Short (< 50 characters)

- Try writing about specific details from your day
- What emotions did you experience?

## Role-Specific Suggestions

### Beginner
- Remember: there are no wrong answers in journaling
```

### Emotion Prompts (`ai-chat/emotion-prompts.md`)

Prompts for different emotional states:

```markdown
## Happy

- What's bringing you joy right now?
- Tell me about a moment today that made you smile.
- What are you grateful for in this moment?
```

**Available emotions:** Happy, Sad, Anxious, Angry, Confused, Excited

### Daily Questions (`ai-chat/daily-questions.md`)

Pool of 30 reflection questions that rotate daily:

```markdown
## Questions

1. What's one thing you're grateful for today, and why does it matter to you?
2. If you could give your past self one piece of advice, what would it be?
```

### Badges (`ai-chat/badges.md`)

Achievement badges users can earn:

```markdown
## first_steps
- **name**: First Steps
- **description**: Started your reflection journey
- **icon**: 🌱
```

**Properties:**
- Section header: Badge ID (used in code)
- `name`: Display name
- `description`: What the badge represents
- `icon`: Emoji icon

### Journeys (`ai-chat/journeys.md`)

Reflection journey options with XP multipliers:

```markdown
## Week Journey
- **duration**: 7
- **name**: Week Journey
- **description**: 7 days of reflection
- **xpMultiplier**: 1.0
- **color**: blue
- **icon**: 📅
```

**Properties:**
- `duration`: Number of days
- `name`: Display name
- `description`: Brief description
- `xpMultiplier`: XP multiplier (e.g., 1.5 = 50% bonus)
- `color`: Theme color (blue, green, purple, orange, red)
- `icon`: Emoji icon

### Materials Shop (`ai-chat/materials-shop.md`)

Purchasable materials users can unlock with XP:

```markdown
## meditation_guide
- **name**: Meditation Guide
- **description**: Guided meditation techniques
- **cost**: 50
- **icon**: 🧘
- **category**: guides
```

**Properties:**
- Section header: Material ID (used in code)
- `name`: Display name
- `description**: What the material provides
- `cost`: XP cost to purchase
- `icon`: Emoji icon
- `category`: Category (guides, tools, journals, exercises, inspiration, kits)

### Material Prompts (`ai-chat/material-prompts.md`)

AI prompts that activate when users use specific materials:

```markdown
## meditation_guide

- Let's begin with a 5-minute guided meditation. Find a comfortable position and close your eyes.
- Take a moment to center yourself. Let's practice a loving-kindness meditation together.
```

**Structure:**
- Section header matches material ID from materials-shop.md
- Each bullet point is a possible prompt
- One prompt is randomly selected when the material is used

### UI Labels (`ui/labels.md`)

User-facing text labels and messages:

```markdown
## Journal

### Frequency Setup
- **heading**: Welcome to Journal
- **subheading**: How often do you plan to journal?
```

## Markdown Format Rules

1. **Section headers** use `##` for main sections and `###` for subsections
2. **Properties** use the format: `- **key**: value`
3. **Lists** use simple bullet points: `- Item text`
4. **Numbered lists** use: `1. Item text`
5. **Boolean values** must be exactly `true` or `false` (lowercase)
6. **Numbers** are parsed automatically (integers and floats)
7. **Strings** are used for all other values

## Best Practices

### Content Editing

1. **Always test after editing**: Run the dev server and verify changes appear
2. **Maintain consistent formatting**: Follow the examples in each file
3. **Use meaningful IDs**: Make slugs and IDs descriptive and URL-friendly
4. **Keep descriptions concise**: Aim for 1-2 sentences
5. **Match icon style**: Use single emoji characters consistently

### Version Control

1. **Commit content changes separately**: Keep content updates separate from code changes
2. **Write descriptive commit messages**: e.g., "Update module descriptions" or "Add new daily questions"
3. **Review changes carefully**: Content is user-facing

### Adding New Content

#### Adding a New Module

1. Open `content/modules/modules.md`
2. Add a new section at the bottom:
   ```markdown
   ## new-module-slug
   - **id**: 10
   - **title**: New Module Title
   - **description**: Description here
   - **icon**: 🎯
   - **color**: #3B82F6
   - **slug**: new-module-slug
   - **category**: Category
   - **enabled**: true
   ```
3. Save and test

#### Adding Daily Questions

1. Open `content/ai-chat/daily-questions.md`
2. Add new questions to the numbered list
3. Questions rotate based on day of month (modulo operation)

#### Adding a New Material

1. Add material to `content/ai-chat/materials-shop.md`
2. Add corresponding prompts to `content/ai-chat/material-prompts.md`
3. Use the same ID in both files

## Migration to Backend API

When you're ready to connect a backend, follow these steps:

### Step 1: Create API Endpoints

Create endpoints that return the same data structure:

```
GET /api/content/modules
GET /api/content/modules/:slug
GET /api/content/journal/prompts?role=beginner
GET /api/content/journal/suggestions
GET /api/content/ai-chat/emotion-prompts
GET /api/content/ai-chat/daily-questions
GET /api/content/ai-chat/badges
GET /api/content/ai-chat/journeys
GET /api/content/ai-chat/materials
GET /api/content/ai-chat/material-prompts
GET /api/content/ui/labels?section=journal
```

### Step 2: Update lib/content.ts

Replace file reading with API calls:

**Before (file-based):**
```typescript
export async function loadModules(): Promise<Module[]> {
  const fs = require('fs');
  const path = require('path');
  const contentPath = path.join(process.cwd(), 'content', 'modules', 'modules.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  return parseModulesFromMarkdown(content);
}
```

**After (API-based):**
```typescript
export async function loadModules(): Promise<Module[]> {
  const response = await fetch('/api/content/modules');
  if (!response.ok) throw new Error('Failed to load modules');
  return response.json();
}
```

### Step 3: Update Synchronous Wrappers

In `lib/mockData.ts` and `lib/promptPolicy.ts`, update the sync wrapper functions to use async/await:

**Before:**
```typescript
function loadModulesSync(): Module[] {
  // File reading code
}
```

**After:**
```typescript
async function loadModulesAsync(): Promise<Module[]> {
  return await loadModules(); // From lib/content.ts
}
```

### Step 4: Update Components

Update components to handle async loading (if not already using async):

**Before:**
```typescript
const modules = getAllModules(); // Synchronous
```

**After:**
```typescript
const modules = await getAllModules(); // Asynchronous
// Or use React hooks for client components
```

### Step 5: Test Thoroughly

1. Test each content type individually
2. Verify caching still works
3. Check error handling
4. Ensure loading states are displayed

## Troubleshooting

### Content not updating?

1. **Check file syntax**: Ensure markdown formatting is correct
2. **Clear cache**: Restart the dev server to clear in-memory cache
3. **Check file path**: Verify the file is in the correct location
4. **Check console**: Look for parsing errors in terminal

### Parse errors?

1. **Boolean values**: Must be exactly `true` or `false` (lowercase)
2. **Property format**: Must match `- **key**: value` exactly
3. **Section headers**: Must start with `##` for main sections
4. **Encoding**: Ensure file is saved as UTF-8

### Missing content?

1. **Check section headers**: Must match expected format
2. **Check IDs**: Must be unique and match expected format
3. **Check required fields**: All properties must be present

## Support

For questions or issues with content management:

1. Check this README for formatting rules
2. Review existing content files for examples
3. Check `lib/content.ts` for parsing logic
4. Review component code for how content is used

## Future Enhancements

Potential improvements to the content system:

1. **Content validation**: JSON schema validation for content files
2. **Hot reloading**: Auto-refresh content without server restart
3. **Content editor UI**: Web interface for editing content
4. **Content versioning**: Track content changes over time
5. **A/B testing**: Support multiple content variations
6. **Localization**: Multi-language support
7. **Content preview**: Preview changes before publishing
