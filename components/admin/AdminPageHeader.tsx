import { ReactNode } from 'react';
import { ADMIN_EYEBROW, ADMIN_TITLE } from './admin-ui';

export default function AdminPageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className={ADMIN_EYEBROW}>{eyebrow}</p>}
        <h1 className={`${eyebrow ? 'mt-3' : ''} ${ADMIN_TITLE}`}>{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
