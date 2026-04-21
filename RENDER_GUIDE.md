# 🚀 Render Deployment Guide: Ecometa

This guide explains how to deploy your Ecometa application on **Render.com** with a separated architecture (Backend on one URL, Frontend on another).

---

## 🔗 Prerequisite: Split Environment Variables
Before following these steps, look at the templates I created in your project:
- [backend.env.example](file:///c:/Users/Admin/Desktop/Ecometa/deployment/backend.env.example)
- [frontend.env.example](file:///c:/Users/Admin/Desktop/Ecometa/deployment/frontend.env.example)

---

## Part 1: Deploying the Backend (Java Web Service)

1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** > **Web Service**.
3.  Connect your **GitHub repository**.
4.  Configure the service:
    - **Name**: `ecometa-backend`
    - **Runtime**: `Java`
    - **Build Command**: `./mvnw clean package -DskipTests`
    - **Start Command**: `java -jar backend/target/*.jar` (Ensure path matches your repo structure).
5.  Click **Advanced** > **Add Environment Variable**:
    - **Copy all variables** from [backend.env.example](file:///c:/Users/Admin/Desktop/Ecometa/deployment/backend.env.example) and fill in your real MongoDB and Gmail secrets.
6.  Click **Create Web Service**.

> [!NOTE]
> Once the backend starts, note down its URL (e.g., `https://ecometa-backend.onrender.com`). You will need this for the frontend.

---

## Part 2: Deploying the Frontend (Static Site)

1.  In Render Dashboard, click **New +** > **Static Site**.
2.  Connect the same **GitHub repository**.
3.  Configure the site:
    - **Name**: `ecometa-frontend`
    - **Build Command**: `npm run build`
    - **Publish Directory**: `frontend/build` (Ensure path matches your repo structure).
4.  Click **Advanced** > **Add Environment Variable**:
    - Add `REACT_APP_API_URL` and paste your **Backend URL** from Part 1.
5.  Click **Create Static Site**.

---

## Part 3: Connecting the Loop (Final Sync)

1.  Go back to your **Backend Service** settings on Render.
2.  Go to the **Environment** tab.
3.  Update the `FRONTEND_URL` variable with the URL of your new **Frontend Static Site**.
4.  Save changes. Render will automatically restart the backend.

---

## ⚠️ Important Troubleshooting

> [!WARNING]
> **Free Tier Sleep**: Since you are using the Free Tier, the backend will "spin down" after 15 minutes of inactivity. When you first visit the site, it may take 30-60 seconds to load while the server wakes up.

> [!TIP]
> **CORS Issues**: If you see "CORS" errors in the browser console, double-check that `FRONTEND_URL` in the backend exactly matches your Render frontend URL (no trailing slash).
