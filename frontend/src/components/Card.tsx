import { colors, spacing, borderRadius, shadows } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`bg-surface rounded-${borderRadius.lg} p-4 ${shadows.md} ${onClick ? 'cursor-pointer hover:bg-surface/80' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ title, value, subtitle, icon, color = colors.secondary }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      {icon && (
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-textSecondary text-sm">{title}</p>
        <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
        {subtitle && <p className="text-xs text-textSecondary mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
}