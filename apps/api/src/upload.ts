import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // set file max to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
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
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export function setupFileUpload(app: express.Application) {
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

  app.get("/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath);
  });

  app.use("/files", express.static(uploadsDir));
}
