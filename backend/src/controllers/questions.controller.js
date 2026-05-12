import { Question } from '../models/Question.js';
import { pickLang } from '../utils/pickLang.js';

const LANGS = ['ar', 'fr', 'en'];
function getLang(req) {
  const l = (req.query.lang || 'ar').toString();
  return LANGS.includes(l) ? l : 'ar';
}

export async function listQuestions(req, res, next) {
  try {
    const lang = getLang(req);
    const filter = { isActive: true };
    if (req.query.ax !== undefined && req.query.ax !== '') filter.ax = Number(req.query.ax);
    if (req.query.sub) filter.sub = req.query.sub;
    if (req.query.diff) filter.diff = req.query.diff;
    if (req.query.type) filter.type = req.query.type;
    const docs = await Question.find(filter).limit(200);
    res.json({ items: docs.map((d) => pickLang(d, lang, { stripCor: true, stripExp: true })) });
  } catch (e) {
    next(e);
  }
}

export async function randomQuestions(req, res, next) {
  try {
    const lang = getLang(req);
    const count = Math.min(Number(req.query.count) || 20, 60);
    const match = { isActive: true };
    if (req.query.ax !== undefined && req.query.ax !== '') match.ax = Number(req.query.ax);
    if (req.query.type) match.type = req.query.type;
    const docs = await Question.aggregate([{ $match: match }, { $sample: { size: count } }]);
    res.json({ items: docs.map((d) => pickLang(d, lang, { stripCor: true, stripExp: true })) });
  } catch (e) {
    next(e);
  }
}

export async function getQuestion(req, res, next) {
  try {
    const lang = getLang(req);
    const q = await Question.findById(req.params.id);
    if (!q || !q.isActive) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Question not found' } });
    }
    res.json(pickLang(q, lang, { stripCor: true, stripExp: true }));
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Question not found' } });
    }
    next(e);
  }
}
