# Job Board API

A modern RESTful API for a Job Board platform, built with Node.js, Express, and MongoDB. This API supports user authentication, job postings, applications, and admin dashboard features.

---

## 🚀 Features
- User registration & authentication (JWT-based)
- Role-based access: Admin, Employer, Candidate
- Job posting, updating, and deletion (Employers)
- Job application with resume upload (Candidates)
- Admin dashboard for managing users and jobs
- Cloudinary integration for file uploads
- Secure cookies and environment-based configuration

---

## 📦 Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd JobBoardApi

# Install dependencies
npm install

# Create a .env file with required environment variables (see below)

# Start the server
npm run dev
```

---

## ⚙️ Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CORS_ORIGIN=http://localhost:3000
```

---

## 🗂️ Data Models
- [View Data Models (Eraser.io)](https://app.eraser.io/workspace/f0Exl0uajG295Gt3l6Tc)

---

## 📬 Postman Collection
- [Run in Postman](https://postman.co/workspace/My-Workspace~04e5b373-bb77-4a3e-88b7-6ce98905e43b/collection/31349395-898f7ee3-6b8f-4d28-8c4a-10219f1950ac?action=share&creator=31349395&active-environment=31349395-b64d7e0d-89eb-4a13-86e3-4d65ac1f06c4)

---

## 📚 API Documentation

### Auth & User APIs
| Method | Endpoint                | Description                | Auth Required | Roles         |
|--------|------------------------|----------------------------|---------------|--------------|
| POST   | /api/v1/users/register | Register a new user        | No            | All          |
| POST   | /api/v1/users/login    | Login user                 | No            | All          |
| POST   | /api/v1/users/logout   | Logout user                | Yes           | All          |
| POST   | /api/v1/users/refreshAccessToken | Refresh JWT token | No            | All          |

### Job APIs (Employer)
| Method | Endpoint                | Description                | Auth Required | Roles         |
|--------|------------------------|----------------------------|---------------|--------------|
| POST   | /api/v1/jobs/createJob | Create a new job           | Yes           | Employer     |
| PATCH  | /api/v1/jobs/:jobId    | Update a job               | Yes           | Employer     |
| DELETE | /api/v1/jobs/:jobId    | Delete a job               | Yes           | Employer     |
| GET    | /api/v1/jobs/:jobId    | Get job details            | Yes           | Employer     |
| GET    | /api/v1/jobs/applications/:jobId | Get job applications | Yes | Employer |

### Application APIs (Candidate)
| Method | Endpoint                                 | Description                | Auth Required | Roles     |
|--------|------------------------------------------|----------------------------|---------------|-----------|
| POST   | /api/v1/applications/createApplication/:jobId | Apply to a job (with resume upload) | Yes | Candidate |

### Dashboard APIs (Admin)
| Method | Endpoint                        | Description                | Auth Required | Roles     |
|--------|----------------------------------|----------------------------|---------------|-----------|
| GET    | /api/v1/dashboard/getStats       | Get dashboard stats        | Yes           | Admin     |
| DELETE | /api/v1/dashboard/deleteJob/:jobId | Delete any job           | Yes           | Admin     |
| DELETE | /api/v1/dashboard/deleteUser/:userId | Delete any user         | Yes           | Admin     |
| PATCH  | /api/v1/dashboard/toggleBlock/:userId | Block/unblock user     | Yes           | Admin     |

---

## 📝 Important Notes
- All protected routes require JWT in cookies or Authorization header.
- Employers can only manage their own jobs.
- Candidates can only apply once per job.
- Admins have full control over users and jobs.
- Resume files are uploaded to Cloudinary.

---

## 👨‍💻 Author
- Ghulam Murtaza

---

## 📄 License
This project is licensed under the ISC License.
