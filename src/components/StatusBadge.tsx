import { Badge } from "@/components/ui/badge";
import { OrderStatus, SpecialStatus } from "@/types/order";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus | SpecialStatus;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const statusConfig = {
  manual_add: { label: "手動新增", variant: "secondary" },
  pending_payment: { label: "待付款", variant: "warning" },
  preorder_pending: { label: "預購訂單待處理", variant: "processing" },
  general_pending: { label: "一般訂單待處理", variant: "processing" },
  adding_stock: { label: "追加中", variant: "warning" },
  ready_to_ship: { label: "可出貨", variant: "success" },
  shipping: { label: "出貨中", variant: "processing" },
  shipped: { label: "已出貨", variant: "success" },
  completed: { label: "已完成", variant: "success" },
  cancelled: { label: "已取消", variant: "destructive" },
  abnormal: { label: "異常訂單區", variant: "destructive" },
  duplicate_recipient: { label: "收件資訊重覆", variant: "warning" },
  temporary_hold: { label: "暫存區", variant: "secondary" },
} as const;

const variantStyles = {
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  warning: "bg-status-warning text-white hover:bg-status-warning/80",
  processing: "bg-status-processing text-white hover:bg-status-processing/80",
  success: "bg-status-success text-white hover:bg-status-success/80",
  destructive: "bg-status-error text-white hover:bg-status-error/80",
} as const;

export function StatusBadge({ status, count, isActive, onClick }: StatusBadgeProps) {
  const config = statusConfig[status];
  const variant = config.variant as keyof typeof variantStyles;
  
  return (
    <Badge
      variant="secondary"
      className={cn(
        "cursor-pointer transition-all duration-200 px-3 py-2 text-sm font-medium",
        variantStyles[variant],
        isActive && "ring-2 ring-primary ring-offset-1",
        onClick && "hover:scale-105"
      )}
      onClick={onClick}
    >
      {config.label}
      {count !== undefined && (
        <span className="ml-1 font-bold">({count})</span>
      )}
    </Badge>
  );
}