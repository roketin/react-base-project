import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/app/components/ui/card';
import React from 'react';

type TBaseCardProps = {
  header?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export const BaseCard: React.FC<TBaseCardProps> = ({
  header,
  title,
  description,
  action,
  children,
  footer,
}) => (
  <Card>
    {(header || title || description || action) && (
      <CardHeader>
        {header}
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
    )}
    {children && <CardContent>{children}</CardContent>}
    {footer && <CardFooter>{footer}</CardFooter>}
  </Card>
);
