# NBA Shot Chart Generator

An interactive web application for visualizing and analyzing NBA player shooting patterns, efficiency, and trends.

![NBA Shot Chart Generator](./docs/assets/screenshot.png)

## Overview

The NBA Shot Chart Generator allows users to create detailed, customizable visualizations of NBA player shot data. This tool enables coaches, analysts, and fans to identify shooting patterns, hot/cold zones, and track performance over time.

## Features

### Core Features
- **Player Shot Visualization**: Display shot locations on an interactive court diagram
- **Efficiency Heatmaps**: View shooting percentages by court zone with customizable color gradients
- **Multi-Player Comparison**: Compare shooting patterns between different players
- **Time Period Filtering**: Analyze shots by season, month, game, or custom date range
- **Shot Type Filtering**: Filter by shot type (2PT, 3PT, free throws)
- **Shot Result Filtering**: Show makes, misses, or both
- **Statistics Summary**: View shooting percentages and statistics alongside visualizations

### Advanced Features
- **Shot Trend Analysis**: Track shooting trends and performance over time
- **Zone Efficiency Metrics**: Detailed stats for predefined court zones
- **Export Options**: Download visualizations as images or raw data
- **Responsive Design**: Works on desktop and mobile devices
- **Sharable Links**: Generate links to share specific chart views

## Technology Stack

### Frontend
- React with TypeScript
- D3.js for data visualization
- TailwindCSS for styling
- React Router for navigation
- React Query for data fetching and caching

### Backend
- Node.js with Express
- MongoDB for data storage
- API integration with basketball statistics providers

## Application Architecture

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│    React Client   │◄────►│  Express Backend  │◄────►│  MongoDB Database │
│                   │      │                   │      │                   │
└───────────────────┘      └───────────────────┘      └───────────────────┘
         ▲                          │
         │                          ▼
┌────────────────┐       ┌───────────────────┐
│                │       │                   │
│  User Browser  │       │  Basketball Stats │
│                │       │       API         │
└────────────────┘       └───────────────────┘
```

## Data Sources

The application uses:
1. Historical NBA shot data from basketball-reference.com
2. Optional integration with NBA Stats API for live data (API key required)
3. Local database for caching and user preferences

## Installation and Setup

### Prerequisites
- Node.js 18.x or higher
- MongoDB
- npm or yarn

### Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/nba-shot-chart-generator.git
cd nba-shot-chart-generator
```

2. Install dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Configure environment variables
```bash
# Create .env file in server directory
cp server/.env.example server/.env
# Edit the file with your configuration
```

4. Start development servers
```bash
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend
cd client
npm start
```

5. Access the application at http://localhost:3000

## Deployment

### Backend Deployment
- Deploy the Express backend to services like Heroku, Railway, or Render
- Configure environment variables in your hosting platform

### Frontend Deployment
- Build the React frontend: `cd client && npm run build`
- Deploy to services like Netlify, Vercel, or GitHub Pages

## Usage Examples

### Basic Shot Chart
```javascript
// Example API usage
const shotChart = new ShotChart({
  playerId: '2544', // LeBron James
  season: '2022-23',
  chartType: 'scatter',
  showMisses: true,
  showMakes: true,
  courtZones: false
});

shotChart.render('#chart-container');
```

### Zone Efficiency Heatmap
```javascript
// Example API usage
const heatmap = new ShotChart({
  playerId: '201939', // Stephen Curry
  season: '2022-23',
  chartType: 'heatmap',
  zoneMethod: 'hexbin', // or 'grid'
  zoneSize: 'medium',
  colorScale: 'redYellowGreen'
});

heatmap.render('#heatmap-container');
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Shot chart visualization inspired by Kirk Goldsberry's work
- NBA data providers
- Open-source libraries used in this project