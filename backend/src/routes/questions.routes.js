import { Router } from 'express';
import { listQuestions, randomQuestions, getQuestion } from '../controllers/questions.controller.js';

const r = Router();
r.get('/random', randomQuestions);
r.get('/:id', getQuestion);
r.get('/', listQuestions);
export default r;
