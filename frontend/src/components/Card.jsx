export function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-bord p-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
