import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformIcon } from "./PlatformIcon";
import { StatusBadge } from "./StatusBadge";
import { Order } from "@/types/order";
import { Package, User, MapPin, CreditCard, Truck, FileText, Edit, Save, X } from "lucide-react";

interface OrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (order: Order) => void;
  mode?: 'view' | 'edit';
}

export function OrderModal({ order, isOpen, onClose, onSave, mode = 'view' }: OrderModalProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [editedOrder, setEditedOrder] = useState<Order | null>(order);

  if (!order) return null;

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

  const handleSave = () => {
    if (editedOrder && onSave) {
      onSave(editedOrder);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedOrder(order);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-3">
            <PlatformIcon platform={order.platform} size="md" />
            <span>訂單詳情 - {order.orderNumber}</span>
            <StatusBadge status={order.status} />
          </DialogTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                編輯
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  保存
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">基本資訊</TabsTrigger>
            <TabsTrigger value="customer">客戶資訊</TabsTrigger>
            <TabsTrigger value="items">商品明細</TabsTrigger>
            <TabsTrigger value="logistics">物流資訊</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  訂單基本資訊
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">訂單號</label>
                    <div className="mt-1 text-sm">{order.orderNumber}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">成立日期</label>
                    <div className="mt-1 text-sm">{formatDate(order.createDate)}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">平台來源</label>
                    <div className="mt-1">
                      <PlatformIcon platform={order.platform} showLabel />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">訂單狀態</label>
                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  金額資訊
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">商品數量</label>
                    <div className="mt-1 text-sm font-mono">{order.quantity} 件</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">訂單總額</label>
                    <div className="mt-1 text-lg font-semibold text-primary">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">備註</label>
              <div className="mt-2">
                {isEditing ? (
                  <Textarea
                    value={editedOrder?.notes || ''}
                    onChange={(e) => setEditedOrder(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    placeholder="輸入備註..."
                    rows={3}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    {order.notes || '無備註'}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              客戶聯絡資訊
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">客戶姓名</label>
                <div className="mt-1">
                  {isEditing ? (
                    <Input
                      value={editedOrder?.customerName || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, customerName: e.target.value } : null)}
                    />
                  ) : (
                    <div className="text-sm p-3 bg-muted rounded-md">{order.customerName}</div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">聯絡電話</label>
                <div className="mt-1">
                  {isEditing ? (
                    <Input
                      value={editedOrder?.customerPhone || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, customerPhone: e.target.value } : null)}
                    />
                  ) : (
                    <div className="text-sm p-3 bg-muted rounded-md">{order.customerPhone || '未提供'}</div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">收件地址</label>
                <div className="mt-1">
                  {isEditing ? (
                    <Textarea
                      value={editedOrder?.customerAddress || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, customerAddress: e.target.value } : null)}
                      rows={3}
                    />
                  ) : (
                    <div className="text-sm p-3 bg-muted rounded-md">{order.customerAddress || '未提供'}</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="h-4 w-4" />
              商品明細
            </div>
            
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">商品編號: {item.productCode}</div>
                      <div className="flex gap-4 text-sm">
                        <span>數量: {item.quantity}</span>
                        <span>單價: {formatCurrency(item.price)}</span>
                        <span className="font-medium">小計: {formatCurrency(item.quantity * item.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>總計</span>
              <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
            </div>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Truck className="h-4 w-4" />
              物流資訊
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">追蹤號</label>
                <div className="mt-1">
                  {isEditing ? (
                    <Input
                      value={editedOrder?.trackingNumber || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, trackingNumber: e.target.value } : null)}
                      placeholder="輸入追蹤號..."
                    />
                  ) : (
                    <div className="text-sm p-3 bg-muted rounded-md">
                      {order.trackingNumber ? (
                        <Badge variant="outline">{order.trackingNumber}</Badge>
                      ) : (
                        '尚未提供'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}