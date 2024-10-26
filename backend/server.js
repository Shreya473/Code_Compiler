const express = require('express'); // Import Express
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs'); // Import fs to handle file operations
const path = require('path'); // Import path to handle file paths

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define temporary file path
const tempFilePath = path.join(__dirname, 'temp'); // Temporary directory to store files

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempFilePath)) {
    fs.mkdirSync(tempFilePath);
}

// Define your endpoint for executing code
app.post('/execute', (req, res) => {
    const { language, code, input } = req.body;

    // Basic validation
    if (!language || !code) {
        console.error('Language or code is missing in the request body');
        return res.status(400).json({ error: 'Language and code are required' });
    }

    console.log('Received request:', { language, code, input });

    const tempFilePath = path.join(__dirname, 'temp'); // Temporary directory to store files

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempFilePath)) {
        fs.mkdirSync(tempFilePath);
    }

    // Write the code to a temporary file based on the selected language
    const fileName = path.join(tempFilePath, `code.${language}`);
    fs.writeFileSync(fileName, code); // Write code to a file

    // Prepare the Docker command to run the code
    const dockerCommand = `docker run --rm -v ${tempFilePath}:/app -w /app ${language}-compiler ${language} code.${language}`;
    
    // Execute the Docker command
    exec(dockerCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Docker execution error:', stderr || stdout);
            return res.status(500).json({ error: stderr || 'Execution error' });
        }
        
        // Send back the output to the client
        res.json({ output: stdout });
    });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
