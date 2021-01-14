## Hello

Thank you for taking an interest in contributing to our Paddle Project's code base.  Please take a moment to read through our development guide.
This application is built on the MERN (MongoDB Express React Node.js) stack.  The quick start development guide has been created to get you started efficently.

## Quick Start Development Guide

1. `git clone https://github.com/gleitej/Paddle-Project.git`

2. `npm i` installs dependacies for backend in package.json

3. `cd client` change directory to the client folder

4. `npm i` insalls dependacies for the frontend in package.json

5. `cd ..` change directory to the top level folder

`npm run dev` runs both the backend API on port 5000 and the frontend React dev server running on port 3000

`npm run nodeS` runs backend API

`npm run client` runs front end React dev server


The file `./confing/default.json` containes environment variables.  The following information describes the recommended values.

Note: There are many enviroment variables set in `./config/default.json`  For the purpose of this quick start development guide the only envirment variables that are of concern are the ones listed below.  

`"mongoURI"` is the database that this application is configured to use.  You can create your own account and database following this link [mongoDB Atlas](https://www.mongodb.com/cloud/atlas)

`"jwtSecret"` is used to sign JWT tokens in the authentication process.  The value can be any string of your choosing.

`"accessKeyId"` is the access ID for conecting to the Amazon Web Services S3 bucket.  The AWS S3 bucket is used to store photos (profile pictures and images of riverts).  You can create a free AWS S3 buket.

`"secretAccessKey"` is the access key for conecting to the Amazon Web Services S3 bucket.  The AWS S3 bucket is used to store photos (profile pictures and images of riverts).  You can create a free AWS S3 buket.

`"email"` is the email address that that the appication is using to send verifation and password reset links.  The application is using the NPM package nodeMailer to connect to and email provider and send emails.

`"emailPassord"` is the password for the email that the appication is using to send verifation and password reset links.  The application is using the NPM package nodeMailer to connect to and email provider and send emails.


## User Roles
This document descrides the different authorization roles present in this application

This applications handles five different user roles.

These roles are represented by the following strings.
`"guest"`
`"pending"`
`"user"`
`"admin"`
`"masterAdmin"`

`"guest"`
- status: visiting user - very limited interaction with application
- storage: inital state in ./client/src/reducers/userRole.js
- Frontend - "guest" is the is the inital role. It only exists on the frontend redux state.
- Backend - "guest" is not set or stored on the backend

`"pending"`
- status: user has registered and has not confirmed email
- storage: set in ./routes/auth.js
- Frontend - "pending" status is set in the application.localstorage via a JSON Web Token
- Backend - "user" only API routes are unprotected

`"user"`
- status: regular users
- storage location: stored in the users document {role: "user"}
- set: this role is set in ./routes/users.js
- Frontend - "user" status is set in the application.localstorage via a JSON Web Token
- Backend - "user" only API routes are protected by the ./middleware/auth.js

`"admin"`
- status: admin user - has special privlages - all CRUD opperations of map data
- storage: stored in the users document {role: "admin"}
- Frontend - "admin" status is set in the application.localstorage via a JSON Web Token
- Backend - "admin" only API routes are protected by the ./middleware/adminAuth.js
