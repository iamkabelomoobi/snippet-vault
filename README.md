# Snippet Vault

A modern code snippet manager with user authentication, admin moderation, file upload, and search/filtering. Built with Next.js (App Router), Apollo GraphQL, Prisma, and Express.

---

## Features

- User registration & login (JWT)
- Create, edit, and delete code snippets
- File upload/download for snippets
- Tag and language filtering
- Admin dashboard for snippet moderation (approve/reject)
- Email notifications for approvals/rejections
- Responsive UI with Tailwind CSS

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/snippet-vault.git
cd snippet-vault
```

### 2. Install Dependencies

```bash
# Install root, backend, and frontend dependencies
npm install
cd apps/api && npm install
cd ../web && npm install
```

### 3. Configure Environment Variables

- Copy `.env.example` to `.env` in both `apps/api` and `apps/web`.
- Set your database URL, JWT secret, and SMTP credentials in `apps/api/.env`.

Example for `apps/api/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/snippetvault"
JWT_SECRET="your_jwt_secret"
SMTP_USER="your@email.com"
SMTP_PASS="your_smtp_password"
```

### 4. Set Up the Database

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the Backend (API)

```bash
cd apps/api
npm run dev
# API runs at http://localhost:4000/graphql
```

### 6. Start the Frontend (Web)

```bash
cd apps/web
npm run dev
# Web runs at http://localhost:3000
```

---

## Usage

- Visit [http://localhost:3000](http://localhost:3000) to use the app.
- Register a new user and log in.
- Create snippets, upload files, and manage your own snippets.
- Admin users can access `/admin` to moderate snippets.
- Download files attached to snippets from the snippet detail page.

---

## Development Notes

- **File uploads** are stored in `/apps/api/uploads`.
- **Emails** are sent using SMTP (configure in `.env`). For development, MailDev is supported.
- **CORS** is enabled on the API for local development.


---

## Scripts

| Command                | Description                      |
|------------------------|----------------------------------|
| `npm run dev`          | Start dev server (API or Web)    |
| `npm run build`        | Build for production             |
| `npm run start`        | Start production server          |
| `npx prisma studio`    | Open Prisma DB UI                |

---

## License

MIT

---

## Contributing

Pull requests welcome! Please open an issue first to discuss major changes.
