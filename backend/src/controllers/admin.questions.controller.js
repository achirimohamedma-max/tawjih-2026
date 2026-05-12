import { Question } from '../models/Question.js';

export async function list(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { 'text.ar': { $regex: req.query.search, $options: 'i' } },
        { 'text.fr': { $regex: req.query.search, $options: 'i' } },
        { 'text.en': { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.missingLang === 'fr') filter['text.fr'] = null;
    if (req.query.missingLang === 'en') filter['text.en'] = null;
    if (req.query.missingLang === 'ar') filter['text.ar'] = null;
    const [items, total] = await Promise.all([
      Question.find(filter).sort({ legacyId: 1, createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Question.countDocuments(filter),
    ]);
    res.json({ items, total, page, limit });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const doc = await Question.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const doc = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
    res.json(doc);
  } catch (e) {
    next(e);
  }
}

export async function softDelete(req, res, next) {
  try {
    const doc = await Question.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function translate(req, res, next) {
  try {
    const { lang, text, ch, exp, subN } = req.body || {};
    if (!['ar', 'fr', 'en'].includes(lang)) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'invalid lang' } });
    }
    const upd = {};
    if (text !== undefined) upd[`text.${lang}`] = text;
    if (ch !== undefined) upd[`ch.${lang}`] = ch;
    if (exp !== undefined) upd[`exp.${lang}`] = exp;
    if (subN !== undefined) upd[`subN.${lang}`] = subN;
    const doc = await Question.findByIdAndUpdate(req.params.id, { $set: upd }, { new: true });
    if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
    res.json(doc);
  } catch (e) {
    next(e);
  }
}

export async function bulkImport(req, res, next) {
  try {
    const docs = Array.isArray(req.body) ? req.body : req.body.items;
    if (!Array.isArray(docs)) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'array required' } });
    }
    const r = await Question.insertMany(docs, { ordered: false });
    res.status(201).json({ inserted: r.length });
  } catch (e) {
    next(e);
  }
}
