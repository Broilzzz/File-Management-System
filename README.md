
# Secure File Management System

This project is a sophisticated file management system designed to ensure robust security and efficient user management. It leverages Spring Boot for the backend, MySQL for the database, and React.js for the frontend, integrating advanced features for authentication, authorization, and user experience.

## Implemented Features

- Enhanced Security:
    * 2-factor authentication using Spring Security
    * JWT for user authorization
    * Configurable JWT expiration time, requiring periodic re-login
- File Management:
    * File upload for extensions: png, jpeg, jpg, docx, pdf, xlsx, csv, pptx, txt
    * File download and update capabilities
    * File deletion restricted to users with CEO or ADMIN roles
- User Profile Management:
    * Upload and update profile pictures
    * Edit user details
    * Promote/demote users to different roles (restricted to CEO or ADMIN roles))


## Demo Video Of The Project

[link](https://youtube.com)


## Run the Project Locally

Clone the project

```bash
  git clone https://github.com/Broilzzz/File-Management-System.git
```

Go to the project directory

```bash
  cd File-Management-System
```
Backend:

- Open the backend code using an IDE (preferably IntelliJ IDEA).
- Navigate to application.yml and update the lines marked with `# need to be updated according to machine`.
- Run the backend code.

Frontend:

 - Open the frontend code using an IDE (preferably VS Code).
 - Install dependencies

```bash
  npm install
```
- Start the application:

```bash
  npm run dev
```
