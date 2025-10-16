// Simple test to verify the setup
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Gamified Learning Platform Setup...\n');

// Check if required files exist
const requiredFiles = [
    'package.json',
    'webpack.config.js',
    'src/index.js',
    'src/components/App.js',
    'src/utils/OfflineManager.js',
    'src/utils/Analytics.js',
    'src/utils/Localization.js',
    'server/index.js',
    'server/routes/auth.js',
    'server/routes/modules.js',
    'server/routes/progress.js',
    'server/routes/analytics.js',
    'server/routes/admin.js',
    '.env',
    'README.md'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

// Check if directories exist
const requiredDirs = [
    'src',
    'src/components',
    'src/utils',
    'src/styles',
    'server',
    'server/routes',
    'public',
    'dist'
];

console.log('\n📂 Checking required directories:');
requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`  ✅ ${dir}/`);
    } else {
        console.log(`  ❌ ${dir}/ - MISSING`);
        allFilesExist = false;
    }
});

// Check package.json
console.log('\n📦 Checking package.json:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`  ✅ Name: ${packageJson.name}`);
    console.log(`  ✅ Version: ${packageJson.version}`);
    console.log(`  ✅ Main: ${packageJson.main}`);
    console.log(`  ✅ Scripts: ${Object.keys(packageJson.scripts).join(', ')}`);
} catch (error) {
    console.log(`  ❌ Error reading package.json: ${error.message}`);
    allFilesExist = false;
}

// Summary
console.log('\n📊 Setup Summary:');
if (allFilesExist) {
    console.log('  🎉 All required files and directories are present!');
    console.log('  🚀 Ready to run: npm install && npm run build && npm start');
} else {
    console.log('  ⚠️  Some files are missing. Please check the setup.');
}

console.log('\n🔧 Next Steps:');
console.log('  1. Run: npm install');
console.log('  2. Run: npm run build');
console.log('  3. Run: npm start');
console.log('  4. Open: http://localhost:3000');
console.log('\n📚 Demo Credentials:');
console.log('  Students: student1/password, student2/password');
console.log('  Teacher: teacher1/password');
console.log('  Admin: admin/admin');
