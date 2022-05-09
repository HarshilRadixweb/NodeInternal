const express = require('express')
const app = express()
const Multer = require('multer');
const gcsMiddlewares = require('./middlewares/google-cloud-storage');
  
  const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
    },
  });
  
  app.post(
    '/upload',
    multer.single('image'),
    gcsMiddlewares.sendUploadToGCS,
    (req, res, next) => {
      if (req.file && req.file.gcsUrl) {
        return res.send(req.file.gcsUrl);
      }
  
      return res.status(500).send('Unable to upload');
    },
  );


const port = process.env.port || 3000
app.listen(port, () => console.log(`Server running at ${port}`));