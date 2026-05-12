import mongoose from 'mongoose';

const LangText = {
  ar: { type: String, default: null },
  fr: { type: String, default: null },
  en: { type: String, default: null },
};

const LangArr = {
  ar: { type: [String], default: null },
  fr: { type: [String], default: null },
  en: { type: [String], default: null },
};

const QuestionSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    ax: { type: Number, required: true, min: 0, max: 3 },
    sub: { type: String, required: true },
    diff: { type: String, enum: ['سهل', 'متوسط', 'صعب'], required: true },
    src: { type: String, default: '' },
    cor: { type: Number, required: true, min: 0, max: 3 },
    isActive: { type: Boolean, default: true, index: true },

    text: LangText,
    ch: LangArr,
    exp: LangText,
    subN: LangText,

    type: { type: String, default: null },
    series: { type: [mongoose.Schema.Types.Mixed], default: null },
    grid: { type: [[mongoose.Schema.Types.Mixed]], default: null },
    cat: { type: String, default: null },
  },
  { timestamps: true }
);

QuestionSchema.index({ ax: 1, sub: 1 });

export const Question = mongoose.model('Question', QuestionSchema);
