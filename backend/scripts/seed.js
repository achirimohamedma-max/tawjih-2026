import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Question } from '../src/models/Question.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reset = process.argv.includes('--reset');

(async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/tawjih2026');
  const data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../src/data/questions.seed.json'), 'utf8')
  );

  if (reset) {
    await Question.deleteMany({});
    console.log('✓ Cleared existing questions');
  }

  let inserted = 0;
  let updated = 0;
  for (const doc of data) {
    const r = await Question.updateOne({ legacyId: doc.legacyId }, { $set: doc }, { upsert: true });
    if (r.upsertedCount) inserted++;
    else updated++;
  }
  console.log(`✓ Seed done: ${inserted} inserted, ${updated} updated, ${data.length} total`);
  await disconnectDB();
})();
