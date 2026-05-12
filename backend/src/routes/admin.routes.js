import { Router } from 'express';
import { adminKey } from '../middleware/adminKey.js';
import * as Q from '../controllers/admin.questions.controller.js';
import * as S from '../controllers/admin.stats.controller.js';

const r = Router();
r.use(adminKey);

r.get('/questions', Q.list);
r.post('/questions', Q.create);
r.post('/questions/bulk-import', Q.bulkImport);
r.patch('/questions/:id', Q.update);
r.delete('/questions/:id', Q.softDelete);
r.post('/questions/:id/translate', Q.translate);

r.get('/stats/overview', S.overview);
r.get('/stats/questions', S.perQuestion);
r.get('/stats/axes', S.perAxis);
r.get('/stats/activity', S.activity);

export default r;
