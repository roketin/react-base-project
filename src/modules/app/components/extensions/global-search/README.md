# 🔍 Global Search

> **Powerful command palette for lightning-fast navigation across your application**

A feature-rich search component that combines fuzzy search, recent history, and custom actions to help users quickly find and access any menu or action in the system.

---

## ✨ Features

| Feature                   | Description                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| 🔎 **Fuzzy Search**       | Intelligent matching powered by Fuse.js - finds results even with typos |
| 🕐 **Recent History**     | Tracks your 5 most recently accessed items for quick access             |
| 🎯 **Module Filtering**   | Searchable dropdown to filter results by specific modules               |
| ⚡ **Custom Actions**     | Define quick actions (Create, Edit, View) per module                    |
| ⌨️ **Keyboard Shortcuts** | `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac) to open instantly             |
| 🔐 **Encrypted Storage**  | Recent history stored securely with AES encryption                      |
| 🎨 **Smart UI**           | Separate sections for Actions and Menus with visual badges              |
| 🔒 **Permission-Based**   | Automatically filters based on user permissions                         |
| 📦 **Auto-Collection**    | Automatically collects all menus from sidebar configs                   |
| 🎭 **Default Icons**      | Fallback icons ensure consistent visual experience                      |

---

## 🚀 Quick Start

### Opening the Search

**Method 1: Keyboard Shortcut** (Recommended)

```
Windows/Linux: Ctrl + K
Mac: Cmd + K
```

**Method 2: Click Button**

- Look for the search button in the header (next to language switcher)
- Click to open the search dialog

### Using the Search

1. **Type to Search**
   - Start typing menu names, actions, or keywords
   - Results appear instantly with fuzzy matching

2. **Navigate Results**
   - `↑` `↓` Arrow keys to move between results
   - `Enter` to select and navigate
   - `ESC` to close the dialog

3. **Filter by Module**
   - Click the module dropdown (top-right)
   - Select a specific module to narrow results
   - Choose "All Modules" to see everything

### Understanding Results

**⚡ Actions Section** (Orange badges)

- Quick actions like "Create", "Edit", "View"
- Shown with primary color icon background
- Includes action badge for clarity

**📋 Menus Section** (Gray icons)

- Regular navigation menu items
- Shown with muted icon background
- Organized by module

**🕐 Recent Section** (When not searching)

- Your 5 most recently accessed items
- Appears when search is empty
- Cleared automatically after 30 days

---

## 🏗️ Architecture

### Component Structure

```
src/modules/app/
├── components/global-search/
│   ├── global-search.tsx              # 🎯 Main search dialog (cmdk)
│   ├── global-search-trigger.tsx      # 🔘 Trigger button component
│   ├── search-result-item.tsx         # 📄 Individual result item
│   ├── search-module-filter.tsx       # 🎛️ Module filter dropdown (RSelect)
│   ├── index.ts                       # 📦 Public exports
│   └── README.md                      # 📖 This file
│
├── hooks/
│   ├── use-global-search.ts           # 🔍 Search logic + Fuse.js integration
│   └── use-searchable-items.ts        # 📊 Collect items from menus & actions
│
├── stores/
│   └── global-search.store.ts         # 💾 Zustand store + encrypted storage
│
├── libs/
│   └── search-actions.lib.ts          # ⚙️ Generate actions from module configs
│
└── types/
    ├── global-search.type.ts          # 📝 TypeScript type definitions
    └── module-config.type.ts          # 🔧 Module config with actions support
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Input                               │
│                    (Ctrl+K or Click Button)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GlobalSearch Component                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. useSearchableItems()                                  │  │
│  │     ├─ Flatten APP_SIDEBAR_MENUS                          │  │
│  │     ├─ Generate actions from module configs               │  │
│  │     └─ Filter by user permissions                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  2. useGlobalSearch()                                     │  │
│  │     ├─ Create Fuse.js instance                            │  │
│  │     ├─ Perform fuzzy search                               │  │
│  │     ├─ Get recent items from store                        │  │
│  │     └─ Return filtered results                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  3. Render Results                                        │  │
│  │     ├─ Actions Section (with badges)                      │  │
│  │     ├─ Menus Section                                      │  │
│  │     └─ Recent Section (when no query)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    User Selects Item                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Track access in store                                 │  │
│  │  2. Encrypt and save to LocalStorage                      │  │
│  │  3. Navigate to item.path                                 │  │
│  │  4. Close dialog                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Storage Format

