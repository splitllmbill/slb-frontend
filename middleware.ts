import { rewrite } from '@vercel/edge';

export default function redirectMiddleware(request: Request) {
  // Read the backend URL from environment variables
  const backendURL = process.env.VITE_BACKEND_SERVER;
  const backendURL2 = import.meta.env.VITE_BACKEND_SERVER;
  console.log(backendURL);
  console.log(backendURL2);
  console.log(request.url);
  // If backend URL is not defined or the request is not for the /api context, return original request
  if (!backendURL || !request.url.startsWith('/api')) {
    return rewrite(new URL(request.url));
  }
  console.log(new URL(backendURL + request.url));
  // Rewrite the request to the backend URL
  return rewrite(new URL(backendURL + request.url));
}