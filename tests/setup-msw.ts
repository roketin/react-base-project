import type { TApiResponse } from '@/modules/app/types/api.type';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterEach, afterAll } from 'vitest';
import type {
  TAuthForgot,
  TAuthLoginResponse,
} from '@/modules/auth/types/auth.type';

const API_URL = import.meta.env.VITE_API_URL;

// definisikan handler default
export const server = setupServer(
  http.post(API_URL + '/auth/login', async () => {
    const response: TApiResponse<TAuthLoginResponse> = {
      status: 'ok',
      data: {
        access_token: 'dummy-token',
      },
      message: 'Login successfully',
    };
    return HttpResponse.json(response, { status: 200 });
  }),

  http.post(API_URL + '/auth/forgot', async ({ request }) => {
    const body = (await request.json()) as TAuthForgot;

    if (body.username === 'test@example.com') {
      const response: TApiResponse<null> = {
        status: 'ok',
        data: null,
        message: 'Email sent',
      };
      return HttpResponse.json(response, { status: 200 });
    }

    const errorResponse: TApiResponse<null> = {
      status: 'error',
      data: null,
      message: 'Error!',
    };
    return HttpResponse.json(errorResponse, { status: 400 });
  }),

  http.post(API_URL + '/auth/reset', async () => {
    const response: TApiResponse<null> = {
      status: 'ok',
      data: null,
      message: 'Reset successfully',
    };
    return HttpResponse.json(response, { status: 200 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
