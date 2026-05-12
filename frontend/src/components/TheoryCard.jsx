import { useState } from 'react';

export function TheoryCard({ html }) {
  const [open, setOpen] = useState(false);
  if (!html) return null;
  // Strip the legacy onclick attribute since we control toggle ourselves
  const cleaned = html.replace(/onclick="[^"]*"/g, '');
  // Extract header (tc-header content) and body (tc-body content) blindly via regex
  const headerMatch = cleaned.match(/<div class="tc-header"[^>]*>([\s\S]*?)<\/div>\s*<div class="tc-body">/);
  const bodyMatch = cleaned.match(/<div class="tc-body">([\s\S]*)<\/div>\s*<\/div>\s*$/);
  const header = headerMatch ? headerMatch[1] : '';
  const body = bodyMatch ? bodyMatch[1] : cleaned;

  return (
    <div className="rounded-2xl border border-bord bg-white overflow-hidden mb-3 theory-card-wrapper">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-start p-4 flex items-center gap-3 hover:bg-surf transition"
      >
        <div className="flex-1" dangerouslySetInnerHTML={{ __html: header }} />
        <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
      </button>
      {open && (
        <div
          className="p-4 border-t border-bord theory-card-body"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </div>
  );
}
