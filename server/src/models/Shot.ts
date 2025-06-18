import mongoose, { Document, Schema } from 'mongoose';

export interface Shot extends Document {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  opponent: string;
  gameId: string;
  gameDate: Date;
  season: string;
  period: number;
  minutesRemaining: number;
  secondsRemaining: number;
  shotType: '2PT' | '3PT' | 'FT';
  shotZone: string;
  shotDistance: number;
  shotResult: string;
  made: boolean;
  x: number;
  y: number;
  distance: number;
  description: string;
}

const ShotSchema = new Schema<Shot>({
  playerId: { type: String, required: true, index: true },
  playerName: { type: String, required: true },
  teamId: { type: String, required: true, index: true },
  teamName: { type: String, required: true },
  opponent: { type: String, required: true, index: true },
  gameId: { type: String, required: true, index: true },
  gameDate: { type: Date, required: true, index: true },
  season: { type: String, required: true, index: true },
  period: { type: Number, required: true },
  minutesRemaining: { type: Number, required: true },
  secondsRemaining: { type: Number, required: true },
  shotType: { type: String, enum: ['2PT', '3PT', 'FT'], required: true, index: true },
  shotZone: { type: String, required: true },
  shotDistance: { type: Number, required: true },
  shotResult: { type: String, required: true },
  made: { type: Boolean, required: true, index: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  distance: { type: Number, required: true },
  description: { type: String, required: true },
}, {
  timestamps: true
});

// Create indexes for common queries
ShotSchema.index({ playerId: 1, season: 1 });
ShotSchema.index({ playerId: 1, gameId: 1 });
ShotSchema.index({ teamId: 1, season: 1 });
ShotSchema.index({ shotType: 1, made: 1 });
ShotSchema.index({ shotDistance: 1 });

export const ShotModel = mongoose.model<Shot>('Shot', ShotSchema);