#!/usr/bin/env node

/**
 * Roketin Components MCP Server
 *
 * A Model Context Protocol server that provides:
 * - Component catalog and documentation
 * - Code snippets for component usage
 * - Component scaffolding helpers
 * - Style variant information
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_PATH = path.join(
  PROJECT_ROOT,
  'src/modules/app/components/base'
);

// ============================================================================
// Component Catalog
// ============================================================================

const COMPONENT_CATALOG = {
  // Buttons
  'r-btn': {
    name: 'RBtn',
    file: 'r-btn.tsx',
    category: 'Buttons',
    description: 'Primary button component with variants and sizes',
    props: [
      { name: 'variant', type: "'default' | 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'outline'", default: 'default' },
      { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg' | 'icon'", default: 'default' },
      { name: 'loading', type: 'boolean', default: 'false' },
      { name: 'disabled', type: 'boolean', default: 'false' },
      { name: 'asChild', type: 'boolean', default: 'false' },
    ],
    example: `import { RBtn } from '@/modules/app/components/base/r-btn';

<RBtn variant="primary" size="lg" onClick={handleClick}>
  Submit
</RBtn>

<RBtn variant="destructive" loading={isLoading}>
  Delete
</RBtn>

<RBtn variant="ghost" size="icon">
  <Icon />
</RBtn>`,
  },

  'r-input': {
    name: 'RInput',
    file: 'r-input.tsx',
    category: 'Forms',
    description: 'Text input component with prefix/suffix slots and error state',
    props: [
      { name: 'prefix', type: 'ReactNode', description: 'Content before input' },
      { name: 'suffix', type: 'ReactNode', description: 'Content after input' },
      { name: 'error', type: 'boolean | string', description: 'Error state or message' },
      { name: 'size', type: "'sm' | 'default' | 'lg'", default: 'default' },
    ],
    example: `import { RInput } from '@/modules/app/components/base/r-input';
import { Search, Mail } from 'lucide-react';

<RInput placeholder="Search..." prefix={<Search size={16} />} />

<RInput
  type="email"
  placeholder="Email"
  suffix={<Mail size={16} />}
  error="Invalid email format"
/>`,
  },

  'r-select': {
    name: 'RSelect',
    file: 'r-select.tsx',
    category: 'Forms',
    description: 'Select dropdown with search, multi-select, and async loading',
    props: [
      { name: 'options', type: 'TSelectOption[]', description: 'Array of options' },
      { name: 'value', type: 'string | string[]', description: 'Selected value(s)' },
      { name: 'onChange', type: '(value) => void', description: 'Change handler' },
      { name: 'multiple', type: 'boolean', default: 'false' },
      { name: 'searchable', type: 'boolean', default: 'false' },
      { name: 'placeholder', type: 'string' },
      { name: 'loading', type: 'boolean', default: 'false' },
    ],
    example: `import { RSelect } from '@/modules/app/components/base/r-select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

<RSelect
  options={options}
  value={selected}
  onChange={setSelected}
  placeholder="Select an option"
  searchable
/>

<RSelect
  options={options}
  value={multiSelected}
  onChange={setMultiSelected}
  multiple
/>`,
  },

  'r-data-table': {
    name: 'RDataTable',
    file: 'r-data-table.tsx',
    category: 'Data Display',
    description: 'Feature-rich data table with sorting, pagination, and selection',
    props: [
      { name: 'columns', type: 'ColumnDef[]', description: 'TanStack Table column definitions' },
      { name: 'data', type: 'T[]', description: 'Data array' },
      { name: 'pagination', type: 'TPaginationMeta', description: 'Pagination config' },
      { name: 'isLoading', type: 'boolean', default: 'false' },
      { name: 'onRowClick', type: '(row) => void', description: 'Row click handler' },
      { name: 'selectable', type: 'boolean', default: 'false' },
    ],
    example: `import { RDataTable } from '@/modules/app/components/base/r-data-table';
import { createColumnBuilder } from '@/modules/app/libs/table-column-builder';

const columnBuilder = createColumnBuilder<TUser>();

const columns = [
  columnBuilder.accessor('name', { header: 'Name' }),
  columnBuilder.accessor('email', { header: 'Email' }),
  columnBuilder.actions({
    onEdit: (row) => handleEdit(row),
    onDelete: (row) => handleDelete(row),
  }),
];

<RDataTable
  columns={columns}
  data={users}
  pagination={pagination}
  isLoading={isLoading}
/>`,
  },

  'r-form': {
    name: 'RForm',
    file: 'r-form.tsx',
    category: 'Forms',
    description: 'Form wrapper with React Hook Form integration',
    props: [
      { name: 'form', type: 'UseFormReturn', description: 'React Hook Form instance' },
      { name: 'onSubmit', type: '(data) => void', description: 'Submit handler' },
    ],
    example: `import { RForm, RFormField } from '@/modules/app/components/base';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

function MyForm() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  return (
    <RForm form={form} onSubmit={handleSubmit}>
      <RFormField
        control={form.control}
        name="name"
        label="Name"
        render={({ field }) => <RInput {...field} />}
      />
      <RFormField
        control={form.control}
        name="email"
        label="Email"
        render={({ field }) => <RInput {...field} type="email" />}
      />
      <RBtn type="submit">Submit</RBtn>
    </RForm>
  );
}`,
  },

  'r-form-field': {
    name: 'RFormField',
    file: 'r-form-field.tsx',
    category: 'Forms',
    description: 'Form field wrapper with label, description, and error display',
    props: [
      { name: 'control', type: 'Control', description: 'React Hook Form control' },
      { name: 'name', type: 'string', description: 'Field name' },
      { name: 'label', type: 'string | ReactNode', description: 'Field label' },
      { name: 'description', type: 'string', description: 'Helper text' },
      { name: 'required', type: 'boolean', default: 'false' },
      { name: 'render', type: '(field) => ReactNode', description: 'Render function' },
    ],
    example: `import { RFormField } from '@/modules/app/components/base/r-form-field';

<RFormField
  control={form.control}
  name="username"
  label="Username"
  description="Enter your unique username"
  required
  render={({ field }) => (
    <RInput {...field} placeholder="johndoe" />
  )}
/>`,
  },

  'r-dialog': {
    name: 'RDialog',
    file: 'r-dialog.tsx',
    category: 'Feedback',
    description: 'Modal dialog component',
    props: [
      { name: 'open', type: 'boolean', description: 'Open state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'State change handler' },
      { name: 'title', type: 'string', description: 'Dialog title' },
      { name: 'description', type: 'string', description: 'Dialog description' },
    ],
    example: `import { RDialog, RDialogTrigger, RDialogContent, RDialogHeader, RDialogTitle } from '@/modules/app/components/base/r-dialog';

<RDialog open={isOpen} onOpenChange={setIsOpen}>
  <RDialogTrigger asChild>
    <RBtn>Open Dialog</RBtn>
  </RDialogTrigger>
  <RDialogContent>
    <RDialogHeader>
      <RDialogTitle>Confirm Action</RDialogTitle>
    </RDialogHeader>
    <p>Are you sure you want to proceed?</p>
    <div className="flex gap-2 justify-end">
      <RBtn variant="ghost" onClick={() => setIsOpen(false)}>Cancel</RBtn>
      <RBtn variant="primary" onClick={handleConfirm}>Confirm</RBtn>
    </div>
  </RDialogContent>
</RDialog>`,
  },

  'r-card': {
    name: 'RCard',
    file: 'r-card.tsx',
    category: 'Layout',
    description: 'Card container component',
    props: [
      { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],
    example: `import { RCard } from '@/modules/app/components/base/r-card';

<RCard className="p-6">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-muted-foreground">Card content goes here.</p>
</RCard>`,
  },

  'r-tabs': {
    name: 'RTabs',
    file: 'r-tabs.tsx',
    category: 'Layout',
    description: 'Tabbed content component',
    props: [
      { name: 'defaultValue', type: 'string', description: 'Default active tab' },
      { name: 'value', type: 'string', description: 'Controlled active tab' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Tab change handler' },
    ],
    example: `import { RTabs, RTabsList, RTabsTrigger, RTabsContent } from '@/modules/app/components/base/r-tabs';

<RTabs defaultValue="tab1">
  <RTabsList>
    <RTabsTrigger value="tab1">Tab 1</RTabsTrigger>
    <RTabsTrigger value="tab2">Tab 2</RTabsTrigger>
  </RTabsList>
  <RTabsContent value="tab1">
    Content for Tab 1
  </RTabsContent>
  <RTabsContent value="tab2">
    Content for Tab 2
  </RTabsContent>
</RTabs>`,
  },

  'r-tooltip': {
    name: 'RTooltip',
    file: 'r-tooltip.tsx',
    category: 'Feedback',
    description: 'Tooltip component for additional information',
    props: [
      { name: 'content', type: 'ReactNode', description: 'Tooltip content' },
      { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: 'top' },
      { name: 'delayDuration', type: 'number', default: '200' },
    ],
    example: `import { RTooltip, RTooltipTrigger, RTooltipContent } from '@/modules/app/components/base/r-tooltip';

<RTooltip>
  <RTooltipTrigger asChild>
    <RBtn variant="ghost" size="icon">
      <InfoIcon />
    </RBtn>
  </RTooltipTrigger>
  <RTooltipContent>
    This is helpful information
  </RTooltipContent>
</RTooltip>`,
  },

  'r-checkbox': {
    name: 'RCheckbox',
    file: 'r-checkbox.tsx',
    category: 'Forms',
    description: 'Checkbox input component',
    props: [
      { name: 'checked', type: 'boolean', description: 'Checked state' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Change handler' },
      { name: 'label', type: 'string | ReactNode', description: 'Checkbox label' },
      { name: 'disabled', type: 'boolean', default: 'false' },
    ],
    example: `import { RCheckbox } from '@/modules/app/components/base/r-checkbox';

<RCheckbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
  label="I agree to the terms"
/>`,
  },

  'r-switch': {
    name: 'RSwitch',
    file: 'r-switch.tsx',
    category: 'Forms',
    description: 'Toggle switch component',
    props: [
      { name: 'checked', type: 'boolean', description: 'Checked state' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Change handler' },
      { name: 'disabled', type: 'boolean', default: 'false' },
    ],
    example: `import { RSwitch } from '@/modules/app/components/base/r-switch';

<div className="flex items-center gap-2">
  <RSwitch
    checked={isEnabled}
    onCheckedChange={setIsEnabled}
  />
  <span>Enable notifications</span>
</div>`,
  },

  'r-alert': {
    name: 'RAlert',
    file: 'r-alert.tsx',
    category: 'Feedback',
    description: 'Alert banner component for messages',
    props: [
      { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'destructive'", default: 'default' },
      { name: 'title', type: 'string', description: 'Alert title' },
      { name: 'icon', type: 'LucideIcon', description: 'Custom icon' },
    ],
    example: `import { RAlert, RAlertTitle, RAlertDescription } from '@/modules/app/components/base/r-alert';
import { AlertCircle } from 'lucide-react';

<RAlert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <RAlertTitle>Error</RAlertTitle>
  <RAlertDescription>
    Something went wrong. Please try again.
  </RAlertDescription>
</RAlert>

<RAlert variant="success">
  <RAlertTitle>Success!</RAlertTitle>
  <RAlertDescription>Your changes have been saved.</RAlertDescription>
</RAlert>`,
  },

  'r-badge': {
    name: 'RBadge',
    file: 'r-badge.tsx',
    category: 'Data Display',
    description: 'Badge/tag component for labels and status',
    props: [
      { name: 'variant', type: "'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'", default: 'default' },
    ],
    example: `import { RBadge } from '@/modules/app/components/base/r-badge';

<RBadge>Default</RBadge>
<RBadge variant="success">Active</RBadge>
<RBadge variant="warning">Pending</RBadge>
<RBadge variant="destructive">Error</RBadge>`,
  },

  'r-skeleton': {
    name: 'RSkeleton',
    file: 'r-skeleton.tsx',
    category: 'Utilities',
    description: 'Loading skeleton placeholder',
    props: [
      { name: 'className', type: 'string', description: 'Size and shape via Tailwind' },
    ],
    example: `import { RSkeleton } from '@/modules/app/components/base/r-skeleton';

// Loading state
<div className="space-y-2">
  <RSkeleton className="h-4 w-[250px]" />
  <RSkeleton className="h-4 w-[200px]" />
  <RSkeleton className="h-8 w-full" />
</div>

// Avatar skeleton
<RSkeleton className="h-12 w-12 rounded-full" />`,
  },

  'r-file-uploader': {
    name: 'RFileUploader',
    file: 'r-file-uploader.tsx',
    category: 'Forms',
    description: 'File upload component with drag-and-drop and preview',
    props: [
      { name: 'accept', type: 'string', description: 'Accepted file types' },
      { name: 'maxSize', type: 'number', description: 'Max file size in bytes' },
      { name: 'multiple', type: 'boolean', default: 'false' },
      { name: 'onUpload', type: '(files: File[]) => void', description: 'Upload handler' },
    ],
    example: `import { RFileUploader } from '@/modules/app/components/base/r-file-uploader';

<RFileUploader
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple
  onUpload={handleUpload}
/>`,
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function getAllComponents() {
  return Object.entries(COMPONENT_CATALOG).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

function getComponentsByCategory() {
  const components = getAllComponents();
  const categories = {};

  components.forEach((component) => {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  });

  return categories;
}

function searchComponents(query) {
  const q = query.toLowerCase();
  return getAllComponents().filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
}

function getComponentCode(componentId) {
  const filePath = path.join(
    COMPONENTS_PATH,
    COMPONENT_CATALOG[componentId]?.file || ''
  );

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return null;
}

// ============================================================================
// MCP Server
// ============================================================================

const server = new Server(
  {
    name: 'roketin-components-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Resources: Component catalog and documentation
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const components = getAllComponents();

  return {
    resources: [
      {
        uri: 'components://catalog',
        name: 'Component Catalog',
        description: 'Full list of available Roketin components',
        mimeType: 'application/json',
      },
      {
        uri: 'components://categories',
        name: 'Components by Category',
        description: 'Components organized by category',
        mimeType: 'application/json',
      },
      ...components.map((c) => ({
        uri: `components://${c.id}`,
        name: c.name,
        description: c.description,
        mimeType: 'application/json',
      })),
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'components://catalog') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(getAllComponents(), null, 2),
        },
      ],
    };
  }

  if (uri === 'components://categories') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(getComponentsByCategory(), null, 2),
        },
      ],
    };
  }

  const componentId = uri.replace('components://', '');
  const component = COMPONENT_CATALOG[componentId];

  if (component) {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(component, null, 2),
        },
      ],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description:
          'List all available Roketin components with their categories and descriptions',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description:
                'Filter by category: Buttons, Forms, Data Display, Layout, Feedback, Navigation, Media, Utilities, Branding',
            },
          },
        },
      },
      {
        name: 'get_component',
        description:
          'Get detailed information about a specific component including props, description, and usage examples',
        inputSchema: {
          type: 'object',
          properties: {
            componentId: {
              type: 'string',
              description:
                'Component ID (e.g., r-btn, r-input, r-data-table)',
            },
          },
          required: ['componentId'],
        },
      },
      {
        name: 'search_components',
        description: 'Search components by name, description, or category',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_component_example',
        description: 'Get usage example code for a specific component',
        inputSchema: {
          type: 'object',
          properties: {
            componentId: {
              type: 'string',
              description: 'Component ID',
            },
          },
          required: ['componentId'],
        },
      },
      {
        name: 'get_component_source',
        description:
          'Get the source code of a component file (if available)',
        inputSchema: {
          type: 'object',
          properties: {
            componentId: {
              type: 'string',
              description: 'Component ID',
            },
          },
          required: ['componentId'],
        },
      },
      {
        name: 'generate_form_snippet',
        description:
          'Generate a React Hook Form snippet with Roketin components',
        inputSchema: {
          type: 'object',
          properties: {
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Field name' },
                  type: {
                    type: 'string',
                    enum: [
                      'text',
                      'email',
                      'password',
                      'number',
                      'textarea',
                      'select',
                      'checkbox',
                      'switch',
                      'date',
                      'file',
                    ],
                    description: 'Field type',
                  },
                  label: { type: 'string', description: 'Field label' },
                  required: { type: 'boolean', description: 'Is required' },
                  options: {
                    type: 'array',
                    items: { type: 'object' },
                    description: 'Options for select fields',
                  },
                },
                required: ['name', 'type', 'label'],
              },
              description: 'Form fields configuration',
            },
            formName: {
              type: 'string',
              description: 'Name for the form component',
            },
          },
          required: ['fields', 'formName'],
        },
      },
      {
        name: 'generate_table_snippet',
        description: 'Generate a data table snippet with column definitions',
        inputSchema: {
          type: 'object',
          properties: {
            columns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string', description: 'Column key' },
                  header: { type: 'string', description: 'Column header' },
                  type: {
                    type: 'string',
                    enum: ['text', 'number', 'date', 'badge', 'actions'],
                    description: 'Column type',
                  },
                },
                required: ['key', 'header'],
              },
              description: 'Column definitions',
            },
            dataType: {
              type: 'string',
              description: 'TypeScript type name for data rows',
            },
          },
          required: ['columns', 'dataType'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'list_components': {
      let components = getAllComponents();
      if (args?.category) {
        components = components.filter(
          (c) => c.category.toLowerCase() === args.category.toLowerCase()
        );
      }

      const result = components.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        file: c.file,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'get_component': {
      const component = COMPONENT_CATALOG[args.componentId];
      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component not found: ${args.componentId}. Use list_components to see available components.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(component, null, 2),
          },
        ],
      };
    }

    case 'search_components': {
      const results = searchComponents(args.query);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              results.map((c) => ({
                id: c.id,
                name: c.name,
                category: c.category,
                description: c.description,
              })),
              null,
              2
            ),
          },
        ],
      };
    }

    case 'get_component_example': {
      const component = COMPONENT_CATALOG[args.componentId];
      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component not found: ${args.componentId}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `# ${component.name} Example\n\n\`\`\`tsx\n${component.example}\n\`\`\``,
          },
        ],
      };
    }

    case 'get_component_source': {
      const code = getComponentCode(args.componentId);
      if (!code) {
        return {
          content: [
            {
              type: 'text',
              text: `Source code not found for: ${args.componentId}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `\`\`\`tsx\n${code}\n\`\`\``,
          },
        ],
      };
    }

    case 'generate_form_snippet': {
      const { fields, formName } = args;
      const pascalName = formName.charAt(0).toUpperCase() + formName.slice(1);

      const imports = new Set([
        "import { useForm } from 'react-hook-form';",
        "import { yupResolver } from '@hookform/resolvers/yup';",
        "import * as yup from 'yup';",
        "import { RForm, RFormField } from '@/modules/app/components/base/r-form';",
        "import { RBtn } from '@/modules/app/components/base/r-btn';",
      ]);

      const componentImports = [];
      fields.forEach((field) => {
        switch (field.type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
            componentImports.push('RInput');
            break;
          case 'textarea':
            componentImports.push('RTextarea');
            break;
          case 'select':
            componentImports.push('RSelect');
            break;
          case 'checkbox':
            componentImports.push('RCheckbox');
            break;
          case 'switch':
            componentImports.push('RSwitch');
            break;
          case 'date':
            componentImports.push('RPicker');
            break;
          case 'file':
            componentImports.push('RFileUploader');
            break;
        }
      });

      const uniqueImports = [...new Set(componentImports)];
      if (uniqueImports.length > 0) {
        imports.add(
          `import { ${uniqueImports.join(', ')} } from '@/modules/app/components/base';`
        );
      }

      // Generate schema
      const schemaFields = fields
        .map((f) => {
          let validator = 'yup.string()';
          switch (f.type) {
            case 'email':
              validator = 'yup.string().email()';
              break;
            case 'number':
              validator = 'yup.number()';
              break;
            case 'checkbox':
            case 'switch':
              validator = 'yup.boolean()';
              break;
            case 'date':
              validator = 'yup.date()';
              break;
          }
          if (f.required) validator += '.required()';
          return `  ${f.name}: ${validator},`;
        })
        .join('\n');

      // Generate default values
      const defaultValues = fields
        .map((f) => {
          let defaultVal = "''";
          switch (f.type) {
            case 'number':
              defaultVal = '0';
              break;
            case 'checkbox':
            case 'switch':
              defaultVal = 'false';
              break;
            case 'select':
              defaultVal = 'null';
              break;
          }
          return `    ${f.name}: ${defaultVal},`;
        })
        .join('\n');

      // Generate fields JSX
      const fieldsJsx = fields
        .map((f) => {
          let input = '';
          switch (f.type) {
            case 'text':
              input = `<RInput {...field} placeholder="Enter ${f.label.toLowerCase()}" />`;
              break;
            case 'email':
              input = `<RInput {...field} type="email" placeholder="Enter email" />`;
              break;
            case 'password':
              input = `<RInput {...field} type="password" placeholder="Enter password" />`;
              break;
            case 'number':
              input = `<RInputNumber {...field} placeholder="Enter ${f.label.toLowerCase()}" />`;
              break;
            case 'textarea':
              input = `<RTextarea {...field} placeholder="Enter ${f.label.toLowerCase()}" />`;
              break;
            case 'select':
              input = `<RSelect {...field} options={[]} placeholder="Select ${f.label.toLowerCase()}" />`;
              break;
            case 'checkbox':
              input = `<RCheckbox {...field} label="${f.label}" />`;
              break;
            case 'switch':
              input = `<RSwitch {...field} />`;
              break;
            case 'date':
              input = `<RPicker {...field} />`;
              break;
            case 'file':
              input = `<RFileUploader {...field} />`;
              break;
            default:
              input = `<RInput {...field} />`;
          }

          return `      <RFormField
        control={form.control}
        name="${f.name}"
        label="${f.label}"
        ${f.required ? 'required' : ''}
        render={({ field }) => (
          ${input}
        )}
      />`;
        })
        .join('\n\n');

      const snippet = `${[...imports].join('\n')}

const schema = yup.object({
${schemaFields}
});

type T${pascalName}FormData = yup.InferType<typeof schema>;

export function ${pascalName}Form({ onSubmit }: { onSubmit: (data: T${pascalName}FormData) => void }) {
  const form = useForm<T${pascalName}FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
${defaultValues}
    },
  });

  return (
    <RForm form={form} onSubmit={onSubmit}>
${fieldsJsx}

      <div className="flex justify-end gap-2 mt-4">
        <RBtn type="button" variant="ghost" onClick={() => form.reset()}>
          Reset
        </RBtn>
        <RBtn type="submit" variant="primary">
          Submit
        </RBtn>
      </div>
    </RForm>
  );
}`;

      return {
        content: [
          {
            type: 'text',
            text: `\`\`\`tsx\n${snippet}\n\`\`\``,
          },
        ],
      };
    }

    case 'generate_table_snippet': {
      const { columns, dataType } = args;

      const columnDefs = columns
        .map((col) => {
          if (col.type === 'actions') {
            return `  columnBuilder.actions({
    onView: (row) => handleView(row),
    onEdit: (row) => handleEdit(row),
    onDelete: (row) => handleDelete(row),
  }),`;
          }

          if (col.type === 'badge') {
            return `  columnBuilder.accessor('${col.key}', {
    header: '${col.header}',
    cell: ({ row }) => (
      <RBadge variant={row.original.${col.key} ? 'success' : 'secondary'}>
        {row.original.${col.key}}
      </RBadge>
    ),
  }),`;
          }

          if (col.type === 'date') {
            return `  columnBuilder.accessor('${col.key}', {
    header: '${col.header}',
    cell: ({ row }) => dayjs(row.original.${col.key}).format('DD MMM YYYY'),
  }),`;
          }

          return `  columnBuilder.accessor('${col.key}', { header: '${col.header}' }),`;
        })
        .join('\n');

      const snippet = `import { RDataTable } from '@/modules/app/components/base/r-data-table';
import { RBadge } from '@/modules/app/components/base/r-badge';
import { createColumnBuilder } from '@/modules/app/libs/table-column-builder';
import dayjs from 'dayjs';

type ${dataType} = {
  id: string;
${columns.filter(c => c.type !== 'actions').map(c => `  ${c.key}: ${c.type === 'number' ? 'number' : c.type === 'date' ? 'Date | string' : 'string'};`).join('\n')}
};

const columnBuilder = createColumnBuilder<${dataType}>();

const columns = [
${columnDefs}
];

export function ${dataType}Table({
  data,
  pagination,
  isLoading,
  onRowClick,
}: {
  data: ${dataType}[];
  pagination?: TPaginationMeta;
  isLoading?: boolean;
  onRowClick?: (row: ${dataType}) => void;
}) {
  return (
    <RDataTable
      columns={columns}
      data={data}
      pagination={pagination}
      isLoading={isLoading}
      onRowClick={onRowClick}
    />
  );
}`;

      return {
        content: [
          {
            type: 'text',
            text: `\`\`\`tsx\n${snippet}\n\`\`\``,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Roketin Components MCP server running on stdio');
}

main().catch(console.error);
