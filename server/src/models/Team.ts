import mongoose, { Document, Schema } from 'mongoose';

export interface Team extends Document {
  id: string;
  name: string;
  fullName: string;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
  };
  active: boolean;
}

const TeamSchema = new Schema<Team>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  fullName: { type: String, required: true },
  abbreviation: { type: String, required: true, index: true },
  city: { type: String, required: true },
  conference: { type: String, required: true, index: true },
  division: { type: String, required: true, index: true },
  logo: { type: String },
  colors: {
    primary: { type: String, required: true },
    secondary: { type: String, required: true },
    tertiary: { type: String }
  },
  active: { type: Boolean, default: true, index: true }
}, {
  timestamps: true
});

// Create text index for search functionality
TeamSchema.index({ name: 'text', fullName: 'text', city: 'text' });

export const TeamModel = mongoose.model<Team>('Team', TeamSchema);