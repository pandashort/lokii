#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🎓 Gamified Learning Platform Demo');
console.log('=====================================\n');

console.log('🚀 Starting the platform...\n');

// Check if dependencies are installed
const fs = require('fs');
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    const install = spawn('npm', ['install'], { stdio: 'inherit' });
    
    install.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Dependencies installed successfully!\n');
            startPlatform();
        } else {
            console.log('❌ Failed to install dependencies');
            process.exit(1);
        }
    });
} else {
    startPlatform();
}

function startPlatform() {
    console.log('🔨 Building the application...');
    const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
    
    build.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Application built successfully!\n');
            startServer();
        } else {
            console.log('❌ Failed to build application');
            process.exit(1);
        }
    });
}

function startServer() {
    console.log('🌐 Starting the server...');
    console.log('📱 The platform will be available at: http://localhost:3000\n');
    
    console.log('📚 Demo Credentials:');
    console.log('  👨‍🎓 Students: student1/password, student2/password');
    console.log('  👩‍🏫 Teacher: teacher1/password');
    console.log('  👨‍💼 Admin: admin/admin\n');
    
    console.log('🎮 Features to try:');
    console.log('  • Login with different user types');
    console.log('  • Complete learning modules');
    console.log('  • View progress and analytics');
    console.log('  • Test offline functionality');
    console.log('  • Switch languages\n');
    
    console.log('Press Ctrl+C to stop the server\n');
    
    const server = spawn('npm', ['start'], { stdio: 'inherit' });
    
    server.on('close', (code) => {
        console.log(`\n🛑 Server stopped with code ${code}`);
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping server...');
        server.kill('SIGINT');
        process.exit(0);
    });
}
