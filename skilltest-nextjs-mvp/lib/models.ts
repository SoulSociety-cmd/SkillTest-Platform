import mongoose, { Schema, models, model } from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  name?: string;
  password?: string;
  score?: number;
  badge?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: String,
  password: String,
  score: { type: Number, default: 0 },
  badge: String,
});

export const User = models.User || model<IUser>('User', userSchema);

export interface ITest extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  testCases: Array<{ input: [number, string, number], expected: number }>;
}

const testSchema = new Schema<ITest>({
  title: String,
  description: String,
  testCases: [{
    input: Schema.Types.Mixed,
    expected: Number,
  }],
});

export const Test = models.Test || model<ITest>('Test', testSchema);

export interface ISubmission extends mongoose.Document {
  userId: string;
  testId: string;
  code: string;
  score: number;
  results: any;
  timeTaken: number;
}

const submissionSchema = new Schema<ISubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  testId: { type: String },
  code: String,
  score: Number,
  results: Object,
  timeTaken: Number,
});

export const Submission = models.Submission || model<ISubmission>('Submission', submissionSchema);
