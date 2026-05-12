import { Router } from 'express';
import { startAttempt, submitAttempt, listBySession, getAttempt } from '../controllers/attempts.controller.js';

const r = Router();
r.post('/start', startAttempt);
r.post('/:id/submit', submitAttempt);
r.get('/by-session/:sessionId', listBySession);
r.get('/:id', getAttempt);
export default r;
