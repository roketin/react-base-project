import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, appFormatCurrency, appFormatDate } from '@/modules/app/libs/utils';
import { linkTo } from '@/modules/app/hooks/use-named-route';
export {
  appFormatDate,
  appFormatCurrency,
  tableDate,
  tableCurrency,
} from '@/modules/app/libs/utils';

type TableLinkOptions = {
  href?: string;
  path?: string;
  routeName?: string;
  routeParams?: Record<string, string>;
  routeQuery?: Record<string, string | number | boolean>;
  className?: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  icon?: React.ReactNode;
  autoExternal?: boolean;
};

// Helper to render a table cell as a link with a consistent look.
// Falls back to plain text when href is not provided.
export function tableCellLink(
  label: React.ReactNode,
  {
    href,
    path,
    routeName,
    routeParams,
    routeQuery,
    className,
    target,
    rel,
    icon,
    autoExternal = true,
  }: TableLinkOptions,
) {
  let finalHref = href ?? path;
  let routeLink:
    | { pathname: string; search?: string; replace?: boolean }
    | undefined;

  if (routeName) {
    routeLink = linkTo(routeName, routeParams ?? {}, { query: routeQuery });
    finalHref = `${routeLink.pathname}${routeLink.search ?? ''}`;
  }

  if (!finalHref) return label ?? '-';

  const isExternal =
    autoExternal && /^https?:\/\//i.test(finalHref)
      ? true
      : target === '_blank';

  const content = (
    <a
      href={finalHref}
      target={target ?? (isExternal ? '_blank' : '_self')}
      rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
      className={cn(
        'inline-flex items-center gap-1 text-primary hover:underline',
        className,
      )}
    >
      {label}
      {icon ?? <ArrowUpRight className='h-3 w-3' aria-hidden='true' />}
    </a>
  );

  if (isExternal) return content;

  const internalTo =
    (routeLink ?? finalHref)
      ? typeof finalHref === 'string'
        ? finalHref
        : routeLink
      : undefined;

  if (!internalTo) return label ?? '-';

  return (
    <Link
      to={internalTo}
      className={cn(
        'inline-flex items-center gap-1 text-primary hover:underline',
        className,
      )}
    >
      {label}
      {icon ?? <ArrowUpRight className='h-3 w-3' aria-hidden='true' />}
    </Link>
  );
}

// Thin wrappers to keep table helpers self-contained but reuse global formatters
export const tableDateCell = appFormatDate;
export const tableCurrencyCell = appFormatCurrency;
