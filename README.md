# Fullstack App Deployment on Google Cloud Run

## Prerequisites

- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- Billing/project enabled for Cloud Run
- Node.js 20.x runtime
- Your Gemini API Key

## Deployment Steps

1. **Setup folder structure:**
    ```
    /your-app-root
      /public
        index.html
        ... (other static assets)
      server.js
      package.json
      Dockerfile
    ```

2. **Set your Gemini API key in Cloud Run:**
    - When deploying, pass `--set-env-vars=GEMINI_API_KEY=your_real_key`

3. **Deploy:**
    ```sh
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/guide-full-app
    gcloud run deploy guide-full-app \
      --image gcr.io/YOUR_PROJECT_ID/guide-full-app \
      --platform managed \
      --region YOUR_REGION \
      --allow-unauthenticated \
      --set-env-vars=GEMINI_API_KEY=your_real_key
    ```

4. **Access your app:**
    - Visit the Cloud Run URL provided after deployment.

---

## Notes

- All static files (e.g. `index.html`) are served from `/public`.
- The API is available at `/api/gemini`.
- In production, restrict CORS or use authentication as needed.
