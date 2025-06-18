import React, { useState, useEffect } from 'react';
import CourtVisualization from './components/CourtVisualization';
import ShotChartControls, { ShotChartFilters } from './components/ShotChartControls';
import ShotStats, { ShotStatsData } from './components/ShotStats';
import PlayerComparison from './components/PlayerComparison';
import { fetchPlayers, fetchTeams, fetchSeasons, fetchPlayerShots, fetchPlayerStats } from './services/api';

interface Shot {
  x: number;
  y: number;
  made: boolean;
  shotType: '2PT' | '3PT' | 'FT';
  distance: number;
  gameDate: string;
  opponent: string;
  period: number;
  playerId: string;
  playerName: string;
}

interface Player {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

const App: React.FC = () => {
  // State for data
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [stats, setStats] = useState<ShotStatsData | null>(null);
  const [comparisonStats, setComparisonStats] = useState<Record<string, ShotStatsData>>({});
  
  // State for UI
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'individual' | 'comparison'>('individual');
  
  // Default filters
  const [filters, setFilters] = useState<ShotChartFilters>({
    player: '',
    season: '',
    showMakes: true,
    showMisses: true,
    shotTypes: ['2PT', '3PT'],
    dateRange: null,
    opponent: null,
    heatmap: false,
    zoneMethod: 'hexbin',
    zoneSize: 'medium',
    colorScale: 'redYellowGreen',
    minShotsInZone: 1
  });
  
  // Load reference data on component mount
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setLoading(true);
        
        // Fetch players, teams, and seasons in parallel
        const [playersData, teamsData, seasonsData] = await Promise.all([
          fetchPlayers(),
          fetchTeams(),
          fetchSeasons()
        ]);
        
        setPlayers(playersData);
        setTeams(teamsData);
        setSeasons(seasonsData);
        
        // Set default filter values
        if (playersData.length > 0 && seasonsData.length > 0) {
          setFilters(prev => ({
            ...prev,
            player: playersData[0].id,
            season: seasonsData[0]
          }));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load reference data');
        setLoading(false);
        console.error('Error loading reference data:', err);
      }
    };
    
    loadReferenceData();
  }, []);
  
  // Load shot data when filters change
  useEffect(() => {
    const loadShotData = async () => {
      // Only fetch if we have a player and season selected
      if (!filters.player || !filters.season) return;
      
      try {
        setLoading(true);
        
        // Fetch shots and stats in parallel
        const [shotsData, statsData] = await Promise.all([
          fetchPlayerShots(filters.player, filters.season, {
            shotTypes: filters.shotTypes,
            opponent: filters.opponent,
            dateRange: filters.dateRange
          }),
          fetchPlayerStats(filters.player, filters.season, {
            shotTypes: filters.shotTypes,
            opponent: filters.opponent,
            dateRange: filters.dateRange
          })
        ]);
        
        setShots(shotsData);
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shot data');
        setLoading(false);
        console.error('Error loading shot data:', err);
      }
    };
    
    loadShotData();
  }, [filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: ShotChartFilters) => {
    setFilters(newFilters);
  };
  
  // Handle player comparison selection
  const handlePlayerCompare = async (playerIds: string[]) => {
    try {
      setLoading(true);
      
      // Fetch stats for each selected player
      const statsPromises = playerIds.map(playerId => 
        fetchPlayerStats(playerId, filters.season, {
          shotTypes: filters.shotTypes,
          opponent: filters.opponent,
          dateRange: filters.dateRange
        })
      );
      
      const statsResults = await Promise.all(statsPromises);
      
      // Create object with player IDs as keys
      const statsMap: Record<string, ShotStatsData> = {};
      playerIds.forEach((id, index) => {
        statsMap[id] = statsResults[index];
      });
      
      setComparisonStats(statsMap);
      setLoading(false);
    } catch (err) {
      setError('Failed to load comparison data');
      setLoading(false);
      console.error('Error loading comparison data:', err);
    }
  };
  
  // Filter shots based on current filters
  const filteredShots = shots.filter(shot => 
    (shot.made && filters.showMakes) || (!shot.made && filters.showMisses)
  ).filter(shot => 
    filters.shotTypes.includes(shot.shotType)
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-3xl font-bold">NBA Shot Chart Generator</h1>
          <p className="text-blue-100">Visualize and analyze NBA player shooting patterns</p>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'individual'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('individual')}
              >
                Individual Analysis
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'comparison'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('comparison')}
              >
                Player Comparison
              </button>
            </nav>
          </div>
        </div>
        
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-500">Loading data...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {/* Individual Analysis Tab */}
        {activeTab === 'individual' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters Panel */}
            <div className="lg:col-span-1">
              <ShotChartControls
                onFilterChange={handleFilterChange}
                seasons={seasons}
                players={players}
                teams={teams}
              />
            </div>
            
            {/* Visualization and Stats */}
            <div className="lg:col-span-2">
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Shot Chart</h2>
                <div className="court-container">
                  <CourtVisualization
                    shots={filteredShots}
                    showMakes={filters.showMakes}
                    showMisses={filters.showMisses}
                    heatmap={filters.heatmap}
                    zoneMethod={filters.zoneMethod}
                    zoneSize={filters.zoneSize}
                    colorScale={filters.colorScale}
                  />
                </div>
              </div>
              
              {stats && (
                <ShotStats stats={stats} />
              )}
            </div>
          </div>
        )}
        
        {/* Player Comparison Tab */}
        {activeTab === 'comparison' && (
          <div>
            <PlayerComparison 
              players={players}
              season={filters.season}
              onPlayerSelect={handlePlayerCompare}
              statsData={comparisonStats}
            />
          </div>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold">NBA Shot Chart Generator</h3>
              <p className="text-gray-400 mt-2">
                Visualize and analyze NBA player shooting patterns and efficiency
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-gray-400">Data sourced from public NBA statistics</p>
              <p className="text-gray-400">© 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;