export interface Order {
  id: string;
  orderNumber: string;
  platform: Platform;
  createDate: string;
  status: OrderStatus;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  quantity: number;
  trackingNumber?: string;
  notes?: string;
  isAbnormal?: boolean;
}

export interface OrderItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export type Platform = 'momo' | 'shopee' | 'official' | 'offline' | 'manual';

export type OrderStatus = 
  | 'manual_add'           // 手動新增
  | 'pending_payment'      // 待付款
  | 'preorder_pending'     // 預購訂單待處理
  | 'general_pending'      // 一般訂單待處理
  | 'adding_stock'         // 追加中/缺貨中
  | 'ready_to_ship'        // 可出貨
  | 'shipping'             // 出貨中
  | 'shipped'              // 已出貨
  | 'completed'            // 已完成
  | 'cancelled';           // 已取消

export type SpecialStatus = 
  | 'abnormal'             // 異常訂單區
  | 'duplicate_recipient'  // 收件資訊重覆
  | 'temporary_hold';      // 暫存區

export interface StatusCount {
  status: OrderStatus | SpecialStatus;
  count: number;
  label: string;
}

export interface FilterOptions {
  platform?: Platform;
  status?: OrderStatus | SpecialStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  amountRange?: {
    min: number;
    max: number;
  };
}