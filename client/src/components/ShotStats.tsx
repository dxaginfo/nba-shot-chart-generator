import React from 'react';

interface ShotStatsProps {
  stats: ShotStatsData;
  title?: string;
}

export interface ShotStatsData {
  playerName: string;
  season: string;
  total: {
    attempts: number;
    makes: number;
    percentage: number;
  };
  twoPt: {
    attempts: number;
    makes: number;
    percentage: number;
  };
  threePt: {
    attempts: number;
    makes: number;
    percentage: number;
  };
  freeThrows?: {
    attempts: number;
    makes: number;
    percentage: number;
  };
  zones?: ZoneStats[];
}

interface ZoneStats {
  name: string;
  attempts: number;
  makes: number;
  percentage: number;
}

const ShotStats: React.FC<ShotStatsProps> = ({ stats, title }) => {
  return (
    <div className="shot-stats bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{title || `${stats.playerName} - ${stats.season}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Overall Stats */}
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Overall</h3>
          <p className="text-2xl font-bold text-blue-600">{(stats.total.percentage * 100).toFixed(1)}%</p>
          <p className="text-sm text-gray-600">{stats.total.makes} / {stats.total.attempts}</p>
        </div>
        
        {/* 2PT Stats */}
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500 mb-1">2-Pointers</h3>
          <p className="text-2xl font-bold text-blue-600">{(stats.twoPt.percentage * 100).toFixed(1)}%</p>
          <p className="text-sm text-gray-600">{stats.twoPt.makes} / {stats.twoPt.attempts}</p>
        </div>
        
        {/* 3PT Stats */}
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500 mb-1">3-Pointers</h3>
          <p className="text-2xl font-bold text-blue-600">{(stats.threePt.percentage * 100).toFixed(1)}%</p>
          <p className="text-sm text-gray-600">{stats.threePt.makes} / {stats.threePt.attempts}</p>
        </div>
        
        {/* Free Throws */}
        {stats.freeThrows && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Free Throws</h3>
            <p className="text-2xl font-bold text-blue-600">{(stats.freeThrows.percentage * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-600">{stats.freeThrows.makes} / {stats.freeThrows.attempts}</p>
          </div>
        )}
      </div>
      
      {/* Zone Breakdown if available */}
      {stats.zones && stats.zones.length > 0 && (
        <>
          <h3 className="text-lg font-medium mb-3">Zone Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FG%
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Makes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempts
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.zones.map((zone, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {zone.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(zone.percentage * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {zone.makes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {zone.attempts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* Hot Zones Visualization */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Distance Efficiency</h3>
        <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center">
          {/* This would be a D3.js chart in a real implementation */}
          <p className="text-gray-400 italic">Distance efficiency chart visualization would go here</p>
        </div>
      </div>
    </div>
  );
};

export default ShotStats;