const Logo = ({ onClick }) => {
  return (
    <div 
      className="flex items-center cursor-pointer"
      onClick={onClick}
    >
      <img 
        src="/logo.webp" 
        alt="Logo" 
        className="h-9 w-auto object-contain"
        style={{ maxHeight: '36px' }}
      />
    </div>
  );
};

export default Logo;

