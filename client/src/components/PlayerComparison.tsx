import React, { useState } from 'react';
import { ShotStatsData } from './ShotStats';
import * as d3 from 'd3';

interface PlayerComparisonProps {
  players: Player[];
  season: string;
  onPlayerSelect: (playerIds: string[]) => void;
  statsData?: Record<string, ShotStatsData>;
}

interface Player {
  id: string;
  name: string;
}

const PlayerComparison: React.FC<PlayerComparisonProps> = ({
  players,
  season,
  onPlayerSelect,
  statsData
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'overall' | 'zone' | 'distance'>('overall');
  
  const handlePlayerToggle = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      // Limit to 3 players for comparison
      if (selectedPlayers.length < 3) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };
  
  const handleCompare = () => {
    if (selectedPlayers.length > 0) {
      onPlayerSelect(selectedPlayers);
    }
  };
  
  // Render the comparison chart based on statsData
  const renderComparisonChart = () => {
    if (!statsData || Object.keys(statsData).length === 0) {
      return (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
          <p className="text-gray-400 italic">Select players and click Compare to see data</p>
        </div>
      );
    }
    
    // This would use D3.js in a real implementation to create comparison charts
    // For now, we'll create a simple bar chart visualization
    
    const svgRef = React.useRef<SVGSVGElement>(null);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    React.useEffect(() => {
      if (!svgRef.current || !statsData) return;
      
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      
      const playerIds = Object.keys(statsData);
      
      if (comparisonType === 'overall') {
        // Setup data for overall shooting percentages
        const data = playerIds.map(id => {
          const stats = statsData[id];
          return [
            { playerId: id, playerName: stats.playerName, category: 'Overall', value: stats.total.percentage },
            { playerId: id, playerName: stats.playerName, category: '2PT', value: stats.twoPt.percentage },
            { playerId: id, playerName: stats.playerName, category: '3PT', value: stats.threePt.percentage }
          ];
        }).flat();
        
        // Scales
        const xScale = d3.scaleBand()
          .domain(['Overall', '2PT', '3PT'])
          .range([0, innerWidth])
          .padding(0.2);
        
        const yScale = d3.scaleLinear()
          .domain([0, 1])
          .range([innerHeight, 0]);
        
        const colorScale = d3.scaleOrdinal()
          .domain(playerIds)
          .range(['#2563EB', '#DC2626', '#047857']);
        
        const g = svg.append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // X and Y axes
        g.append('g')
          .attr('transform', `translate(0, ${innerHeight})`)
          .call(d3.axisBottom(xScale));
        
        g.append('g')
          .call(d3.axisLeft(yScale).tickFormat(d => `${(d as number * 100).toFixed(0)}%`));
        
        // Group data by category
        const groupedData: Record<string, any[]> = {};
        data.forEach(d => {
          if (!groupedData[d.category]) {
            groupedData[d.category] = [];
          }
          groupedData[d.category].push(d);
        });
        
        // Bar width for grouped bars
        const subBarWidth = xScale.bandwidth() / playerIds.length;
        
        // Draw bars
        Object.keys(groupedData).forEach(category => {
          groupedData[category].forEach((d, i) => {
            g.append('rect')
              .attr('x', (xScale(category) || 0) + i * subBarWidth)
              .attr('y', yScale(d.value))
              .attr('width', subBarWidth)
              .attr('height', innerHeight - yScale(d.value))
              .attr('fill', colorScale(d.playerId))
              .append('title')
              .text(`${d.playerName}: ${(d.value * 100).toFixed(1)}%`);
          });
        });
        
        // Legend
        const legend = svg.append('g')
          .attr('transform', `translate(${margin.left}, ${height - 20})`);
        
        playerIds.forEach((id, i) => {
          const g = legend.append('g')
            .attr('transform', `translate(${i * 150}, 0)`);
          
          g.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', colorScale(id));
          
          g.append('text')
            .attr('x', 20)
            .attr('y', 12.5)
            .text(statsData[id].playerName)
            .attr('font-size', '12px')
            .attr('font-family', 'Arial');
        });
      }
      
      // Similar implementation for zone and distance comparisons would go here
      
    }, [statsData, comparisonType]);
    
    return (
      <div className="overflow-x-auto">
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
    );
  };
  
  return (
    <div className="player-comparison bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Player Comparison</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Players to Compare (max 3)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {players.map(player => (
            <div 
              key={player.id}
              className={`p-2 border rounded-md cursor-pointer text-sm ${
                selectedPlayers.includes(player.id)
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handlePlayerToggle(player.id)}
            >
              {player.name}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comparison Type
          </label>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value as any)}
          >
            <option value="overall">Overall Percentages</option>
            <option value="zone">Zone Efficiency</option>
            <option value="distance">Distance Analysis</option>
          </select>
        </div>
        
        <div className="ml-auto">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleCompare}
            disabled={selectedPlayers.length === 0}
          >
            Compare
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">{comparisonType === 'overall' ? 'Shooting Percentage Comparison' : comparisonType === 'zone' ? 'Zone Efficiency Comparison' : 'Distance Analysis Comparison'}</h3>
        {renderComparisonChart()}
      </div>
    </div>
  );
};

export default PlayerComparison;