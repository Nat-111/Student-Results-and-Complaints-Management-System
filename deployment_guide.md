# Deployment Guide: UPSA Student Results & Complaints Management System

This guide outlines the steps to take your application from your local machine to a live production environment.

## Phase 1: Prepare the Code for Production

### 1. Backend (Django)
You need to make the backend ready for a live server.
* **Environment Variables**: Never hardcode secrets. Create a `.env` file (which you already have) but ensure it's not committed to Git.
* **Requirements**: Ensure all packages are listed.
  ```bash
  pip freeze > requirements.txt
  ```
* **WSGI Server**: Use `gunicorn` for production.
  ```bash
  pip install gunicorn
  ```
* **Static Files**: Add `whitenoise` to handle static files in production.
  ```bash
  pip install whitenoise
  ```
  Update `MIDDLEWARE` in `settings.py`:
  ```python
  'whitenoise.middleware.WhiteNoiseMiddleware',
  ```

### 2. Frontend (React/Vite)
* **API URL**: Ensure your frontend points to the *deployed* backend URL, not `localhost`.
* Update your `.env.production` file:
  ```env
  VITE_API_URL=https://your-backend-name.onrender.com/api
  ```

---

## Phase 2: Version Control (GitHub)

1. **Initialize Git**:
   ```bash
   git init
   ```
2. **Create .gitignore**: Ensure `venv/`, `node_modules/`, `.env`, and `db.sqlite3` are ignored.
3. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/Nat-111/Student-Results-and-Complaints-Management-System.git
   git push -u origin main
   ```

---

## Phase 3: Hosting the Backend (Render.com)

1. **Create Account**: Sign up at [Render.com](https://render.com).
2. **New Web Service**: Connect your GitHub repository.
3. **Configuration**:
   * **Runtime**: Python
   * **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   * **Start Command**: `gunicorn config.wsgi`
4. **Environment Variables**: Add your `SECRET_KEY`, `FIREBASE_...` keys, and `DEBUG=False`.

---

## Phase 4: Hosting the Frontend (Vercel)

1. **Create Account**: Sign up at [Vercel.com](https://vercel.com).
2. **New Project**: Import your GitHub repository.
3. **Framework Preset**: Vite.
4. **Build Settings**:
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. **Environment Variables**: Add `VITE_API_URL` (the URL Render gave you).
6. **Deploy**: Click Deploy!

---

## Phase 5: Verification
* Test the Login/Signup flow.
* Verify the Admin Dashboard data.
* Check that Complaints can be submitted and tracked.

> [!TIP]
> If you encounter CORS errors after deployment, make sure to add your Vercel URL to `CORS_ALLOWED_ORIGINS` in your Django `settings.py`.
