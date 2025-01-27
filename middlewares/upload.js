import multer from 'multer';

// Define storage options to store the files temporarily in memory
const storage = multer.memoryStorage();  

// Initialize multer with storage options
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
      const extname = fileTypes.test(file.originalname.toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only image and video files are allowed.'));
      }
    }
  });
  
// Middleware to handle file uploads
export const uploadFiles = upload.fields([
  { name: 'profileImage', maxCount: 1 },  // Profile image (single file)
  { name: 'resumeVideo', maxCount: 1 },   // Resume video (single file)
]);
