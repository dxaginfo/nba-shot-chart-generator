import mongoose, { Document, Schema } from 'mongoose';

export interface Player extends Document {
  id: string;
  name: string;
  fullName: string;
  position: string;
  height: string;
  weight: number;
  jerseyNumber: string;
  teamId: string;
  teamName: string;
  seasons: string[];
  active: boolean;
}

const PlayerSchema = new Schema<Player>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  fullName: { type: String, required: true },
  position: { type: String },
  height: { type: String },
  weight: { type: Number },
  jerseyNumber: { type: String },
  teamId: { type: String, required: true, index: true },
  teamName: { type: String, required: true },
  seasons: [{ type: String }],
  active: { type: Boolean, default: true, index: true }
}, {
  timestamps: true
});

// Create text index for search functionality
PlayerSchema.index({ name: 'text', fullName: 'text' });

export const PlayerModel = mongoose.model<Player>('Player', PlayerSchema);