import mongoose from 'mongoose';
import axios from 'axios';
import { Shot, ShotModel } from '../models/Shot';
import { Player, PlayerModel } from '../models/Player';
import { Team, TeamModel } from '../models/Team';

class ShotService {
  /**
   * Fetches shot data for a specific player and season
   */
  async getPlayerShots(
    playerId: string,
    season: string,
    filters?: {
      shotTypes?: string[];
      opponent?: string;
      dateRange?: [string, string];
    }
  ): Promise<Shot[]> {
    try {
      let query: any = { playerId, season };
      
      // Apply filters if provided
      if (filters) {
        if (filters.shotTypes && filters.shotTypes.length > 0) {
          query.shotType = { $in: filters.shotTypes };
        }
        
        if (filters.opponent) {
          query.opponent = filters.opponent;
        }
        
        if (filters.dateRange) {
          const [startDate, endDate] = filters.dateRange;
          query.gameDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }
      }
      
      // Find shots matching the query
      const shots = await ShotModel.find(query).exec();
      
      return shots;
    } catch (error) {
      console.error('Error fetching player shots:', error);
      throw new Error('Failed to fetch shot data');
    }
  }
  
  /**
   * Calculates shooting statistics for a player
   */
  async getPlayerShotStats(
    playerId: string,
    season: string,
    filters?: {
      shotTypes?: string[];
      opponent?: string;
      dateRange?: [string, string];
    }
  ): Promise<{
    playerName: string;
    season: string;
    total: { attempts: number; makes: number; percentage: number };
    twoPt: { attempts: number; makes: number; percentage: number };
    threePt: { attempts: number; makes: number; percentage: number };
    freeThrows?: { attempts: number; makes: number; percentage: number };
    zones?: {
      name: string;
      attempts: number;
      makes: number;
      percentage: number;
    }[];
  }> {
    try {
      // Get shots data
      const shots = await this.getPlayerShots(playerId, season, filters);
      
      // Get player name
      const player = await PlayerModel.findOne({ id: playerId }).exec();
      const playerName = player ? player.name : 'Unknown Player';
      
      // Calculate statistics
      const result = {
        playerName,
        season,
        total: { attempts: 0, makes: 0, percentage: 0 },
        twoPt: { attempts: 0, makes: 0, percentage: 0 },
        threePt: { attempts: 0, makes: 0, percentage: 0 },
        freeThrows: { attempts: 0, makes: 0, percentage: 0 },
        zones: this.calculateZoneStats(shots)
      };
      
      // Calculate overall stats
      result.total.attempts = shots.length;
      result.total.makes = shots.filter(shot => shot.made).length;
      result.total.percentage = result.total.attempts > 0 
        ? result.total.makes / result.total.attempts 
        : 0;
      
      // Calculate 2PT stats
      const twoPtShots = shots.filter(shot => shot.shotType === '2PT');
      result.twoPt.attempts = twoPtShots.length;
      result.twoPt.makes = twoPtShots.filter(shot => shot.made).length;
      result.twoPt.percentage = result.twoPt.attempts > 0 
        ? result.twoPt.makes / result.twoPt.attempts 
        : 0;
      
      // Calculate 3PT stats
      const threePtShots = shots.filter(shot => shot.shotType === '3PT');
      result.threePt.attempts = threePtShots.length;
      result.threePt.makes = threePtShots.filter(shot => shot.made).length;
      result.threePt.percentage = result.threePt.attempts > 0 
        ? result.threePt.makes / result.threePt.attempts 
        : 0;
      
      // Calculate Free Throw stats
      const ftShots = shots.filter(shot => shot.shotType === 'FT');
      result.freeThrows.attempts = ftShots.length;
      result.freeThrows.makes = ftShots.filter(shot => shot.made).length;
      result.freeThrows.percentage = result.freeThrows.attempts > 0 
        ? result.freeThrows.makes / result.freeThrows.attempts 
        : 0;
      
      return result;
    } catch (error) {
      console.error('Error calculating player shot stats:', error);
      throw new Error('Failed to calculate shot statistics');
    }
  }
  
  /**
   * Calculates statistics for different court zones
   */
  private calculateZoneStats(shots: Shot[]): {
    name: string;
    attempts: number;
    makes: number;
    percentage: number;
  }[] {
    // Define court zones
    const zones = [
      { name: 'Restricted Area', filter: (shot: Shot) => shot.distance < 4 },
      { name: 'Paint (Non-RA)', filter: (shot: Shot) => shot.distance >= 4 && shot.distance < 14 && Math.abs(shot.x) < 8 },
      { name: 'Mid-Range', filter: (shot: Shot) => shot.shotType === '2PT' && (shot.distance >= 14 || Math.abs(shot.x) >= 8) },
      { name: 'Corner 3', filter: (shot: Shot) => shot.shotType === '3PT' && Math.abs(shot.x) > 22 },
      { name: 'Above Break 3', filter: (shot: Shot) => shot.shotType === '3PT' && Math.abs(shot.x) <= 22 },
    ];
    
    // Calculate stats for each zone
    return zones.map(zone => {
      const zoneShots = shots.filter(zone.filter);
      const attempts = zoneShots.length;
      const makes = zoneShots.filter(shot => shot.made).length;
      const percentage = attempts > 0 ? makes / attempts : 0;
      
      return {
        name: zone.name,
        attempts,
        makes,
        percentage
      };
    });
  }
  
  /**
   * Fetches all available players
   */
  async getPlayers(): Promise<Player[]> {
    try {
      return await PlayerModel.find().sort({ name: 1 }).exec();
    } catch (error) {
      console.error('Error fetching players:', error);
      throw new Error('Failed to fetch players');
    }
  }
  
  /**
   * Fetches all available teams
   */
  async getTeams(): Promise<Team[]> {
    try {
      return await TeamModel.find().sort({ name: 1 }).exec();
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams');
    }
  }
  
  /**
   * Gets available seasons from the database
   */
  async getSeasons(): Promise<string[]> {
    try {
      const seasons = await ShotModel.distinct('season').exec();
      return seasons.sort().reverse(); // Most recent first
    } catch (error) {
      console.error('Error fetching seasons:', error);
      throw new Error('Failed to fetch seasons');
    }
  }
  
  /**
   * Imports shot data from external source (e.g., basketball-reference.com)
   * This would be implemented in a real application but is mocked here
   */
  async importShotData(season: string): Promise<boolean> {
    try {
      console.log(`Importing shot data for season ${season}...`);
      // This would be a real implementation to fetch and process data
      // from external APIs or data sources
      
      // For this sample, we'll just return success
      return true;
    } catch (error) {
      console.error('Error importing shot data:', error);
      throw new Error('Failed to import shot data');
    }
  }
}

export default new ShotService();