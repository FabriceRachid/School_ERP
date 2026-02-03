# School_ERP
Multi-School Management System (Education ERP) — A full-stack platform for managing multiple schools from a single system. It handles students, teachers, grades, timetables, and fee payments, with role-based access, a REST API (Node.js + Express), a web interface (React), and a mobile app (Flutter).

## Backend Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── school.routes.js
│   │   ├── user.routes.js
│   │   ├── student.routes.js
│   │   ├── teacher.routes.js
│   │   ├── class.routes.js
│   │   ├── subject.routes.js
│   │   ├── grade.routes.js
│   │   ├── payment.routes.js
│   │   └── notification.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── school.controller.js
│   │   ├── user.controller.js
│   │   ├── student.controller.js
│   │   ├── teacher.controller.js
│   │   ├── class.controller.js
│   │   ├── subject.controller.js
│   │   ├── grade.controller.js
│   │   ├── payment.controller.js
│   │   └── notification.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── student.service.js
│   │   ├── payment.service.js
│   │   └── report.service.js
│   ├── models/
│   │   ├── index.js
│   │   ├── user.model.js
│   │   ├── school.model.js
│   │   ├── student.model.js
│   │   ├── teacher.model.js
│   │   ├── class.model.js
│   │   ├── subject.model.js
│   │   ├── grade.model.js
│   │   ├── fee.model.js
│   │   ├── payment.model.js
│   │   └── notification.model.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── password.js
│   ├── app.js
│   └── server.js
├── config/
├── middlewares/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   └── error.middleware.js
├── db.js
├── env.js
├── swagger.yaml
├── Dockerfile
├── package.json
├── .env
└── .gitignore
```