Data disimpan di **LocalStorage** dengan key `app_search_tracking` dan di-encrypt menggunakan **AES encryption** (crypto-js) dengan secret key dari `VITE_CRYPTO_SECRET`.

**Encrypted Storage Structure:**

```ts
{
  recent: ['menu-id-1', 'menu-id-2', 'menu-id-3', ...],  // Last 5 accessed
  accessCount: {                                          // For future analytics
    'menu-id-1': 15,
    'menu-id-2': 8,
    'menu-id-3': 3
  },
  lastUpdated: 1234567890123                              // Timestamp
}
```

**Security Features:**

- ✅ AES-256 encryption
- ✅ Secret key from environment variable
- ✅ Automatic cleanup on decryption failure
- ✅ No sensitive data stored (only menu IDs)

---

## ⚙️ Configuration

### Search Behavior

Edit `src/modules/app/hooks/use-global-search.ts`:

```ts
const FUSE_OPTIONS: IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'title', weight: 2 }, // Search in title (highest priority)
    { name: 'moduleTitle', weight: 1 }, // Search in module name
    { name: 'keywordsText', weight: 2 }, // Search in keywords (high priority)
    { name: 'badge', weight: 1.5 }, // Search in action badges
  ],
  threshold: 0.3, // 0.0 = exact, 1.0 = match anything
  minMatchCharLength: 1, // Minimum characters to match
  ignoreLocation: true, // Ignore position of match
  distance: 100, // Max distance for matches
  findAllMatches: true, // Find all matching patterns
};
```

**Tuning Tips:**

- **Lower threshold** (0.2) = More strict matching
- **Higher threshold** (0.5) = More lenient matching
- **Increase weight** = Higher priority in search
- **Adjust distance** = Allow matches further apart

### Storage Limits

Edit `src/modules/app/stores/global-search.store.ts`:

```ts
const RECENT_LIMIT = 5; // Number of recent items to track
```

---

## 🎨 Adding Custom Actions

### Step 1: Define Actions in Module Config

Edit your module config file (e.g., `src/modules/your-module/your-module.config.ts`):

```ts
import { Plus, Edit, Eye, Trash } from 'lucide-react';
import { defineModuleConfig } from '@/modules/app/types/module-config.type';

export const yourModuleConfig = defineModuleConfig({
  moduleId: 'your-module',
  featureFlag: 'YOUR_MODULE',
  menu: {
    title: 'yourModule:title',
    icon: YourIcon,
    name: 'YourModuleIndex',
    permission: 'YOUR_MODULE_VIEW',
  },
  actions: [
    {
      routeName: 'YourModuleCreate',
      titleKey: 'yourModule:actions.create',
      badge: 'Create',
      icon: Plus,
      permission: 'YOUR_MODULE_CREATE',
      keywords: ['create', 'new', 'add', 'tambah'],
    },
    {
      routeName: 'YourModuleEdit',
      titleKey: 'yourModule:actions.edit',
      badge: 'Edit',
      icon: Edit,
      permission: 'YOUR_MODULE_UPDATE',
      keywords: ['edit', 'update', 'modify', 'ubah'],
    },
    {
      routeName: 'YourModuleView',
      titleKey: 'yourModule:actions.view',
      badge: 'View',
      icon: Eye,
      permission: 'YOUR_MODULE_VIEW',
      keywords: ['view', 'detail', 'lihat'],
    },
  ],
});
```

### Step 2: Ensure Routes Exist

Make sure the routes referenced in `routeName` are defined in your routes file:

