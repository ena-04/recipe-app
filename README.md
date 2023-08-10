# Recipe Sharing App

## Description

This is a web application that allows users to share their recipes with others. Users can upload their recipes along with an image of the recipe, view recipes uploaded by others, and search and filter through recipes. The app uses Firebase storage for storing recipe images, Cloud Firestore for storing recipe data, Firebase Authentication for user authentication, and Firebase Hosting for hosting the web app.

## Features

- User authentication using Firebase Authentication
- Recipe uploading with an image using Firebase storage
- Recipe viewing and filtering using Cloud Firestore
- Users can only remove their own recipes
- Search functionality to find specific recipes

## Technologies Used

- React.js
- Node.js
- Firebase Storage
- Cloud Firestore
- Firebase Authentication
- Firebase Hosting

## Installation

1. Clone the repository to your local machine
2. Navigate to the root directory of the project in the terminal
3. Run `npm install` to install all dependencies
4. Create a Firebase project and set up Firebase Authentication, Firebase Storage, and Cloud Firestore
5. Update the Firebase configuration in `src/firebase.js`
6. Run `npm start` to start the app

## Usage

To use the app, follow these steps:

1. Sign up for an account or log in with an existing account
2. Click on the "Add Recipe" button to upload your recipe and an image of the recipe
3. Browse and search for recipes uploaded by others
4. Click on a recipe to view its details and instructions
5. Click on the "Remove" button to remove your own recipe

