import mongoose from 'mongoose';

const AxisBreakdownItem = new mongoose.Schema(
  {
    sub: String,
    subN: String,
    ax: Number,
    correct: Number,
    total: Number,
  },
  { _id: false }
);

const AttemptSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  mode: { type: String, enum: ['qcm', 'psy', 'mixed'], required: true },
  lang: { type: String, enum: ['ar', 'fr', 'en'], default: 'ar' },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: mongoose.Schema.Types.Mixed }],
  score: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  empty: { type: Number, default: 0 },
  durationMin: { type: Number, default: 0 },
  axisBreakdown: { type: [AxisBreakdownItem], default: [] },
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date, default: null },
});

AttemptSchema.index({ sessionId: 1, finishedAt: -1 });

export const Attempt = mongoose.model('Attempt', AttemptSchema);