```ts
// src/modules/your-module/routes/your-module.routes.tsx
export const yourModuleRoutes = createAppRoutes([
  {
    path: 'your-module',
    element: <Outlet />,
    children: [
      {
        name: 'YourModuleIndex',
        index: true,
        element: <YourModuleList />,
      },
      {
        name: 'YourModuleCreate',  // ← Must match routeName in action
        path: 'create',
        element: <YourModuleForm />,
        handle: {
          permissions: ['YOUR_MODULE_CREATE'],
        },
      },
      {
        name: 'YourModuleEdit',    // ← Must match routeName in action
        path: ':id/edit',
        element: <YourModuleForm />,
        handle: {
          permissions: ['YOUR_MODULE_UPDATE'],
        },
      },
    ],
  },
]);
```

### Action Properties Reference

| Property     | Type         | Required | Description                                |
| ------------ | ------------ | -------- | ------------------------------------------ |
| `routeName`  | `string`     | ✅ Yes   | Route name defined in routes file          |
| `titleKey`   | `string`     | ✅ Yes   | Translation key for action title           |
| `badge`      | `string`     | ✅ Yes   | Badge label (e.g., "Create", "Edit")       |
| `icon`       | `LucideIcon` | ❌ No    | Icon component (defaults to Zap ⚡)        |
| `permission` | `string`     | ❌ No    | Permission key for access control          |
| `keywords`   | `string[]`   | ❌ No    | Search keywords for better discoverability |

### Best Practices

✅ **DO:**

- Use clear, action-oriented badges ("Create", "Edit", "View")
- Include multiple keywords (English + Bahasa Indonesia)
- Set appropriate permissions for security
- Use meaningful icons that represent the action

❌ **DON'T:**

- Use vague badges ("Action", "Do Something")
- Forget to define the route in routes file
- Skip permissions for sensitive actions
- Use too many keywords (keep it relevant)

---

## 🎯 Examples

### Example 1: User Management Module

```ts
// src/modules/user/user.config.ts
import { Users, UserPlus, UserCog, Shield } from 'lucide-react';

export const userModuleConfig = defineModuleConfig({
  moduleId: 'user',
  menu: {
    title: 'user:title',
    icon: Users,
    name: 'UserIndex',
  },
  actions: [
    {
      routeName: 'UserCreate',
      titleKey: 'user:actions.createUser',
      badge: 'Create',
      icon: UserPlus,
      permission: 'USER_CREATE',
      keywords: ['create', 'new', 'add', 'user', 'tambah', 'pengguna'],
    },
    {
      routeName: 'UserRoleManagement',
      titleKey: 'user:actions.manageRoles',
      badge: 'Roles',
      icon: Shield,
      permission: 'USER_ROLE_MANAGE',
      keywords: ['role', 'permission', 'access', 'peran'],
    },
  ],
});
```

### Example 2: Product Module

```ts
// src/modules/product/product.config.ts
import { Package, Plus, Upload, Download } from 'lucide-react';

export const productModuleConfig = defineModuleConfig({
  moduleId: 'product',
  menu: {
    title: 'product:title',
    icon: Package,
    name: 'ProductIndex',
  },
  actions: [
    {
      routeName: 'ProductCreate',
      titleKey: 'product:actions.create',
      badge: 'Create',
      icon: Plus,
      keywords: ['create', 'new', 'product', 'tambah', 'produk'],
    },
    {
      routeName: 'ProductImport',
      titleKey: 'product:actions.import',
      badge: 'Import',
      icon: Upload,
      permission: 'PRODUCT_IMPORT',
      keywords: ['import', 'upload', 'bulk', 'csv', 'excel'],
    },
    {
      routeName: 'ProductExport',
      titleKey: 'product:actions.export',
      badge: 'Export',
      icon: Download,
      keywords: ['export', 'download', 'csv', 'excel', 'report'],
    },
  ],
});
```

---

## 🔌 API Integration (Future)

For server-side search integration, the system can be extended to support backend APIs.

### Recommended Endpoint Specification

**Endpoint:**

