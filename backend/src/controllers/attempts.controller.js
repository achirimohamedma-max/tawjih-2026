import { Question } from '../models/Question.js';
import { Attempt } from '../models/Attempt.js';
import { pickLang } from '../utils/pickLang.js';

const LANGS = ['ar', 'fr', 'en'];
const MODES = ['qcm', 'psy', 'mixed'];

export async function startAttempt(req, res, next) {
  try {
    const { sessionId, mode, count, ax, lang } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'sessionId required' } });
    }
    if (!MODES.includes(mode)) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'invalid mode' } });
    }
    const useLang = LANGS.includes(lang) ? lang : 'ar';
    const n = Math.min(Math.max(parseInt(count, 10) || 20, 1), 60);

    const match = { isActive: true };
    if (mode === 'psy') match.type = 'psy';
    if (ax !== undefined && ax !== null && ax !== '') match.ax = Number(ax);

    const sampled = await Question.aggregate([{ $match: match }, { $sample: { size: n } }]);
    if (sampled.length === 0) {
      return res.status(400).json({ error: { code: 'NO_QUESTIONS', message: 'No questions match filters' } });
    }

    const attempt = await Attempt.create({
      sessionId,
      mode,
      lang: useLang,
      questionIds: sampled.map((q) => q._id),
      answers: new Array(sampled.length).fill(null),
    });

    res.status(201).json({
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      questions: sampled.map((d) => pickLang(d, useLang, { stripCor: true, stripExp: true })),
    });
  } catch (e) {
    next(e);
  }
}

export async function submitAttempt(req, res, next) {
  try {
    const { sessionId, answers } = req.body || {};
    const attempt = await Attempt.findById(req.params.id);
    if (!attempt) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
    }
    if (attempt.sessionId !== sessionId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Session mismatch' } });
    }
    if (attempt.finishedAt) {
      return res.status(409).json({ error: { code: 'ALREADY_FINISHED', message: 'Already submitted' } });
    }
    if (!Array.isArray(answers) || answers.length !== attempt.questionIds.length) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'answers length mismatch' } });
    }

    const questions = await Question.find({ _id: { $in: attempt.questionIds } });
    const qMap = new Map(questions.map((q) => [String(q._id), q]));
    const ordered = attempt.questionIds.map((id) => qMap.get(String(id)));

    let correct = 0;
    let wrong = 0;
    let empty = 0;
    const axMap = new Map();
    ordered.forEach((q, i) => {
      const a = answers[i];
      const key = q.sub;
      if (!axMap.has(key)) {
        axMap.set(key, { sub: q.sub, subN: q.subN?.ar || '', ax: q.ax, correct: 0, total: 0 });
      }
      const slot = axMap.get(key);
      slot.total++;
      if (a === null || a === undefined) empty++;
      else if (a === q.cor) {
        correct++;
        slot.correct++;
      } else wrong++;
    });

    const total = ordered.length;
    const score = Math.round((correct / total) * 20 * 10) / 10;
    const durationMin = Math.round((Date.now() - attempt.startedAt.getTime()) / 60000);

    attempt.answers = answers;
    attempt.correct = correct;
    attempt.wrong = wrong;
    attempt.empty = empty;
    attempt.score = score;
    attempt.durationMin = durationMin;
    attempt.axisBreakdown = Array.from(axMap.values());
    attempt.finishedAt = new Date();
    await attempt.save();

    res.json({
      attemptId: attempt._id,
      score,
      correct,
      wrong,
      empty,
      durationMin,
      axisBreakdown: attempt.axisBreakdown,
      questions: ordered.map((q, i) => ({
        ...pickLang(q, attempt.lang),
        userAnswer: answers[i],
      })),
    });
  } catch (e) {
    next(e);
  }
}

export async function listBySession(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = { sessionId: req.params.sessionId, finishedAt: { $ne: null } };
    const [items, total] = await Promise.all([
      Attempt.find(filter).sort({ finishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Attempt.countDocuments(filter),
    ]);
    res.json({ items, total, page, limit });
  } catch (e) {
    next(e);
  }
}

export async function getAttempt(req, res, next) {
  try {
    const attempt = await Attempt.findById(req.params.id);
    if (!attempt) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
    }
    if (req.query.sessionId !== attempt.sessionId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Session mismatch' } });
    }
    const questions = await Question.find({ _id: { $in: attempt.questionIds } });
    const qMap = new Map(questions.map((q) => [String(q._id), q]));
    const ordered = attempt.questionIds.map((id, i) => ({
      ...pickLang(qMap.get(String(id)), attempt.lang),
      userAnswer: attempt.answers[i],
    }));
    res.json({ ...attempt.toObject(), questions: ordered });
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
    }
    next(e);
  }
}
