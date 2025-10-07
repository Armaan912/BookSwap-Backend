const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = (folderName, fieldRules = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), 'uploads', folderName);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      const filename = `${nameWithoutExt}_${timestamp}${ext}`;

      if (!req.savedFiles) req.savedFiles = {};
      req.savedFiles[file.fieldname] = `/uploads/${folderName}/${filename}`;

      cb(null, filename);
    }
  });

  const fileFilter = (req, file, cb) => {
    const rules = fieldRules[file.fieldname];
    if (!rules) return cb(new Error('No rules defined for this field'));

    if (!rules.allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type for ${file.fieldname}`));
    }

    cb(null, true);
  };

  const uploader = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: Math.max(
        ...Object.values(fieldRules).map(rule => rule.maxSize || 20 * 1024 * 1024)
      )
    }
  });

  return uploader;
};

const bookUploader = createUploader('books', {
  image: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    maxSize: 20 * 1024 * 1024
  }
});

module.exports = { bookUploader, createUploader };
