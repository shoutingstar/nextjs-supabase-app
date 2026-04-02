import { ReactNode } from "react";

interface EmptyStateProps {
  /** 아이콘 컴포넌트 (선택적) */
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-card rounded-lg border border-dashed p-12 text-center">
      {/* 아이콘 */}
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
