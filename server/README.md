# Srilin Electronics — Backend (Express + MongoDB + Cloudinary)

## Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, CLOUDINARY_* and SEED_SUPERADMIN_* values
```

## Create the first SuperAdmin

```bash
node utils/seedSuperAdmin.js
```

## Run the server

```bash
npm run dev     # with nodemon (development)
npm start        # production
```

Server runs on `http://localhost:5000` by default.

## File Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary config
├── controllers/
│   ├── authController.js  # login, logout, getMe
│   ├── userController.js  # superadmin: create/edit/delete/promote admins
│   └── heroController.js  # hero slide CRUD
├── middleware/
│   ├── auth.js            # protect (JWT verify), authorize (role check)
│   ├── upload.js          # multer + Cloudinary storage factory
│   └── errorMiddleware.js # notFound + central errorHandler
├── models/
│   ├── User.js             # admin/superadmin, password hashing
│   └── HeroSlide.js        # hero banner slide schema
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js       # superadmin-only
│   └── heroRoutes.js
├── utils/
│   ├── generateToken.js
│   └── seedSuperAdmin.js
├── .env.example
├── server.js
└── package.json
```

## API Endpoints

### Auth (`/api/auth`) — shared login for admin & superadmin
| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| POST | `/login` | Public | Login, sets httpOnly cookie + returns JWT + role |
| POST | `/logout` | Private | Clears auth cookie |
| GET  | `/me` | Private | Returns current logged-in user + role |

### Users (`/api/users`) — superadmin only (backend-enforced, not just hidden in UI)
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/` | Add a new admin (or superadmin) |
| GET | `/` | List all admin users |
| GET | `/:id` | Get one user |
| PUT | `/:id` | Update name/email/active status |
| PATCH | `/:id/role` | Promote/demote between admin ↔ superadmin |
| DELETE | `/:id` | Remove a user |

### Hero Slides (`/api/hero`) — admin + superadmin
| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| GET | `/` | Public | Active slides (use `?all=true` in admin dashboard) |
| GET | `/:id` | Public | Single slide |
| POST | `/` | Private | Create slide (multipart/form-data, field: `image`) |
| PUT | `/:id` | Private | Update slide / replace image |
| DELETE | `/:id` | Private | Delete slide + Cloudinary image |

## Notes

- **Same login page, same dashboard** for both roles. The frontend should call `GET /api/auth/me`
  after login and hide the "Manage Admins" page/link in the sidebar when `role !== "superadmin"`.
  The actual `/api/users/*` routes are protected on the backend regardless, so hiding the UI link
  is a UX nicety, not the security boundary.
- Image uploads use `multipart/form-data`. Example field names: `image` (single file) for hero slides.
- Cloudinary auto-optimizes images (`quality: auto`, `fetch_format: auto`) which helps with the
  WebP/AVIF + image optimization requirements from the SOW.
- Next models to build the same way (controller + routes + multer folder): Services, Blogs,
  Industries, Certifications, Clients — happy to scaffold those next the same pattern as Hero Slides.
