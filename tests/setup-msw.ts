import { setupServer } from 'msw/node';
import { beforeAll, afterEach, afterAll } from 'vitest';

// definisikan handler default
export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
