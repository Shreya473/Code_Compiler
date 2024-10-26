// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process'); // For executing code

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// File upload setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for compiling code
app.post('/api/compile', (req, res) => {
  const { code, language } = req.body;

  // Logic to compile and execute the code based on the selected language
  // Example: Python execution
  if (language === 'python') {
    exec(`python3 -c "${code}"`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr });
      }
      res.json({ output: stdout });
    });
  }
  // Add similar logic for other languages (Java, C++, etc.)
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
