## Quick Start Development Guide

The file `./confing/default.json` 

## User Roles
This document descrides the different authorization roles present in this application

This applications handles five different user roles.

These roles are represented by the following strings.
"guest"
"pending"
"user"
"admin"
"masterAdmin"

"guest"
status: visiting user - very limited interaction with application
storage: inital state in ./client/src/reducers/userRole.js
Frontend - "guest" is the is the inital role. It only exists on the frontend redux state.
Backend - "guest" is not set or stored on the backend

"pending"
status: user has registered and has not confirmed email
storage: set in ./routes/auth.js
Frontend - "pending" status is set in the application.localstorage via a JSON Web Token
Backend - "user" only API routes are unprotected

"user"
status: regular users
storage location: stored in the users document {role: "user"}
set: this role is set in ./routes/users.js
Frontend - "user" status is set in the application.localstorage via a JSON Web Token
Backend - "user" only API routes are protected by the ./middleware/auth.js

"admin"
status: admin user - has special privlages - all CRUD opperations of map data
storage: stored in the users document {role: "admin"}
Frontend - "admin" status is set in the application.localstorage via a JSON Web Token
Backend - "admin" only API routes are protected by the ./middleware/adminAuth.js
