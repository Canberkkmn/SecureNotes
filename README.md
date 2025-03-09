# SecureNotes

SecureNotes is a secure note-taking application build with security practices. It utilizes **React.js, Node.js, Express, and MongoDB** for backend services while ensuring security through JWT authentication, CSRF protection, and rate limiting.

## Features

- **User Authentication** (Registration & Login) with password hashing
- **JWT Authentication**
- **CSRF Protection** using CSRF tokens
- **Rate Limiting** to prevent abuse
- **Security Headers** enforced by Helmet
- **CORS Management** for secure API requests

## Installation

**Installation for backend.**

1. **Create a `.env` file in the backend directory and add the following:**

*<admin> must be admin

```env
MONGO_URI=mongodb+srv://<admin>:<admin>@cluster0.ilita.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=c96c650ec36ab01b2c51f536146778c7460381bad2f8c887012085f9c0777414110a8ade26edef49cd7dfbeb10fc195282803728d206cf7ef52ac75742ef81e3
```

2. **Install dependencies and start server**:

```sh
cd backend
npm install
npx nodemon server.js
```

The backend will run on `http://localhost:5000`.

**Installation for frontend.**

```sh
cd frontend
npm install
npm run dev
```

The backend will run on `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user and receive authentication token
- **POST** `/api/auth/logout` - Logout user by clearing token

### Notes

- **GET** `/api/notes` - Retrieve user notes (authentication required)
- **POST** `/api/notes` - Create a new note (authentication required)
- **PUT** `/api/notes/:id` - Update a note (authentication required)
- **DELETE** `/api/notes/:id` - Delete a note (authentication required)

## License

This project is licensed under the MIT License.
