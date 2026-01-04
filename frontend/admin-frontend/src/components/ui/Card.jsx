export default function Card({ title, value, children, className = "" }) {
  return (
    <div className={`bg-[#081826] p-4 rounded-lg shadow border border-slate-700 ${className}`}>
      {title && <div className="text-sm text-slate-400">{title}</div>}
      {value !== undefined && <div className="text-2xl font-bold mt-2">{value}</div>}
      {children}
    </div>
  );
}
