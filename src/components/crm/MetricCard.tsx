import React from 'react';
import Card from '../ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'primary',
}) => {
  const variantColors = {
    primary: 'text-blue-600 bg-blue-50 border-blue-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    danger: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <Card className={`p-6 ${variantColors[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% em relação ao mês anterior
            </p>
          )}
        </div>
        {icon && <div className="text-3xl opacity-20">{icon}</div>}
      </div>
    </Card>
  );
};

export default MetricCard;
