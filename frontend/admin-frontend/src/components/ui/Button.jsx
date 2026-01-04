export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button type={type} onClick={onClick} className={`bg-teal-400 text-black px-3 py-2 rounded ${className}`}>
      {children}
    </button>
  );
}
