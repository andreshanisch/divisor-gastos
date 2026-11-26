import '@testing-library/jest-dom/vitest';

// Sin `globals`, Testing Library no limpia solo entre tests.
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
