'use client';

import React from 'react';
import { cn } from '@/lib/utills';

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: string;
  contactInfo?: string;
  isEmergency?: boolean;
  className?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  onClick?: () => void;
}

const SupportCard: React.FC<SupportCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonAction,
  contactInfo,
  isEmergency = false,
  className,
  iconBgColor = 'bg-gray-100',
  iconTextColor = 'text-gray-600',
  onClick,
}) => {
  // Render the icon with proper styling
  const renderIcon = () => {
    if (!icon) return null;
    
    // If it's a React element, clone it with our className
    if (React.isValidElement(icon)) {
      const iconProps = {
        ...(icon.props || {}),
        className: cn('w-6 h-6', (icon.props as any)?.className)
      };
      return React.cloneElement(icon, iconProps);
    }
    
    // For any other case, just return the icon as is
    return icon;
  };

  return (
    <div 
      className={cn(
        'bg-fundable-mid-grey/10 rounded-2xl p-6 text-white flex flex-col items-center text-center h-full min-h-[280px] border border-fundable-mid-grey/20',
        'transition-all duration-300 hover:border-fundable-purple-2/50 hover:shadow-lg hover:shadow-fundable-purple-2/10',
        isEmergency && 'border-red-500/30 hover:border-red-500/50',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4">
        <div className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center',
          isEmergency ? 'bg-red-500/10 text-red-400' : `${iconBgColor} ${iconTextColor}`
        )}>
          {renderIcon()}
        </div>
      </div>

      {/* Title */}
      <h3 className={cn(
        'text-xl font-semibold mb-2',
        isEmergency ? 'text-red-400' : 'text-white'
      )}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-fundable-grey text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {/* Button */}
      <a
        href={
          buttonAction === 'email' ? '#' :
          buttonAction === 'telegram' ? 'https://t.me/fundablesupport' :
          buttonAction === 'discord' ? 'https://discord.gg/fundable' :
          buttonAction === 'farcaster' ? 'https://warpcast.com/fundable' :
          buttonAction === 'emergency' ? 'https://wa.me/15551234567' :
          '#'
        }
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className={cn(
          'w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors text-center block',
          isEmergency 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-fundable-purple-2 text-white hover:bg-fundable-purple-3',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          isEmergency ? 'focus:ring-red-500' : 'focus:ring-fundable-purple-2'
        )}
      >
        {buttonText}
      </a>

      {/* Contact Info */}
      {contactInfo && (
        <p className={cn(
          'text-fundable-grey text-xs mt-3',
          isEmergency && 'text-red-400/80'
        )}>
          {contactInfo}
        </p>
      )}
    </div>
  );
};

export default SupportCard;