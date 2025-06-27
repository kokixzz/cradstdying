const { spawn } = require('child_process');
const path = require('path');

const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');

const child = spawn('node', [
  path.join(__dirname, 'node_modules', 'react-scripts', 'scripts', 'start.js')
], {
  stdio: 'inherit',
  shell: false
});

child.on('error', (error) => {
  console.error('Error starting React app:', error);
});

child.on('close', (code) => {
  console.log(`React app exited with code ${code}`);
}); 