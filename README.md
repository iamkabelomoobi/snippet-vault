snippet-vault/
├── apps/
│ ├── api/
│ │ ├── src/
│ │ │ ├── schema/ # GraphQL schema definitions
│ │ │ │ ├── index.ts
│ │ │ │ ├── snippet.ts
│ │ │ │ ├── user.ts
│ │ │ │ └── auth.ts
│ │ │ ├── resolvers/ # GraphQL resolvers
│ │ │ │ ├── snippet.ts
│ │ │ │ ├── user.ts
│ │ │ │ └── auth.ts
│ │ │ ├── services/ # Business logic and database operations
│ │ │ │ ├── snippet.ts
│ │ │ │ ├── user.ts
│ │ │ │ ├── auth.ts
│ │ │ │ └── file.ts
│ │ │ ├── utils/ # Utility functions
│ │ │ │ ├── fileUpload.ts
│ │ │ │ └── db.ts
│ │ │ └── index.ts
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── .env
│ └── web/
│ ├── src/
│ │ ├── app/
│ │ │ ├── layout.tsx
│ │ │ ├── page.tsx
│ │ │ ├── snippets/
│ │ │ │ ├── [id]/page.tsx
│ │ │ │ └── new/page.tsx
│ │ │ ├── login/page.tsx
│ │ │ ├── forgot-password/page.tsx
│ │ │ └── admin/page.tsx
│ │ ├── components/
│ │ │ ├── ui/
│ │ │ │ ├── Input.tsx
│ │ │ │ ├── Textarea.tsx
│ │ │ │ ├── Select.tsx
│ │ │ │ ├── Button.tsx
│ │ │ │ ├── Card.tsx
│ │ │ │ ├── Toast.tsx
│ │ │ │ └── FileInput.tsx
│ │ │ └── shared/
│ │ │ └── SnippetCard.tsx
│ │ ├── lib/
│ │ │ ├── api.ts
│ │ │ └── auth.ts
│ │ └── styles/
│ │ ├── globals.css
│ │ └── tailwind.config.ts
│ ├── public/
│ ├── package.json
│ ├── tsconfig.json
│ ├── next.config.js
│ └── .env.local
├── packages/
│ └── ui/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Input.tsx
│ │ │ ├── Textarea.tsx
│ │ │ ├── Select.tsx
│ │ │ ├── Button.tsx
│ │ │ ├── Card.tsx
│ │ │ ├── Toast.tsx
│ │ │ └── FileInput.tsx
│ │ └── index.ts
│ ├── package.json
│ └── tsconfig.json
├── turbo.json
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
