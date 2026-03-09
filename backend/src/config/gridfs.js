const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create GridFS storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generate a unique filename
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: "images", // Collection name in MongoDB
      };
      resolve(fileInfo);
    });
  },
});

module.exports = storage;
