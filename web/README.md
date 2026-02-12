# School ERP - School Management System

## Project info

**URL**: https://github.com/FabriceRachid/School_ERP

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/FabriceRachid/School_ERP.git

# Step 2: Navigate to the project directory.
cd School_ERP/web

# Step 3: Install necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click on the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy this project using various hosting services like Vercel, Netlify, or any static hosting service.

## Features

- **School Management**: Create, edit, and manage schools
- **Teacher Management**: Add, edit, and delete teachers with subject assignments
- **Student Management**: Enroll students with class assignments
- **Class Management**: Create and manage classes
- **Subject Management**: Add and organize subjects
- **Payment Tracking**: Monitor student payments with detailed status
- **Timetable Management**: Create and modify school schedules
- **Academic Year Management**: Manage trimesters and academic periods
- **Multi-school Support**: Each school can have its own administrators
- **Real-time Data**: All changes are synchronized across the system

## Project Structure

```
web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/      # React contexts (Auth, etc.)
│   ├── data/          # Mock data and types
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # Data services and API calls
│   └── utils/         # Utility functions
├── public/            # Static assets
└── package.json       # Project dependencies
```
