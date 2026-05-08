import { colors, spacing, borderRadius, shadows } from '@/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/80 active:scale-95',
    secondary: 'bg-secondary text-background hover:bg-secondary/80 active:scale-95',
    ghost: 'bg-transparent text-white hover:bg-white/10 active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? 'opacity-50' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
}