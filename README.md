# Gamified Learning Platform for Rural STEM Education

An offline-first, multilingual web platform designed to increase student engagement by ≥15% in rural schools through gamified STEM lessons and comprehensive teacher analytics.

## 🎯 Project Overview

This platform addresses the unique challenges of rural education by providing:
- **Offline-first functionality** for areas with intermittent internet
- **Gamified learning modules** to increase engagement
- **Multilingual support** for local communities
- **Teacher analytics** for progress tracking
- **Low-cost device compatibility** for resource-constrained environments

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser with IndexedDB support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gamified-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Development Mode

For development with hot reloading:

```bash
npm run dev
```

## 🎮 Features

### Student Features
- **Interactive Learning Modules**: Math, Science, Physics, Chemistry
- **Gamification**: Points, badges, levels, streaks
- **Offline Support**: Works without internet connection
- **Progress Tracking**: Visual progress indicators
- **Multilingual UI**: English, Spanish, French, Hindi, Swahili

### Teacher Features
- **Class Management**: Student rosters and progress tracking
- **Analytics Dashboard**: Engagement metrics and performance data
- **Report Generation**: Printable reports and data export
- **Assignment Creation**: Custom module assignments

### Admin Features
- **School Management**: Multi-school support
- **User Management**: Student and teacher accounts
- **System Analytics**: Platform-wide metrics
- **Content Management**: Module and content administration

## 🔧 Technical Architecture

### Frontend
- **Framework**: Vanilla JavaScript with ES6 modules
- **Offline Storage**: IndexedDB with localForage
- **Service Workers**: For offline functionality
- **Responsive Design**: Mobile-first approach
- **PWA Support**: Installable web app

### Backend
- **Runtime**: Node.js with Express
- **Authentication**: JWT-based
- **API**: RESTful endpoints
- **Data Storage**: In-memory (mock data for demo)
- **Analytics**: Event tracking and reporting

### Offline Strategy
- **Content Caching**: Modules stored locally
- **Progress Sync**: Background synchronization
- **Conflict Resolution**: Server-authoritative approach
- **Data Persistence**: Local storage with sync queue

## 📱 Device Compatibility

### Target Devices
- **Android Tablets**: 8+ with 1-2GB RAM
- **Chromebooks**: Low-cost educational devices
- **Laptops**: Windows/Linux with modern browsers
- **Feature Phones**: Basic browser support

### Performance Optimizations
- **Asset Compression**: Optimized images and audio
- **Lazy Loading**: On-demand content loading
- **Memory Management**: Efficient resource usage
- **Touch-Friendly**: Large touch targets

## 🌍 Localization

### Supported Languages
- English (en)
- Spanish (es)
- French (fr)
- Hindi (hi)
- Swahili (sw)

### Adding New Languages
1. Add language code to `supportedLanguages` array
2. Create translation object in `getTranslationsForLanguage()`
3. Update UI components to use `localization.t()` method

## 📊 Analytics & Metrics

### Key Performance Indicators
- **Engagement**: Weekly active students, session duration
- **Learning**: Module completion rates, average scores
- **Usage**: Time spent, hints used, retry attempts
- **Progress**: Grade-level advancement, skill mastery

### Measuring Success
- **Baseline Collection**: Pre-deployment metrics
- **Post-Deployment**: 1-3 month comparison
- **Statistical Analysis**: Paired t-test for significance
- **Target**: ≥15% engagement improvement

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Configure `.env` file
2. **Database**: Set up PostgreSQL/MySQL
3. **File Storage**: Configure asset storage
4. **SSL Certificate**: Enable HTTPS
5. **CDN**: Set up content delivery network

### Low-Cost Deployment
- **Raspberry Pi**: Local school server
- **SD Card Distribution**: Pre-loaded content
- **USB Installation**: Offline setup method
- **School Hub**: Teacher device as local server

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Unit tests for core utilities
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance tests for offline functionality

## 📈 Roadmap

### Phase 1 (MVP) - 4-8 weeks
- [x] Core offline functionality
- [x] Basic gamification
- [x] Teacher dashboard
- [x] Multilingual support
- [x] Analytics framework

### Phase 2 - 8-12 weeks
- [ ] Advanced analytics
- [ ] Content management system
- [ ] Mobile app (React Native)
- [ ] Advanced gamification
- [ ] Parent portal

### Phase 3 - 12-16 weeks
- [ ] AI-powered recommendations
- [ ] Advanced reporting
- [ ] Integration with school systems
- [ ] Advanced offline features
- [ ] Performance optimizations

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use ESLint for JavaScript
- Follow existing patterns
- Add comments for complex logic
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Rural education communities
- Open source contributors
- Educational technology researchers
- Teachers and students who provided feedback

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@learnstem.org
- Documentation: [docs.learnstem.org](https://docs.learnstem.org)

---

**Built with ❤️ for rural education**
