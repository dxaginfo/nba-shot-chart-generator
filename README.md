# NBA Shot Chart Generator

A comprehensive web application for visualizing and analyzing NBA player shooting data with interactive shot charts, statistical analysis, and player comparisons.

![NBA Shot Chart Generator Screenshot](docs/assets/screenshot.png)

## Features

- **Interactive Shot Charts**: Visualize player shooting patterns with customizable scatter plots or heat maps
- **Statistical Analysis**: View comprehensive shooting statistics by zone, distance, and shot type
- **Player Comparison**: Compare shooting efficiency between multiple players
- **Customizable Filters**: Filter by season, opponent, shot types, and more
- **Responsive Design**: Fully responsive interface works on desktop and mobile devices

## Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript for improved developer experience
- **D3.js**: Data visualization library for rendering shot charts and statistical graphs
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for creating the API
- **MongoDB**: NoSQL database for storing shot data
- **Mongoose**: MongoDB object modeling for Node.js

## Architecture

The application follows a client-server architecture:

1. **Client (React)**: Handles user interface, data visualization, and user interactions
2. **Server (Express)**: Provides RESTful API endpoints for data retrieval and processing
3. **Database (MongoDB)**: Stores player, team, and shot data

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │      │                  │
│   React Client   │◄────►│  Express Backend │◄────►│ MongoDB Database │
│                  │      │                  │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        ▲                          │
        │                          ▼
┌──────────────┐          ┌──────────────────┐
│              │          │                  │
│ User Browser │          │ Basketball Stats │
│              │          │      API         │
└──────────────┘          └──────────────────┘
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/nba-shot-chart-generator.git
   cd nba-shot-chart-generator
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Update the MongoDB connection string and other configuration as needed

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Data Sources

This application uses NBA shot data from:
- Official NBA Stats API
- Basketball-Reference.com
- Other public basketball statistics sources

Note: To use the application with real data, you'll need to implement the data import functionality or populate the database with sample data.

## Usage Examples

### Creating a Basic Shot Chart

1. Select a player from the dropdown menu
2. Choose a season
3. Adjust filters as needed (shot types, makes/misses, etc.)
4. View the generated shot chart

### Comparing Multiple Players

1. Navigate to the "Player Comparison" tab
2. Select 2-3 players to compare
3. Choose the comparison type (overall percentages, zone efficiency, etc.)
4. Click "Compare" to generate the comparison visualization

### Analyzing Zone Efficiency

1. Select a player and season
2. Enable the "Heat Map" option
3. Choose your preferred zone method (hexbin or grid) and size
4. View the color-coded efficiency visualization

## Main Components

1. **CourtVisualization**: Renders the basketball court and plots shots or heatmaps
2. **ShotChartControls**: Provides UI controls for filtering and customizing visualizations
3. **ShotStats**: Displays shooting statistics based on the selected filters
4. **PlayerComparison**: Enables comparison between multiple players' shooting data

## Backend Services

1. **ShotService**: Handles shot data retrieval and statistical calculations
2. **Models**: MongoDB models for Shot, Player, and Team data
3. **Controllers**: API endpoints for retrieving and filtering data

## Future Enhancements

- **Advanced Filters**: Add game situation filters (clutch time, score differential, etc.)
- **Team Analysis**: Add team-level shot charts and comparison tools
- **Video Integration**: Link shots to video highlights where available
- **User Accounts**: Allow users to save favorite players and custom charts
- **Export Options**: Enable exporting charts as images or PDFs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- NBA for providing the statistical data
- D3.js community for visualization resources
- React and Node.js communities for excellent documentation and resources