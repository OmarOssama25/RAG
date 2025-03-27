const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../data/'));
  },
  filename: function(req, file, cb) {
    cb(null, 'egyptian_history.pdf');
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  }
});

// Upload PDF route
router.post('/upload', upload.single('pdf'), ragController.uploadPdf);

// Index the uploaded PDF
router.post('/index', ragController.indexDocument);

// Query the RAG system
router.post('/query', ragController.queryRag);

// Get indexing status
router.get('/status', ragController.getStatus);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'RAG API is healthy' });
});

module.exports = router;