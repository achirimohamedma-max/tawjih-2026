import { Attempt } from '../models/Attempt.js';
import { Question } from '../models/Question.js';

export async function overview(req, res, next) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [attemptsCount, totalQuestions, avgAgg, todayAttempts, langAgg] = await Promise.all([
      Attempt.countDocuments({ finishedAt: { $ne: null } }),
      Question.countDocuments({ isActive: true }),
      Attempt.aggregate([
        { $match: { finishedAt: { $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$score' } } },
      ]),
      Attempt.countDocuments({ finishedAt: { $gte: startOfDay } }),
      Question.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            ar: { $sum: { $cond: [{ $ne: ['$text.ar', null] }, 1, 0] } },
            fr: { $sum: { $cond: [{ $ne: ['$text.fr', null] }, 1, 0] } },
            en: { $sum: { $cond: [{ $ne: ['$text.en', null] }, 1, 0] } },
          },
        },
      ]),
    ]);
    res.json({
      attemptsCount,
      totalQuestions,
      avgScore: avgAgg[0]?.avg ? Math.round(avgAgg[0].avg * 10) / 10 : 0,
      todayAttempts,
      langCoverage: langAgg[0] || { ar: 0, fr: 0, en: 0 },
    });
  } catch (e) {
    next(e);
  }
}

export async function perQuestion(req, res, next) {
  try {
    const data = await Attempt.aggregate([
      { $match: { finishedAt: { $ne: null } } },
      { $project: { questionIds: 1, answers: 1 } },
      { $unwind: { path: '$questionIds', includeArrayIndex: 'idx' } },
      { $lookup: { from: 'questions', localField: 'questionIds', foreignField: '_id', as: 'q' } },
      { $unwind: '$q' },
      {
        $project: {
          qid: '$q._id',
          isCor: { $eq: [{ $arrayElemAt: ['$answers', '$idx'] }, '$q.cor'] },
          text: '$q.text.ar',
        },
      },
      {
        $group: {
          _id: '$qid',
          text: { $first: '$text' },
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCor', 1, 0] } },
        },
      },
      { $project: { _id: 1, text: 1, total: 1, correct: 1, successRate: { $divide: ['$correct', '$total'] } } },
      { $sort: { successRate: 1 } },
      { $limit: 100 },
    ]);
    res.json({ items: data });
  } catch (e) {
    next(e);
  }
}

export async function perAxis(req, res, next) {
  try {
    const data = await Attempt.aggregate([
      { $match: { finishedAt: { $ne: null } } },
      { $unwind: '$axisBreakdown' },
      {
        $group: {
          _id: { ax: '$axisBreakdown.ax', sub: '$axisBreakdown.sub' },
          subN: { $first: '$axisBreakdown.subN' },
          correct: { $sum: '$axisBreakdown.correct' },
          total: { $sum: '$axisBreakdown.total' },
        },
      },
      {
        $project: {
          _id: 0,
          ax: '$_id.ax',
          sub: '$_id.sub',
          subN: 1,
          correct: 1,
          total: 1,
          successRate: { $cond: [{ $eq: ['$total', 0] }, 0, { $divide: ['$correct', '$total'] }] },
        },
      },
      { $sort: { ax: 1, sub: 1 } },
    ]);
    res.json({ items: data });
  } catch (e) {
    next(e);
  }
}

export async function activity(req, res, next) {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);
    const data = await Attempt.aggregate([
      { $match: { finishedAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$finishedAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      { $project: { _id: 0, date: '$_id', count: 1, avgScore: { $round: ['$avgScore', 1] } } },
      { $sort: { date: 1 } },
    ]);
    res.json({ items: data });
  } catch (e) {
    next(e);
  }
}
