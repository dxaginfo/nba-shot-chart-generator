import React, { useState } from 'react';

interface ShotChartControlsProps {
  onFilterChange: (filters: ShotChartFilters) => void;
  seasons: string[];
  players: Player[];
  teams: Team[];
}

export interface ShotChartFilters {
  player: string;
  season: string;
  showMakes: boolean;
  showMisses: boolean;
  shotTypes: ('2PT' | '3PT' | 'FT')[];
  dateRange: [string, string] | null;
  opponent: string | null;
  heatmap: boolean;
  zoneMethod: 'hexbin' | 'grid';
  zoneSize: 'small' | 'medium' | 'large';
  colorScale: string;
  minShotsInZone: number;
}

interface Player {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

const ShotChartControls: React.FC<ShotChartControlsProps> = ({
  onFilterChange,
  seasons,
  players,
  teams
}) => {
  const [filters, setFilters] = useState<ShotChartFilters>({
    player: players.length > 0 ? players[0].id : '',
    season: seasons.length > 0 ? seasons[0] : '',
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

  const handleChange = (name: keyof ShotChartFilters, value: any) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleShotTypeChange = (type: '2PT' | '3PT' | 'FT', checked: boolean) => {
    const updatedShotTypes = checked
      ? [...filters.shotTypes, type]
      : filters.shotTypes.filter(t => t !== type);
    
    handleChange('shotTypes', updatedShotTypes);
  };

  return (
    <div className="shot-chart-controls bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Shot Chart Options</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Player
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.player}
            onChange={(e) => handleChange('player', e.target.value)}
          >
            {players.map(player => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* Season Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Season
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.season}
            onChange={(e) => handleChange('season', e.target.value)}
          >
            {seasons.map(season => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shot Type Filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shot Types
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={filters.shotTypes.includes('2PT')}
              onChange={(e) => handleShotTypeChange('2PT', e.target.checked)}
            />
            <span className="ml-2">2-Pointers</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={filters.shotTypes.includes('3PT')}
              onChange={(e) => handleShotTypeChange('3PT', e.target.checked)}
            />
            <span className="ml-2">3-Pointers</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={filters.shotTypes.includes('FT')}
              onChange={(e) => handleShotTypeChange('FT', e.target.checked)}
            />
            <span className="ml-2">Free Throws</span>
          </label>
        </div>
      </div>

      {/* Show Makes/Misses */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shot Results
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-green-600"
              checked={filters.showMakes}
              onChange={(e) => handleChange('showMakes', e.target.checked)}
            />
            <span className="ml-2">Made Shots</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-red-600"
              checked={filters.showMisses}
              onChange={(e) => handleChange('showMisses', e.target.checked)}
            />
            <span className="ml-2">Missed Shots</span>
          </label>
        </div>
      </div>

      {/* Team Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opponent (Optional)
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={filters.opponent || ''}
          onChange={(e) => handleChange('opponent', e.target.value || null)}
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Visualization Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Visualization Type
        </label>
        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-600"
              checked={!filters.heatmap}
              onChange={() => handleChange('heatmap', false)}
            />
            <span className="ml-2">Scatter Plot</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-600"
              checked={filters.heatmap}
              onChange={() => handleChange('heatmap', true)}
            />
            <span className="ml-2">Heat Map</span>
          </label>
        </div>
      </div>

      {/* Heatmap Options */}
      {filters.heatmap && (
        <div className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Heat Map Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone Method
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.zoneMethod}
                onChange={(e) => handleChange('zoneMethod', e.target.value)}
              >
                <option value="hexbin">Hexagon Bins</option>
                <option value="grid">Grid Cells</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone Size
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.zoneSize}
                onChange={(e) => handleChange('zoneSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Scale
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.colorScale}
                onChange={(e) => handleChange('colorScale', e.target.value)}
              >
                <option value="redYellowGreen">Red to Green</option>
                <option value="viridis">Viridis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Shots in Zone
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
                max="50"
                value={filters.minShotsInZone}
                onChange={(e) => handleChange('minShotsInZone', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => setFilters({
            player: players.length > 0 ? players[0].id : '',
            season: seasons.length > 0 ? seasons[0] : '',
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
          })}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ShotChartControls;