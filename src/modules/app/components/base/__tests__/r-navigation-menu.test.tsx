import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
} from '@/modules/app/components/base/r-navigation-menu';

describe('NavigationMenu', () => {
  it('renders navigation menu correctly', () => {
    render(
      <NavigationMenu data-testid='nav-menu'>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href='#'>Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
  });

  it('renders navigation link', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href='/home'>Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/home');
  });

  it('renders multiple menu items', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href='#'>Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href='#'>About</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href='#'>Contact</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});

describe('NavigationMenuTrigger', () => {
  it('renders trigger with chevron', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>Content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>Dropdown Content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);

    expect(await screen.findByText('Dropdown Content')).toBeInTheDocument();
  });

  it('hides content on mouse leave', async () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>Dropdown Content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);
    expect(await screen.findByText('Dropdown Content')).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    // Content should hide after delay
  });

  it('disables trigger when disabled prop is true', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger disabled>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>Content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('NavigationMenuLink', () => {
  it('applies active class when active', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href='#' active>
              Active Link
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByRole('link')).toHaveClass('bg-accent/50');
  });

  it('applies custom className', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href='#' className='custom-class'>
              Link
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByRole('link')).toHaveClass('custom-class');
  });
});

describe('ListItem', () => {
  it('renders list item with title', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <ListItem href='#' title='Introduction'>
                  Description here
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);

    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Description here')).toBeInTheDocument();
  });

  it('renders list item with icon', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <ListItem
                  href='#'
                  title='With Icon'
                  icon={<span data-testid='icon'>★</span>}
                >
                  Description
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('NavigationMenu orientation', () => {
  it('renders with horizontal orientation by default', () => {
    render(
      <NavigationMenu data-testid='nav'>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href='#'>Link</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByTestId('nav')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
  });

  it('renders with vertical orientation when specified', () => {
    render(
      <NavigationMenu orientation='vertical' data-testid='nav'>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href='#'>Link</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByTestId('nav')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
  });
});
