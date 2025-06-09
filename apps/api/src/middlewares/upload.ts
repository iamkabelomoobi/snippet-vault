import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = [
  ".txt",
  ".js",
  ".py",
  ".ts",
  ".jsx",
  ".tsx",
  ".html",
  ".css",
  ".json",
  ".md",
];

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export function setupFileUpload(app: express.Application) {
  app.use(cors());

  // File upload endpoint
  app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({
      fileName: req.file.originalname,
      filePath: req.file.filename,
      size: req.file.size,
    });
  });

  // File download endpoint
  app.get("/download/:file", (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.download(filePath);
  });

  // Serve uploaded files statically
  app.use("/files", express.static(UPLOADS_DIR));
}
