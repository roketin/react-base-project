# 🔍 Adaptive Search Module

> Modular, reusable search system with static actions + dynamic API data

A powerful search module that combines local configuration files with API data to provide a unified search experience across your application.

---

## ✨ Features

| Feature                   | Description                                       |
| ------------------------- | ------------------------------------------------- |
| 🔎 **Fuzzy Search**       | Intelligent matching powered by Fuse.js           |
| 📁 **Auto-Discovery**     | Automatically collects `*.config.search.ts` files |
| 🌐 **API Integration**    | Fetch dynamic data from backend with React-Query  |
| 🎯 **Module Mapping**     | Each module defines how to transform API data     |
| 🕐 **Recent History**     | Tracks 5 most recently accessed items             |
| 🎨 **Type-Safe**          | Full TypeScript support with `T` prefix           |
| ⌨️ **Keyboard Shortcuts** | `Ctrl+K` / `Cmd+K` to open                        |
| 🔐 **Encrypted Storage**  | Recent history stored with AES encryption         |

---

## 🚀 Quick Start

### 1. Add to App Layout

```tsx
// src/modules/app/components/layouts/app-layout.tsx
import {
  RAdaptiveSearch,
  RAdaptiveSearchTrigger,
} from '@/modules/adaptive-search';

export default function AppLayout() {
  return (
    <RSidebarProvider>
      {/* Trigger button */}
      <RAdaptiveSearchTrigger />

      {/* Search dialog */}
      <RAdaptiveSearch apiEnabled={true} />
    </RSidebarProvider>
  );
}
```

### 2. Create Module Config

```typescript
// src/modules/your-module/your-module.config.search.ts
import { Plus, Search, FileText, Edit } from 'lucide-react';
import type { TAdaptiveSearchConfig } from '@/modules/adaptive-search/types/adaptive-search.type';

export default {
  // Static actions
  actions: [
    {
      id: 'create-item',
      moduleId: 'your-module',
      titleKey: 'yourModule:actions.create',
      badge: 'Create',
      icon: Plus,
      keywords: ['create', 'new', 'tambah'],
      actionType: 'navigate',
      actionPayload: { routeName: 'YourModuleCreate' },
    },
  ],

  // API mapping for dynamic data
  apiMapping: {
    moduleId: 'your-module',

    filter: (apiItem) => apiItem.module === 'your-module',

    transform: (apiItem) => ({
      id: `api-${apiItem.module}-${apiItem.id}`,
      type: 'data',
      title: apiItem.label,
      module: apiItem.module,
      moduleTitle: 'Your Module',
      badge: apiItem.action,
    }),

    getIcon: (apiItem) => (apiItem.action === 'edit' ? Edit : FileText),

    onSelect: (apiItem, context) => {
      if (apiItem.action === 'detail') {
        context.navigate(`/your-module/${apiItem.id}`);
      } else if (apiItem.action === 'edit') {
        context.navigate(`/your-module/${apiItem.id}/edit`);
      }
    },
  },
} satisfies TAdaptiveSearchConfig;
```

---

## 📁 File Structure

```
src/modules/adaptive-search/
├── components/
│   ├── r-adaptive-search.tsx           # Main dialog
│   ├── r-adaptive-search-trigger.tsx   # Trigger button
│   ├── r-search-result-item.tsx        # Result item
│   └── r-search-module-filter.tsx      # Module filter
├── hooks/
│   └── use-search-engine.ts            # Fuse.js search logic
├── stores/
│   └── adaptive-search.store.ts        # Zustand store
├── services/
│   └── adaptive-search.service.ts      # React-Query API
├── adapters/
│   ├── action-collector.ts             # Auto-discovery
│   └── app-adapter.ts                  # Merge local + API
├── types/
│   └── adaptive-search.type.ts         # TypeScript types
├── index.ts                            # Public API
└── README.md                           # This file
```

---

## 🔄 Data Flow

