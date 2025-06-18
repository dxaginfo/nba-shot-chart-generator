import { Request, Response } from 'express';
import ShotService from '../services/ShotService';

export default class ShotController {
  /**
   * Get shots for a specific player and season
   */
  async getPlayerShots(req: Request, res: Response): Promise<void> {
    try {
      const { playerId, season } = req.params;
      const { shotTypes, opponent, startDate, endDate } = req.query;
      
      // Build filters
      const filters: any = {};
      
      if (shotTypes) {
        filters.shotTypes = Array.isArray(shotTypes) 
          ? shotTypes 
          : [shotTypes];
      }
      
      if (opponent) {
        filters.opponent = opponent;
      }
      
      if (startDate && endDate) {
        filters.dateRange = [startDate, endDate];
      }
      
      const shots = await ShotService.getPlayerShots(playerId, season, filters);
      
      res.json({
        success: true,
        data: shots
      });
    } catch (error) {
      console.error('Error fetching player shots:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shot data'
      });
    }
  }
  
  /**
   * Get shot statistics for a player
   */
  async getPlayerShotStats(req: Request, res: Response): Promise<void> {
    try {
      const { playerId, season } = req.params;
      const { shotTypes, opponent, startDate, endDate } = req.query;
      
      // Build filters
      const filters: any = {};
      
      if (shotTypes) {
        filters.shotTypes = Array.isArray(shotTypes) 
          ? shotTypes 
          : [shotTypes];
      }
      
      if (opponent) {
        filters.opponent = opponent;
      }
      
      if (startDate && endDate) {
        filters.dateRange = [startDate, endDate];
      }
      
      const stats = await ShotService.getPlayerShotStats(playerId, season, filters);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching player shot stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shot statistics'
      });
    }
  }
  
  /**
   * Get all available players
   */
  async getPlayers(req: Request, res: Response): Promise<void> {
    try {
      const players = await ShotService.getPlayers();
      
      res.json({
        success: true,
        data: players
      });
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch players'
      });
    }
  }
  
  /**
   * Get all available teams
   */
  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const teams = await ShotService.getTeams();
      
      res.json({
        success: true,
        data: teams
      });
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch teams'
      });
    }
  }
  
  /**
   * Get all available seasons
   */
  async getSeasons(req: Request, res: Response): Promise<void> {
    try {
      const seasons = await ShotService.getSeasons();
      
      res.json({
        success: true,
        data: seasons
      });
    } catch (error) {
      console.error('Error fetching seasons:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch seasons'
      });
    }
  }
  
  /**
   * Import shot data from external source
   */
  async importShotData(req: Request, res: Response): Promise<void> {
    try {
      const { season } = req.params;
      
      const result = await ShotService.importShotData(season);
      
      res.json({
        success: true,
        message: `Successfully imported shot data for ${season}`
      });
    } catch (error) {
      console.error('Error importing shot data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to import shot data'
      });
    }
  }
}