import multer from "multer";

// Use memory storage instead of disk
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC/DOCX files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max (important for Vercel)
  }
});

export default upload;
