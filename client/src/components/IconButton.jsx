function IconButton({ icon: Icon, label, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
    </button>
  );
}

export default IconButton;
