# AI CRM Importer

A lightweight AI-powered CSV importer for CRM leads with bulk upload, previews, virtualized tables, progress feedback, and dark mode.

## Overview

This repository contains a full-stack app:

- `frontend/` — Next.js + React UI for uploading CSVs, previewing data, and displaying the processed CRM records.
- `backend/` — Express API for CSV parsing, AI processing, and record validation.

## Features

- CSV upload with preview and validation
- AI-powered CRM record extraction
- Progress indicators for upload and processing
- Virtualized tables for large CSVs
- Dark mode toggle

## Prerequisites

- Node.js 18+ (recommended)
- npm
- A Gemini API key for AI processing

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following content:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Frontend

```bash
cd ../frontend
npm install
```

## Running Locally

### Start the backend server

```bash
cd backend
npm run dev
```

By default, the backend listens on `http://localhost:5000`.

### Start the frontend app

```bash
cd frontend
npm run dev
```

Open the app at `http://localhost:3000`.

## Development Workflow

- Upload a CSV file from the UI
- Preview first rows before importing
- Submit the upload and watch progress indicators
- Review the AI-processed CRM results in a virtualized table
- Switch between light and dark mode using the toggle

## Project Structure

- `frontend/src/components` — React components used in the UI
- `frontend/src/app` — Next.js app routing and global styles
- `frontend/src/services/api.js` — API client logic
- `backend/src/controllers` — Express request handlers
- `backend/src/services` — CSV parsing, AI processing, and record validation
- `backend/src/routes` — Express routing

## Notes

- The frontend currently assumes the backend API is available at `http://localhost:5000/api`.
- Make sure `GEMINI_API_KEY` is valid and has access to the Google Generative AI API.

## Troubleshooting

- If the frontend cannot reach the backend, verify `backend` is running and CORS is enabled.
- If AI processing fails, check your `GEMINI_API_KEY` and ensure the backend console is not reporting errors.