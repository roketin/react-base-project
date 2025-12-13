import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
} from '../r-navigation-menu';
import {
  Layers,
  Palette,
  Zap,
  Shield,
  Code,
  Database,
  Cloud,
  Settings,
  Users,
  BarChart,
} from 'lucide-react';

const meta: Meta = {
  title: 'Components/Navigation/RNavigationMenu',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 w-[400px]'>
              <ListItem
                href='#'
                title='Introduction'
                icon={<Layers className='h-4 w-4' />}
              >
                Learn the basics and get up and running quickly.
              </ListItem>
              <ListItem
                href='#'
                title='Installation'
                icon={<Code className='h-4 w-4' />}
              >
                Step-by-step guide to install and configure.
              </ListItem>
              <ListItem
                href='#'
                title='Quick Start'
                icon={<Zap className='h-4 w-4' />}
              >
                Build your first project in minutes.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[500px] gap-3 p-4 md:grid-cols-2'>
              <ListItem
                href='#'
                title='Buttons'
                icon={<Palette className='h-4 w-4' />}
              >
                Interactive button components with variants.
              </ListItem>
              <ListItem
                href='#'
                title='Forms'
                icon={<Settings className='h-4 w-4' />}
              >
                Form inputs, selects, and validation.
              </ListItem>
              <ListItem
                href='#'
                title='Data Display'
                icon={<BarChart className='h-4 w-4' />}
              >
                Tables, lists, and data visualization.
              </ListItem>
              <ListItem
                href='#'
                title='Feedback'
                icon={<Shield className='h-4 w-4' />}
              >
                Alerts, toasts, and notifications.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href='#' className='px-4 py-2'>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const MegaMenu: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='grid gap-4 p-6 w-[600px] md:grid-cols-3'>
              <div className='space-y-3'>
                <h4 className='text-sm font-semibold text-muted-foreground'>
                  Platform
                </h4>
                <ul className='space-y-2'>
                  <ListItem
                    href='#'
                    title='Analytics'
                    icon={<BarChart className='h-4 w-4' />}
                  >
                    Track and analyze data
                  </ListItem>
                  <ListItem
                    href='#'
                    title='Database'
                    icon={<Database className='h-4 w-4' />}
                  >
                    Managed database service
                  </ListItem>
                  <ListItem
                    href='#'
                    title='Cloud'
                    icon={<Cloud className='h-4 w-4' />}
                  >
                    Cloud infrastructure
                  </ListItem>
                </ul>
              </div>
              <div className='space-y-3'>
                <h4 className='text-sm font-semibold text-muted-foreground'>
                  Solutions
                </h4>
                <ul className='space-y-2'>
                  <ListItem
                    href='#'
                    title='Enterprise'
                    icon={<Shield className='h-4 w-4' />}
                  >
                    For large organizations
                  </ListItem>
                  <ListItem
                    href='#'
                    title='Startups'
                    icon={<Zap className='h-4 w-4' />}
                  >
                    For growing companies
                  </ListItem>
                  <ListItem
                    href='#'
                    title='Teams'
                    icon={<Users className='h-4 w-4' />}
                  >
                    For collaborative work
                  </ListItem>
                </ul>
              </div>
              <div className='rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4'>
                <h4 className='font-semibold'>New Feature</h4>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Check out our latest AI-powered analytics dashboard.
                </p>
                <a
                  href='#'
                  className='mt-3 inline-block text-sm font-medium text-primary hover:underline'
                >
                  Learn more →
                </a>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[400px] gap-3 p-4'>
              <ListItem href='#' title='Documentation'>
                Comprehensive guides and API reference.
              </ListItem>
              <ListItem href='#' title='Blog'>
                Latest news, tutorials, and updates.
              </ListItem>
              <ListItem href='#' title='Community'>
                Join our Discord and GitHub discussions.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href='#' className='px-4 py-2'>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const SimpleNav: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList className='gap-2'>
        <NavigationMenuItem>
          <NavigationMenuLink href='#' className='px-4 py-2 font-medium'>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href='#' className='px-4 py-2'>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href='#' className='px-4 py-2'>
            Services
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href='#' className='px-4 py-2'>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const WithFeaturedContent: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='grid gap-3 p-4 w-[550px] md:grid-cols-[1fr_200px]'>
              <ul className='space-y-3'>
                <ListItem
                  href='#'
                  title='Tutorials'
                  icon={<Code className='h-4 w-4' />}
                >
                  Step-by-step learning paths for all skill levels.
                </ListItem>
                <ListItem
                  href='#'
                  title='Examples'
                  icon={<Layers className='h-4 w-4' />}
                >
                  Real-world examples and starter templates.
                </ListItem>
                <ListItem
                  href='#'
                  title='API Reference'
                  icon={<Database className='h-4 w-4' />}
                >
                  Complete API documentation with examples.
                </ListItem>
              </ul>
              <div className='rounded-lg overflow-hidden'>
                <img
                  src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop'
                  alt='Code'
                  className='h-full w-full object-cover'
                />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
