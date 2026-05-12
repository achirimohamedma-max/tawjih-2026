import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/tawjih2026');
    const app = createApp();
    app.listen(port, () => console.log(`✓ API on http://localhost:${port}`));
  } catch (e) {
    console.error('Failed to start:', e.message);
    process.exit(1);
  }
})();
