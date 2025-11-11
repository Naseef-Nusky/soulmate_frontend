# Production Environment (Frontend)

Create a `.env.production` file in this folder with:

```
VITE_API_BASE_URL=https://api.your-domain.com
```

Then build and deploy:

```
npm run build
```

If you are serving the frontend and backend under the same domain with an Nginx `/api` proxy, you can omit `VITE_API_BASE_URL` and the app will call relative `/api` URLs.




