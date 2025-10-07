import StatusPage from '@/modules/app/components/pages/status-page';
import Button from '@/modules/app/components/ui/button';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const FALLBACK_MESSAGE =
  'An unexpected error occurred. Please try again or contact support if the problem persists.';

function extractMessage(error: unknown): {
  code?: string;
  title: string;
  message: string;
} {
  if (isRouteErrorResponse(error)) {
    const data = error.data;
    if (typeof data === 'string' && data.trim().length > 0) {
      return {
        code: String(error.status),
        title: error.statusText || 'Something went wrong',
        message: data,
      };
    }

    if (data && typeof data === 'object' && 'message' in data) {
      const rawMessage = (data as { message?: unknown }).message;
      if (typeof rawMessage === 'string' && rawMessage.trim().length > 0) {
        return {
          code: String(error.status),
          title: error.statusText || 'Something went wrong',
          message: rawMessage,
        };
      }
    }

    return {
      code: String(error.status),
      title: error.statusText || 'Something went wrong',
      message: FALLBACK_MESSAGE,
    };
  }

  if (error instanceof Error) {
    return {
      title: error.name || 'Application Error',
      message: error.message || FALLBACK_MESSAGE,
    };
  }

  if (typeof error === 'string') {
    return {
      title: 'Application Error',
      message: error,
    };
  }

  if (error && typeof error === 'object') {
    try {
      return {
        title: 'Application Error',
        message: JSON.stringify(error),
      };
    } catch {
      // fallthrough
    }
  }

  return {
    title: 'Something went wrong',
    message: FALLBACK_MESSAGE,
  };
}

const AppGlobalError = () => {
  const routeError = useRouteError();
  const { code, title, message } = extractMessage(routeError);

  return (
    <StatusPage
      code={code ?? '500'}
      title={title}
      description={message}
      action={
        <Button onClick={() => window.location.reload()}>Try again</Button>
      }
    />
  );
};

export default AppGlobalError;
