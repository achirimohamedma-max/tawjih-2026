export function adminKey(req, res, next) {
  const key = req.header('X-Admin-Key');
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid admin key' } });
  }
  next();
}
