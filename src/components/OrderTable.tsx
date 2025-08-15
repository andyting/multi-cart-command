import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "./PlatformIcon";
import { StatusBadge } from "./StatusBadge";
import { Order } from "@/types/order";
import { Eye, Edit, MoreHorizontal, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderTableProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
}

export function OrderTable({ 
  orders, 
  selectedOrders, 
  onSelectOrder, 
  onSelectAll, 
  onViewOrder, 
  onEditOrder 
}: OrderTableProps) {
  const [sortField, setSortField] = useState<keyof Order>('createDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="rounded-lg border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="w-16">平台</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('orderNumber')}
            >
              訂單號
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('createDate')}
            >
              成立日期
            </TableHead>
            <TableHead className="w-32">狀態</TableHead>
            <TableHead className="text-center">商品數量</TableHead>
            <TableHead 
              className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('totalAmount')}
            >
              金額
            </TableHead>
            <TableHead>追蹤號</TableHead>
            <TableHead>客戶姓名</TableHead>
            <TableHead>備註</TableHead>
            <TableHead className="w-16">動作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow 
              key={order.id}
              className={cn(
                "hover:bg-muted/50 transition-colors cursor-pointer",
                selectedOrders.includes(order.id) && "bg-primary/5"
              )}
            >
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={(checked) => onSelectOrder(order.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <PlatformIcon platform={order.platform} size="sm" />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {order.isAbnormal && (
                    <AlertTriangle className="h-4 w-4 text-status-error" />
                  )}
                  <span 
                    className="text-primary hover:underline cursor-pointer"
                    onClick={() => onViewOrder(order)}
                  >
                    {order.orderNumber}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(order.createDate)}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-center font-medium">
                {order.quantity}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(order.totalAmount)}
              </TableCell>
              <TableCell>
                {order.trackingNumber && (
                  <Badge variant="outline" className="text-xs">
                    {order.trackingNumber}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {order.customerName}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {order.notes}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewOrder(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      查看詳情
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditOrder(order)}>
                      <Edit className="mr-2 h-4 w-4" />
                      編輯訂單
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {orders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="mb-2">沒有找到符合條件的訂單</div>
          <div className="text-sm">請調整篩選條件或新增訂單</div>
        </div>
      )}
    </div>
  );
}