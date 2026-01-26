# Notely 📝

**Notely** is a minimal, offline-first notes web application with AI-assisted features,
built to provide a calm and distraction-free writing experience.

---

## ✨ Features

- 📴 **Offline-First** — Works without internet
- 🔄 **Auto Sync** — Syncs notes when back online
- ✍️ **Clean Editor** — Markdown-supported writing
- 🤖 **AI Assistance**
  - Note summarization
  - Title generation
  - Smart tags
- 🌙 **Minimal UI** — Focused and elegant design
- 📱 **Responsive** — Works on desktop and mobile

---

## 🛠 Tech Stack

**Frontend**
- React
- Tailwind CSS
- IndexedDB (offline storage)

**Backend**
- Node.js
- Express
- REST APIs

**Database**
- MongoDB / SQLite

**AI**
- OpenAI API (or equivalent)

---

## 🧠 Architecture Overview

- Notes are stored locally using IndexedDB for offline access
- When the app detects connectivity, notes are synced with the backend
- Backend handles persistence and AI-powered operations
- Minimal conflict handling using latest-update strategy

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/notely.git
cd notely
npm install
npm run dev