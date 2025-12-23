# 🧩 Roketin Components MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to the React Base Project component library.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📚 **Component Catalog** | Browse all 80+ available components |
| 🔍 **Search** | Find components by name, category, or description |
| 📖 **Documentation** | Get props, descriptions, and usage examples |
| 🛠 **Code Generation** | Generate form and table snippets |
| 📄 **Source Access** | View component source code |

## 🚀 Installation

```bash
cd mcp
pnpm install
```

## 🔧 Configuration

Add to your MCP client configuration (e.g., Claude Desktop, Cursor):

### Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "roketin-components": {
      "command": "node",
      "args": ["/path/to/react-base-project/mcp/server.js"]
    }
  }
}
```

### Cursor (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "roketin-components": {
      "command": "node",
      "args": ["./mcp/server.js"],
      "cwd": "/path/to/react-base-project"
    }
  }
}
```

## 🛠 Available Tools

### `list_components`

List all available components, optionally filtered by category.

```
Categories: Buttons, Forms, Data Display, Layout, Feedback, Navigation, Media, Utilities, Branding
```

### `get_component`

Get detailed information about a specific component.

```
Input: { componentId: "r-btn" }
Output: { name, description, props, example }
```

### `search_components`

Search components by name, description, or category.

```
Input: { query: "button" }
```

### `get_component_example`

Get usage example code for a component.

```
Input: { componentId: "r-data-table" }
```

### `get_component_source`

Get the source code of a component file.

```
Input: { componentId: "r-btn" }
```

### `generate_form_snippet`

Generate a complete React Hook Form with Roketin components.

```json
{
  "formName": "user",
  "fields": [
    { "name": "name", "type": "text", "label": "Full Name", "required": true },
    { "name": "email", "type": "email", "label": "Email", "required": true },
    { "name": "role", "type": "select", "label": "Role", "required": true },
    { "name": "active", "type": "switch", "label": "Active Status" }
  ]
}
```

### `generate_table_snippet`

Generate a data table with column definitions.

```json
{
  "dataType": "TUser",
  "columns": [
    { "key": "name", "header": "Name", "type": "text" },
    { "key": "email", "header": "Email", "type": "text" },
    { "key": "status", "header": "Status", "type": "badge" },
    { "key": "createdAt", "header": "Created", "type": "date" },
    { "key": "actions", "header": "Actions", "type": "actions" }
  ]
}
```

## 📦 Resources

The server also exposes resources for reading:

| URI | Description |
|-----|-------------|
| `components://catalog` | Full component catalog |
| `components://categories` | Components organized by category |
| `components://r-btn` | Individual component documentation |
| `components://r-input` | ... |
| `components://r-data-table` | ... |

## 📋 Component Catalog

### Buttons
- `r-btn` - Primary button with variants
- `r-button-group` - Button group container
- `r-float-button` - Floating action button

### Forms
- `r-input` - Text input
- `r-input-number` - Numeric input
- `r-input-password` - Password input
- `r-textarea` - Multi-line text
- `r-select` - Dropdown select
- `r-select-infinite` - Infinite scroll select
- `r-checkbox` - Checkbox input
- `r-checkbox-multiple` - Multiple checkboxes
- `r-radio` - Radio button
- `r-radio-group` - Radio button group
- `r-switch` - Toggle switch
- `r-picker` - Date picker
- `r-range-picker` - Date range picker
- `r-file-uploader` - File upload
- `r-form` - Form wrapper
- `r-form-field` - Form field with label/error
- `r-form-fieldset` - Form section

### Data Display
- `r-data-table` - Feature-rich data table
- `r-data-list` - List with pagination
- `r-simple-table` - Basic table
- `r-list` - Generic list
- `r-timeline` - Timeline component
- `r-statistic-dashboard` - Statistics cards
- `r-badge` - Badge/tag
- `r-progress` - Progress bar

### Layout
- `r-card` - Card container
- `r-sidebar` - Sidebar navigation
- `r-splitter` - Resizable panels
- `r-collapse` - Collapsible content
- `r-tabs` - Tabbed content
- `r-stepper` - Step wizard
- `r-carousel` - Image carousel
- `r-aspect-ratio` - Aspect ratio container
- `r-sticky-wrapper` - Sticky container

### Feedback
- `r-dialog` - Modal dialog
- `r-alert-dialog` - Alert modal
- `r-sheet` - Side panel
- `r-tooltip` - Tooltip
- `r-popconfirm` - Confirmation popover
- `r-popover` - Popover content
- `r-hover-card` - Hover card
- `r-dropdown-menu` - Dropdown menu
- `r-context-menu` - Right-click menu
- `r-result` - Result page
- `r-empty-state` - Empty state
- `r-loading` - Loading spinner
- `r-toaster` - Toast notifications
- `r-alert` - Alert banner

### Navigation
- `r-breadcrumbs` - Breadcrumb navigation
- `r-menu` - Menu component
- `r-menubar` - Menu bar
- `r-navigation-menu` - Navigation menu
- `r-pagination` - Page navigation
- `r-navigate` - Navigation helper
- `r-anchor` - Anchor links

### Media
- `r-img` - Image component
- `r-avatar` - User avatar
- `r-file-viewer` - File preview

### Utilities
- `r-separator` - Divider line
- `r-skeleton` - Loading skeleton
- `r-label` - Form label
- `r-virtual-scroll` - Virtualized scroll
- `r-infinite-scroll` - Infinite scroll

### Branding
- `r-brand` - App branding
- `r-theme-switcher` - Theme toggle
- `r-lang-switcher` - Language toggle

## 🔄 How It Works

```
AI Assistant (Claude, Cursor, etc.)
         ↓
    MCP Protocol
         ↓
  roketin-components-mcp
         ↓
┌────────────────────────┐
│   Component Catalog    │
│   (in-memory database) │
└────────────────────────┘
         ↓
┌────────────────────────┐
│   Source Code Files    │
│   (src/modules/app/    │
│    components/base/)   │
└────────────────────────┘
```

## 🧪 Testing

```bash
# Run the server (for testing)
node server.js

# It will run on stdio, waiting for MCP protocol messages
```

## 📝 Extending the Catalog

To add new components to the catalog, edit `server.js` and add entries to the `COMPONENT_CATALOG` object:

```javascript
'r-new-component': {
  name: 'RNewComponent',
  file: 'r-new-component.tsx',
  category: 'Category',
  description: 'Description of the component',
  props: [
    { name: 'propName', type: 'string', default: "'value'" },
  ],
  example: `import { RNewComponent } from '@/modules/app/components/base/r-new-component';

<RNewComponent propName="value" />`,
},
```

---

**Built with ❤️ for AI-assisted development**
