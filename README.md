# 🚀 Auto Resume Scanner

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)]()
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()

An end-to-end tool that **uploads PDF resumes**, **extracts text**, and **ranks candidates** against a job description using **TF-IDF + cosine similarity**.

---

## ✨ Features
- 📄 **Smart PDF Parsing** – Upload resumes and extract clean text using `pdf-lib` & `mammoth`.
- 🤖 **AI-Driven Ranking** – Python `scikit-learn` calculates relevance of resumes to job description.
- 🔗 **Node ↔︎ Python Bridge** – Seamless communication between backend and Python ranking script using `python-shell`.
- 🧩 **Modular Design** – Easy-to-understand folder structure for maintenance & scaling.

---

## 🗂 Project Structure
```
autoResumeScanner/
├─ backend/
│ ├─ server.js # Express server
│ ├─ routes/
│ │ ├─ userRoutes.js # User registration/login
│ │ ├─ resumeRoutes.js # Upload & parsing resumes
│ │ └─ jobRoutes.js # Job creation & ranking
│ ├─ utils/
│ │ ├─ extractText.js # PDF/DOCX text extraction
│ │ └─ tfidf_rank.py # Python TF-IDF ranking script
│ └─ uploads/ # Temporary folder for uploaded resumes
└─ README.md
```

## ⚙️ Tech Stack
| Layer               | Tools                                |
|---------------------|--------------------------------------|
| **Backend**         | Node.js, Express                     |
| **Machine Learning** | Python, scikit-learn, NLTK          |
| **PDF Parsing**     | pdf-lib, mammoth                      |
| **Bridge**          | python-shell                          |

---

## 🚀 Quick Start

### 1️⃣ Clone & Install
```
git clone https://github.com/<your-username>/autoResumeScanner.git
cd autoResumeScanner/backend

# Node dependencies
npm install

# Python dependencies
pip install scikit-learn nltk
```
### 2️⃣ Environment
```
Create a .env file inside backend/:
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
```
### 3️⃣ Launch Backend
```
npm start
Your API runs at http://localhost:5000

🧪 API Endpoints
User Routes
Method	Route	Description
POST	/api/users/register	Register a user
POST	/api/users/login	Login a user

Resume Routes
Method	Route	Description
POST	/api/resumes/upload/:userId	Upload a PDF/DOCX resume

Job Routes
Method	Route	Description
POST	/api/jobs/	Create a new job
GET	/api/jobs/	Get all jobs
GET	/api/jobs/:id	Get job by ID
GET	/api/jobs/rank/:jobId	Rank resumes for a job using TF-IDF
```
### 💡 Usage Tips
Upload text-based PDFs or DOCX files for best results (image PDFs won’t extract text unless OCR is implemented).

TF-IDF ranking works best with multiple resumes per job.

Avoid uploading huge PDFs at once; consider chunking for large datasets.

### 🤝 Contributing
Pull requests are welcome!
Please open an issue to discuss major changes before implementing.
