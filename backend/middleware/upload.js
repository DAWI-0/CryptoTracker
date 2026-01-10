const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/avatars"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `user-${req.user.id}-${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

module.exports = upload;