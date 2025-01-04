# NodeJS API Template
This system serves as a modular base for various web applications that require common features such as user registration, authentication, password management, email notifications, and image uploads. It is designed to be adaptable to a wide range of applications, making it ideal for platforms like e-commerce sites, social media applications, and online services.

By using this template, developers can avoid the need to recreate basic authentication and file upload functionality from scratch. It is a time-saving starting point that can easily be customised for specific project needs.

## Features
- User Registration and Authentication: JWT-based authentication for login and user registration.
- Password Management: Implement reset-password functionality and OTP-based password recovery.
- File Upload: Support for uploading and storing images/videos using Cloudinary.
- Email Notifications: Integrated email functionality for various notifications such as password reset and account-related actions.


## Prerequisites
- Node.js (version 20.9 or higher)
- Express.js
- Cloudinary account for image/video storage
- JWT for authentication
- Multer for file uploads

## Folder Structure
```
├── api/
│   └── v1/
│       ├── users/
│           ├── users.controllers.js
│           ├── users.model.js
│           └── users.routes.js
├── config/
│   ├── cloudinary.js
│   ├── db.connection.js
│   └── swagger.js
├── documentation/
│   └── user.docs.js
├── middleware/
│   ├── authorization.js
│   ├── upload.js
│   └── users.validation.js
├── public/
├── utils/
│   ├── generateToken.js
│   ├── sendEmail.js
│   └── validationResponse.js
├── index.js
├── routes.js
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
└── README.md
```

## API Routes

### Swagger Documentation
GET /api/v1/docs: Access the Swagger UI for API documentation.

### User Management
POST /api/v1/users/auth/register: Register a new user.
POST /api/v1/users/auth/login: User login and JWT token issuance.
POST /api/v1/users/auth/reset-password: Reset a user's password using a reset token.
POST /api/v1/users/auth/otps: Request a one-time password (OTP) for additional security or verification.
POST /api/v1/users/auth/forgot-password: Initiate the forgot password process.
DELETE /api/v1/users/auth/delete-account: Delete a user's account.