```
GET /api/v1/search
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | `string` | ✅ Yes | Search query |
| `module` | `string` | ❌ No | Filter by module ID |
| `type` | `menu\|action` | ❌ No | Filter by item type |
| `limit` | `number` | ❌ No | Max results (default: 20) |
| `offset` | `number` | ❌ No | Pagination offset |

**Example Request:**

```bash
GET /api/v1/search?q=create%20user&module=user-management&limit=10
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "action",
        "id": "user-create",
        "title": "Create User",
        "path": "/admin/users/create",
        "module": "user-management",
        "moduleTitle": "User Management",
        "icon": "UserPlus",
        "badge": "Create",
        "keywords": ["create", "new", "add", "user"],
        "relevanceScore": 0.95
      },
      {
        "type": "menu",
        "id": "user-list",
        "title": "User Management",
        "path": "/admin/users",
        "module": "user-management",
        "moduleTitle": "User Management",
        "icon": "Users",
        "keywords": ["user", "management", "list"],
        "relevanceScore": 0.87
      }
    ],
    "total": 2,
    "hasMore": false
  },
  "meta": {
    "query": "create user",
    "module": "user-management",
    "executionTime": 45
  }
}
```

### Backend Implementation Considerations

**Security:**

- ✅ Validate user authentication
- ✅ Filter results by user permissions
- ✅ Rate limit search requests
- ✅ Sanitize search queries (prevent injection)

**Performance:**

- ✅ Use search engine (Elasticsearch, Algolia, Meilisearch)
- ✅ Cache frequently searched queries
- ✅ Index menu and action data
- ✅ Implement pagination for large result sets

**Analytics:**

- ✅ Track popular searches
- ✅ Monitor search performance
- ✅ Analyze zero-result queries
- ✅ Track click-through rates

**Features:**

- ✅ Typo tolerance
- ✅ Synonym support
- ✅ Multi-language search
- ✅ Personalized results based on user history

---

## 🐛 Troubleshooting

### Search Not Working

**Problem:** Search dialog doesn't open

- ✅ Check if `GlobalSearch` component is rendered in `AppLayout`
- ✅ Verify keyboard shortcut isn't conflicting with browser/OS shortcuts
- ✅ Check browser console for errors

**Problem:** No results found

- ✅ Verify user has permissions for the menus/actions
- ✅ Check if module feature flags are enabled
- ✅ Adjust Fuse.js threshold for more lenient matching
- ✅ Verify menu items have proper `name` property in routes

### Actions Not Appearing

**Problem:** Custom actions don't show in search

- ✅ Verify `actions` array is defined in module config
- ✅ Check if `routeName` matches the route name in routes file
- ✅ Verify user has the required permission
- ✅ Check if module feature flag is enabled
- ✅ Look for errors in browser console

### Storage Issues

**Problem:** Recent history not persisting

- ✅ Check if `VITE_CRYPTO_SECRET` is set in `.env`
- ✅ Verify LocalStorage is not disabled in browser
- ✅ Check browser console for encryption errors
- ✅ Clear LocalStorage and try again

---

## 📊 Performance Tips

### Optimization Strategies

1. **Lazy Load Actions**
   - Actions are generated on-demand
   - Only visible modules are included

2. **Memoization**
   - Search results are memoized with `useMemo`
   - Fuse.js instance is cached

3. **Debouncing** (Future)
   - Add debounce to search input
   - Reduce unnecessary re-renders

4. **Virtual Scrolling** (Future)
   - For large result sets (100+ items)
   - Use `@tanstack/react-virtual`

---

## 🎓 Learn More

### Related Documentation

- [Fuse.js Documentation](https://fusejs.io/)
- [cmdk Documentation](https://cmdk.paco.me/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Router Documentation](https://reactrouter.com/)

### Internal Documentation

- [Module Configuration Guide](../../../README.md#feature-flags--module-configs)
- [Permission System](../../../README.md#conventions--tooling)
- [Routing Guide](../../../README.md#project-structure)

---

## 📝 Changelog

### Version 1.0.0 (Current)

- ✅ Initial release
- ✅ Fuzzy search with Fuse.js
- ✅ Recent history tracking
- ✅ Module filtering
- ✅ Custom actions support
- ✅ Encrypted storage
- ✅ Permission-based filtering
- ✅ Default icons

### Planned Features (v1.1.0)

- [ ] Server-side search integration
- [ ] Search analytics
- [ ] Action with input parameters
- [ ] Command palette for non-navigation actions
- [ ] Search history
- [ ] Keyboard shortcuts customization

---

<div align="center">

**Built with ❤️ by Roketin Team**

[Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues)

</div>
