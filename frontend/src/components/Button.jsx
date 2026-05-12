export function Button({ variant = 'primary', className = '', children, ...rest }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-br from-red to-red-dark text-white shadow-lg hover:-translate-y-0.5',
    ghost: 'border-2 border-bord text-ink hover:bg-surf',
    gold: 'bg-gradient-to-br from-gold to-gold-light text-ink shadow',
    danger: 'bg-red-dark text-white hover:bg-red',
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...rest}>
      {children}
    </button>
  );
}
