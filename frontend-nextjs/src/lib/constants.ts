// src/lib/constants.ts
export const APP_NAME = 'My Side Project of AIgents for Next.js';
export const APP_DESCRIPTION =
  'A Next.js side project with Mantine and Tailwind CSS';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;
