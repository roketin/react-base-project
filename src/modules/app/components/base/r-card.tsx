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

type TRCardProps = {
  header?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  wrapperClassName?: string;
};

export const RCard: React.FC<TRCardProps> = ({
  header,
  title,
  description,
  action,
  children,
  footer,
  wrapperClassName,
}) => (
  <Card className={wrapperClassName}>
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
