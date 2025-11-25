# Global Search Integration Guide

## Overview

Global search mendukung dua tipe actions:

1. **Navigation Actions** - Redirect ke halaman dengan optional query params
2. **Command Actions** - Execute custom function (dialog, modal, dll)

## 1. Setup Module Config

### Navigation Action (dengan Query Params)

```typescript
import { Search } from 'lucide-react';
import { defineModuleConfig } from '@/modules/app/types/module-config.type';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { navigateToRoute } from '@/modules/app/libs/navigation-helper';
import { KEYWORDS_SEARCH } from '@/modules/app/constants/search-keywords.constant';

export const yourModuleConfig = defineModuleConfig({
  moduleId: 'your-module',
  actions: [
    {
      id: 'search-your-module',
      titleKey: 'yourModule:commands.search',
      badge: 'Search',
      icon: Search,
      keywords: [...KEYWORDS_SEARCH, 'your', 'module'],
      onExecute: () => {
        const query = useGlobalSearchStore.getState().currentQuery;
        navigateToRoute('YourModuleIndex', { keyword: query });
      },
    },
  ],
});
```

### Command Action (Dialog/Modal)

```typescript
import { User } from 'lucide-react';
import { KEYWORDS_PROFILE } from '@/modules/app/constants/search-keywords.constant';

export const yourModuleConfig = defineModuleConfig({
  moduleId: 'your-module',
  actions: [
    {
      id: 'open-dialog',
      titleKey: 'yourModule:commands.openDialog',
      badge: 'Dialog',
      icon: User,
      keywords: KEYWORDS_PROFILE,
      onExecute: () => {
        // Open dialog via store
        useYourDialogStore.getState().setOpen(true);
      },
    },
  ],
});
```

## 2. Integrate Query Params di Index Page

```typescript
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const YourModuleIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [qryParams, setQryParams] = useObjectState(DEFAULT_QUERY_PARAMS);

  // Clear URL params after reading
  useEffect(() => {
    if (initialKeyword) {
      setSearchParams({});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Use qryParams for API call
  const { data } = useGetYourModuleList(qryParams);

  return (
    <RDataTable
      initialSearch={initialKeyword}
      columns={columns}
      data={data?.data}
      onChange={setQryParams}
    />
  );
};
```

**Penjelasan:**

- `initialSearch` prop akan mengisi search box di header table
- Search box otomatis trigger API call dengan debounce 300ms
- URL params di-clear setelah dibaca untuk menghindari konfusi

## 3. Add Translation Keys

```json
// yourModule.en.json
{
  "commands": {
    "search": "Search Your Module"
  }
}

// yourModule.id.json
{
  "commands": {
    "search": "Cari Your Module"
  }
}
```

## 4. Reusable Keywords

Gunakan constants dari `@/modules/app/constants/search-keywords.constant`:

```typescript
import {
  KEYWORDS_CREATE,
  KEYWORDS_EDIT,
  KEYWORDS_DELETE,
  KEYWORDS_SEARCH,
  KEYWORDS_PROFILE,
  // ... dll
} from '@/modules/app/constants/search-keywords.constant';
```

Available keywords:

- `KEYWORDS_CREATE` - create, new, add, tambah, buat, baru
- `KEYWORDS_EDIT` - edit, update, modify, ubah, sunting
- `KEYWORDS_DELETE` - delete, remove, hapus
- `KEYWORDS_SEARCH` - search, find, cari, temukan
- `KEYWORDS_PROFILE` - profile, user, account, settings, profil, akun
- Dan lainnya... (lihat file constant)

## Example: Complete Integration

Lihat implementasi di:

- Config: `src/modules/sample-form/sample-form.config.ts`
- Index Page: `src/modules/sample-form/components/pages/sample-form.tsx`