```
User types query
    ↓
useSearchEngine (Fuse.js)
    ↓
useAppSearchAdapter
    ↓
┌─────────────────┬─────────────────┐
│  Local Files    │   API Server    │
│  *.config.      │   GET /api/     │
│  search.ts      │   search/       │
│                 │   adaptive      │
└────────┬────────┴────────┬────────┘
         │                 │
         ↓                 ↓
    [static actions]  [dynamic data]
         │                 │
         └────────┬────────┘
                  ↓
          Transform via
          module mappings
                  ↓
          [merged results]
                  ↓
          Display in UI
```

---

## 🎯 API Response Format

### Expected Response

```json
{
  "status": "success",
  "data": [
    {
      "module": "sample-form",
      "id": "a1b2c3",
      "label": "FAC-001",
      "action": "detail"
    },
    {
      "module": "sample-form",
      "id": "d4e5f6",
      "label": "TRX-002",
      "action": "edit"
    }
  ],
  "message": "Search results retrieved successfully"
}
```

### API Endpoint

```
GET /api/search/adaptive?q={query}&modules={module1,module2}
```

---

## 📝 Type Definitions

All types use `T` prefix following project conventions:

```typescript
// Searchable item (unified type)
type TSearchableItem = {
  id: string;
  type: 'menu' | 'action' | 'data';
  title: string;
  module: string;
  moduleTitle: string;
  icon?: LucideIcon;
  badge?: string;
  keywords?: string[];
  // ...
};

// API response item
type TApiSearchResultItem = {
  module: string;
  id: string;
  label: string;
  action: string;
};

// Module config
type TAdaptiveSearchConfig = {
  actions?: TSearchActionDefinition[];
  apiMapping?: TApiMappingConfig;
};
```

---

## 🎨 Customization

### Disable API

```tsx
<RAdaptiveSearch apiEnabled={false} />
```

### Custom Fuse.js Options

Edit `src/modules/adaptive-search/hooks/use-search-engine.ts`:

```typescript
const FUSE_OPTIONS: IFuseOptions<TSearchableItem> = {
  threshold: 0.3, // Lower = more strict
  keys: [
    { name: 'title', weight: 2 },
    { name: 'keywords', weight: 2 },
  ],
};
```

---

## 🧪 Testing

### Test Auto-Discovery

```bash
# Check console logs
[Adaptive Search] Collected 3 configs from 3 modules
[Adaptive Search] Collected 8 static actions
[Adaptive Search] Collected 3 API mappings
```

### Test API Integration

```typescript
// Mock API response
const mockData = {
  status: 'success',
  data: [
    { module: 'sample-form', id: '123', label: 'FAC-001', action: 'detail' },
  ],
  message: 'Success',
};
```

---

## 🔧 Troubleshooting

### Config not detected

- ✅ Check file name: `{module}.config.search.ts`
- ✅ Check location: `src/modules/{module}/`
- ✅ Check export: `export default { ... } satisfies TAdaptiveSearchConfig`

### API not working

- ✅ Check `apiEnabled={true}` prop
- ✅ Check API endpoint: `/api/search/adaptive`
- ✅ Check response format matches `TApiResponse<TApiSearchResultItem[]>`
- ✅ Check module has `apiMapping` in config

### Items not showing

- ✅ Check user permissions
- ✅ Check module feature flags
- ✅ Check console for errors

---

## 📊 Performance

- **Auto-discovery**: Zero runtime cost (Vite resolves at build time)
- **API calls**: Debounced 300ms, cached 30s
- **Search**: Fuse.js with memoization
- **Storage**: Encrypted localStorage

---

## 🎓 Examples

See complete example:

- Config: `src/modules/sample-form/sample-form.config.search.ts`
- Usage: `src/modules/app/components/layouts/app-layout.tsx`

---

## 📦 Dependencies

- `fuse.js` - Fuzzy search
- `react-query-kit` - API integration
- `zustand` - State management
- `crypto-js` - Encryption (via app utils)

---

## 🚀 Migration from Global Search

1. Rename files: `*.config.global-search.ts` → `*.config.search.ts`
2. Update imports: `@/modules/app/components/extensions/global-search` → `@/modules/adaptive-search`
3. Update types: Add `T` prefix to all types
4. Update store: `useGlobalSearchStore` → `useAdaptiveSearchStore`
5. Remove feature flag: Delete `roketinConfig.search.enableSearchGlobal`

---

**Built with ❤️ for modular, reusable architecture**
