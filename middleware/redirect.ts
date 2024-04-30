import { VercelRequest, VercelResponse } from '@vercel/node';

export default function redirectMiddleware(req: VercelRequest, res: VercelResponse, next: () => void) {
  // Read the backend URL from environment variables
  const backendURL = process.env.VITE_BACKEND_SERVER;
  // Check if req.url is defined
  if (req.url !== undefined) {
    // If the request is for the backend, redirect it to the backend URL
    if (req.url.startsWith('/api')) {
      // Modify the URL to point to the backend
      req.url = req.url.replace('/api', '');
      return res.status(307).send({ "Location": `${backendURL}${req.url}` });
    }
  }

  // If the request is not for the backend or req.url is undefined, continue to the next middleware
  return next();
};