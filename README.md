
# SmartCRM AI

AI-powered Customer Relationship Management system built with Laravel and React.

## Technology Stack

### Backend
- PHP 8.3
- Laravel 12
- MySQL
- Laravel Sanctum

### Frontend
- React
- TypeScript
- Vite
- React Router
- Recharts
- Lucide React

## Project Structure

- backend/ - Laravel API
- frontend/ - React application
- infra/ - Infrastructure and deployment
- docs/ - Project documentation

## Local Setup

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Health Check

http://127.0.0.1:8000/up

## Project Goals

- Lead Management
- Customer Management
- Task Management
- Dashboard Analytics
- AI-powered CRM Assistant
- AI Automation
