import { rewrite } from '@vercel/edge';

export default function redirectMiddleware(request: Request) {
  // Read the backend URL from environment variables
  const backendURL = process.env.VITE_BACKEND_SERVER;

  // If backend URL is not defined or the request is not for the /api context, return original request
  if (!backendURL || !request.url.startsWith('/api')) {
    return request;
  }

  // Rewrite the request to the backend URL
  return rewrite(new URL(backendURL + request.url));
}