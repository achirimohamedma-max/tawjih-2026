export function pickLang(question, lang = 'ar', { stripCor = false, stripExp = false } = {}) {
  const q = typeof question.toObject === 'function' ? question.toObject() : { ...question };
  const get = (field) => (q[field] && (q[field][lang] ?? q[field].ar)) ?? null;
  q.text = get('text');
  q.ch = get('ch');
  q.exp = get('exp');
  q.subN = get('subN');
  if (stripCor) delete q.cor;
  if (stripExp) delete q.exp;
  return q;
}
