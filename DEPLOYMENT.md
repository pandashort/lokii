# Deployment Guide - Gamified Learning Platform

## 🚀 Quick Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application
```bash
npm run build
```

### 3. Start the Server
```bash
npm start
```

### 4. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 🔧 Production Deployment

### Environment Setup
1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Update environment variables**
   ```bash
   # Edit .env file
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-secure-secret-key
   ```

### Database Setup (Future)
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb learnstem

# Run migrations (when available)
npm run migrate
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📱 Mobile Deployment

### PWA Installation
1. Open the app in a mobile browser
2. Look for "Add to Home Screen" option
3. Install the app for offline access

### Android APK (Future)
```bash
# Build for Android
npm run build:android

# Generate APK
npm run build:apk
```

## 🏫 School Deployment

### Raspberry Pi Setup
1. **Install Raspberry Pi OS**
   ```bash
   # Download and flash Raspberry Pi OS
   # Enable SSH and configure network
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd gamified-learning-platform
   npm install
   npm run build
   ```

4. **Start as service**
   ```bash
   sudo systemctl enable learnstem
   sudo systemctl start learnstem
   ```

### SD Card Distribution
1. **Create master image**
   ```bash
   # Install on master device
   npm install
   npm run build
   npm run create-offline-package
   ```

2. **Copy to SD cards**
   ```bash
   # Use tools like dd or Etcher
   sudo dd if=master-image.img of=/dev/sdX bs=4M
   ```

3. **Distribute to schools**
   - Insert SD card in school devices
   - Run installation script
   - Configure school settings

## 🔄 Updates and Maintenance

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart server
sudo systemctl restart learnstem
```

### Data Backup
```bash
# Backup user data
npm run backup:data

# Backup analytics
npm run backup:analytics

# Backup modules
npm run backup:modules
```

### Monitoring
```bash
# Check application status
sudo systemctl status learnstem

# View logs
sudo journalctl -u learnstem -f

# Check disk space
df -h
```

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R www-data:www-data /path/to/app
sudo chmod -R 755 /path/to/app
```

#### Memory Issues
```bash
# Check memory usage
free -h

# Restart if needed
sudo systemctl restart learnstem
```

### Logs and Debugging
```bash
# View application logs
tail -f logs/app.log

# Debug mode
NODE_ENV=development npm start

# Verbose logging
DEBUG=* npm start
```

## 📊 Performance Optimization

### Caching
```bash
# Enable Redis caching
npm install redis
# Configure Redis in .env
```

### Compression
```bash
# Enable gzip compression
# Already configured in server/index.js
```

### CDN Setup
1. Upload static assets to CDN
2. Update asset URLs in configuration
3. Configure cache headers

## 🔒 Security Considerations

### Environment Security
- Use strong JWT secrets
- Enable HTTPS in production
- Regular security updates
- Firewall configuration

### Data Protection
- Encrypt sensitive data
- Regular backups
- Access control
- Audit logging

## 📈 Scaling

### Horizontal Scaling
- Load balancer setup
- Multiple server instances
- Database clustering
- CDN distribution

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Caching strategies
- Performance monitoring

## 🆘 Support

### Getting Help
- Check logs first
- Review documentation
- Create GitHub issue
- Contact support team

### Emergency Procedures
- Backup data immediately
- Document the issue
- Contact technical team
- Implement workaround if possible

---

**Remember**: Always test deployments in a staging environment before production!
