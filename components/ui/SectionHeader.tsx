'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconPosition?: 'left' | 'right';
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  iconPosition = 'left',
  alignment = 'center',
  className,
  iconClassName,
  titleClassName,
  subtitleClassName
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const flexAlignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('mb-16', alignmentClasses[alignment], className)}
    >
      {/* Title with Icon */}
      <div className={cn('flex items-center gap-4 mb-6', flexAlignmentClasses[alignment])}>
        {iconPosition === 'left' && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon className={cn('w-6 h-6 text-primary', iconClassName)} />
            </div>
          </div>
        )}
        
        <h2 className={cn(
          'text-4xl md:text-5xl font-bold text-foreground',
          titleClassName
        )}>
          {title}
        </h2>
        
        {iconPosition === 'right' && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon className={cn('w-6 h-6 text-primary', iconClassName)} />
            </div>
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className={cn(
          'text-xl text-muted-foreground max-w-3xl',
          alignment === 'center' && 'mx-auto',
          alignment === 'right' && 'ml-auto',
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
