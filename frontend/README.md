# Aircraft Maintenance Tracker - Frontend

🎨 Production-ready React + Vite dashboard for real-time aircraft maintenance tracking.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── pages/
│   │   ├── dashboard/        # Dashboard home
│   │   ├── aircraft/         # Aircraft management pages
│   │   ├── history/          # Maintenance history
│   │   ├── analytics/        # Analytics & insights
│   │   └── NotFound.jsx      # 404 page
│   └── shared/
│       ├── layouts/          # Header & Sidebar
│       ├── forms/            # Reusable forms
│       └── *.jsx             # Shared components
├── context/
│   ├── AircraftContext.jsx   # Aircraft state management
│   └── ThemeContext.jsx      # Theme provider
├── hooks/
│   ├── useAircraft.js        # Aircraft context hook
│   └── useDarkMode.js        # Dark mode hook
├── services/
│   └── aircraftService.js    # API client
├── utils/
│   └── helpers.js            # Utility functions
├── App.jsx                   # Main app component
└── main.jsx                  # Entry point
```

## 📊 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | KPIs, charts, recent activity |
| `/aircrafts` | Aircraft List | Searchable table with filters |
| `/aircrafts/add` | Add Aircraft | Registration form |
| `/aircrafts/active` | Active Maintenance | In-progress aircraft cards |
| `/aircrafts/today` | Today's Schedule | Today's maintenance schedule |
| `/history` | History Timeline | Complete status change history |
| `/analytics` | Analytics | Status distribution, workload analysis |

## 🎨 Features

✅ **Dashboard**
- KPI cards with animations
- Status distribution pie chart
- Completion progress indicator
- Active maintenance summary

✅ **Aircraft Management**
- Full CRUD operations
- Real-time search & filtering
- Status validation
- History tracking

✅ **Data Visualization**
- Recharts integration
- Multiple chart types
- Responsive layouts
- Dark mode support

✅ **State Management**
- Context API
- LocalStorage persistence
- Custom hooks
- Activity logging

✅ **UI/UX**
- Material UI components
- Dark/Light theme
- Responsive design
- Toast notifications
- Loading states
- Smooth animations

## 📦 Dependencies

### Core
- `react@18` - UI library
- `react-router-dom@6` - Routing
- `react-dom@18` - DOM rendering

### UI Components
- `@mui/material@5` - Material Design
- `@mui/icons-material@5` - Icons

### Forms & Validation
- `react-hook-form@7` - Form management

### API & Data
- `axios@1` - HTTP client
- `recharts@2` - Charting library
- `dayjs@1` - Date manipulation
- `uuid@9` - ID generation

### Notifications
- `react-hot-toast@2` - Toast notifications

### Animations
- `framer-motion@10` - Animation library

### Styling
- `@emotion/react@11` - CSS-in-JS
- `@emotion/styled@11` - Styled components

## 🌙 Dark Mode

The application supports dark and light themes:
- Toggle in sidebar
- Preference saved to localStorage
- Applied globally via Material UI theme

## 🔄 State Management

### AircraftContext
- **aircrafts**: Array of aircraft objects
- **activityLog**: Recent activity events
- **addAircraft()**: Register new aircraft
- **updateStatus()**: Change aircraft status
- **deleteAircraft()**: Remove aircraft
- **getStatistics()**: Get summary stats
- **getActiveAircrafts()**: Filter in-progress
- **getTodayAircrafts()**: Filter today's schedule

### LocalStorage
- Persists aircrafts list
- Persists activity log
- Persists dark mode preference

## 🧪 Testing

```bash
npm run test          # Run tests
npm run test:ui       # Test UI dashboard
```

Tests use:
- `vitest` - Test runner
- `@testing-library/react` - React testing utilities
- `jsdom` - DOM simulation

## 🌐 API Integration

The frontend communicates with the backend API:

```
Backend Base URL: http://localhost:5000/api
```

### Key Endpoints
- `GET /aircrafts` - List all
- `POST /aircrafts` - Create
- `PUT /aircrafts/:id/status` - Update status
- `GET /aircrafts/active/list` - Active only
- `GET /aircrafts/schedule/today` - Today's schedule
- `GET /aircrafts/:id/history` - Status history

## 🎯 Best Practices

1. **Components**: Use functional components with hooks
2. **State**: Leverage Context API + custom hooks
3. **Forms**: Use React Hook Form for validation
4. **Styling**: Material UI theme for consistency
5. **Performance**: Memoization + lazy loading
6. **Accessibility**: ARIA labels + semantic HTML
7. **Error Handling**: Try-catch + user feedback
8. **Code Organization**: Feature-based structure

## 🚀 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] User authentication
- [ ] Advanced filtering & sorting
- [ ] Export to PDF/Excel
- [ ] Multi-language support
- [ ] Role-based access control
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 👨‍💻 Author

Built as a demonstration of modern React architecture with Material UI.
