import mongoose, { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: String, required: true },
  aiScore: { type: String, default: "95% Match" },
  aiDescription: { type: String, default: "" }

}, { timestamps: true });

export const Task = models.Task || model('Task', TaskSchema);
