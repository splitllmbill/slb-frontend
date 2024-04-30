// middleware/redirect.ts

import { rewrite } from '@vercel/edge';

export default function redirectMiddleware(request: Request) {
  // Read the backend URL from environment variables
  const backendURL = process.env.VITE_BACKEND_SERVER;

  // If backend URL is not defined, return original request
  if (!backendURL) {
    return request;
  }

  // Rewrite the request to the backend URL
  return rewrite(new URL(backendURL + request.url));
}