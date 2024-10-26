import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import axios from 'axios';
import {
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh'; // Import Refresh Icon
import './styles.css'; // Import the CSS for theming
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/rust/rust';

const App = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [inputDialogOpen, setInputDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const languageTemplates = {
    javascript: `// JavaScript Template\nconsole.log("Hello, World!");`,
    python: `# Python Template\nprint("Hello, World!")`,
    java: `// Java Template\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `// C++ Template\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    html: `<!-- HTML Template -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>`,
    sql: `-- SQL Template\nSELECT 'Hello, World!' AS Greeting;`,
    xml: `<!-- XML Template -->\n<note>\n  <to>User</to>\n  <from>Compiler</from>\n  <message>Hello, World!</message>\n</note>`,
    rust: `// Rust Template\nfn main() {\n    println!("Hello, World!");\n}`,
  };

  const runCode = async () => {
    try {
        const response = await axios.post('http://localhost:5000/execute', {
            language,
            code,
            input: userInput,
        }, { timeout: 60000 });
        setOutput(response.data.output);
    } catch (error) {
        console.error('Error:', error);
        setOutput('Error: ' + error.message);
    }
  };

  const handleRefresh = () => {
      window.location.reload(); // Reload the current page
  };

  const handleFileSave = () => {
    if (fileName) {
      localStorage.setItem(fileName, code);
      setSnackbarOpen(true);
      setDialogOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleInputDialogOpen = () => {
    setInputDialogOpen(true);
  };

  const handleInputDialogClose = () => {
    setInputDialogOpen(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setCode(languageTemplates[selectedLanguage]);
  };

  useEffect(() => {
    document.body.style.backgroundColor = '#013442';
    document.body.style.color = '#ffffff';
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Online Code Compiler</Typography>
          <IconButton edge="end" color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDialogOpen}>Create New File</MenuItem>
        <MenuItem>
          <input type="file" onChange={handleFileUpload} accept=".js,.py,.java,.cpp,.html,.sql,.xml,.rs" />
        </MenuItem>
        <MenuItem onClick={() => { /* Add Save logic */ }}>Save File</MenuItem>
      </Menu>

      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid item xs={12} sm={6}>
          <FormControl size="small" fullWidth>
            <InputLabel sx={{ color: '#ffffff' }}>Select Language</InputLabel>
            <Select
              value={language}
              onChange={handleLanguageChange}
              variant="outlined"
              sx={{
                color: '#ffffff',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffffff',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffffff',
                },
                '.MuiSvgIcon-root': {
                  color: '#ffffff',
                },
                mt: 2, // Adds space between label and dropdown
              }}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="sql">SQL</MenuItem>
              <MenuItem value="xml">XML</MenuItem>
              <MenuItem value="rust">Rust</MenuItem>
            </Select>
          </FormControl>
          <CodeMirror
            value={code}
            options={{
              mode: language,
              theme: 'default',
              lineNumbers: true,
              readOnly: false,
            }}
            onBeforeChange={(editor, data, value) => {
              setCode(value);
            }}
            className="code-editor"
            style={{  height: '550px', // Set the height to 550px
              marginTop: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
              color: '#ffffff', }} // Set editor height to 550px
          />

          <Button
            variant="contained"
            style={{ backgroundColor: '#139e3d', color: '#ffffff', marginTop: '30px' }} // Increased margin
            onClick={handleInputDialogOpen}
          >
            Run Code
          </Button>

          <Dialog
            open={inputDialogOpen}
            onClose={handleInputDialogClose}
            PaperProps={{
              style: {
                backgroundColor: 'rgba(19, 158, 61, 0.8)', // Semi-transparent green background
                color: '#ffffff', // White text color
                padding: '20px', // Adds padding for a neat look
              },
            }}
          >
            <DialogTitle>User Input</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Input"
                type="text"
                fullWidth
                variant="standard"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                InputLabelProps={{
                  style: { color: '#ffffff' }, // White label color
                }}
                InputProps={{
                  style: { color: '#ffffff' }, // White text color
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleInputDialogClose} style={{ color: '#ffffff' }}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  runCode();
                  handleInputDialogClose();
                }}
                style={{ color: '#ffffff' }}
              >
                Run
              </Button>
            </DialogActions>
          </Dialog>

        </Grid>

        <Grid item xs={12} sm={6}>
          <Box border={1} borderColor="grey.400" padding={2} style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h6">Output:</Typography>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{output}</pre>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="File saved successfully!"
      />

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create New File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            type="text"
            fullWidth
            variant="standard"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFileSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
