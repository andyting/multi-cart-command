import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import { FilterBar } from "./FilterBar";
import { OrderTable } from "./OrderTable";
import { OrderModal } from "./OrderModal";
import { Order, OrderStatus, SpecialStatus, FilterOptions, StatusCount } from "@/types/order";
import { Upload, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "10053797",
    platform: "momo",
    createDate: "2025-07-15T16:11:00Z",
    status: "ready_to_ship",
    customerName: "王小明",
    customerPhone: "0912345678",
    customerAddress: "台北市信義區信義路五段7號",
    items: [
      {
        id: "1",
        productCode: "TS250715SA000N0",
        productName: "小水族館長版衣-水第二階紫花型條紋褲",
        quantity: 2,
        price: 1015
      }
    ],
    totalAmount: 2030,
    quantity: 2,
    trackingNumber: "S56152",
    notes: "請小心包裝",
    isAbnormal: false
  },
  {
    id: "2",
    orderNumber: "10053811",
    platform: "shopee",
    createDate: "2025-07-17T12:27:00Z",
    status: "shipping",
    customerName: "李美華",
    customerPhone: "0923456789",
    customerAddress: "高雄市鼓山區美術東二路",
    items: [
      {
        id: "2",
        productCode: "TS250717NA001C1",
        productName: "粉嫩親膚透氣睡衣褲組",
        quantity: 3,
        price: 1780
      }
    ],
    totalAmount: 5340,
    quantity: 3,
    trackingNumber: "R8106",
    notes: "",
    isAbnormal: false
  },
  {
    id: "3",
    orderNumber: "10053812",
    platform: "official",
    createDate: "2025-07-17T13:53:00Z",
    status: "completed",
    customerName: "張志明",
    customerPhone: "0934567890",
    customerAddress: "台中市西屯區台灣大道三段",
    items: [
      {
        id: "3",
        productCode: "TS250717PA002VP",
        productName: "學生型條紋褲衣",
        quantity: 2,
        price: 625
      }
    ],
    totalAmount: 1250,
    quantity: 2,
    trackingNumber: "S56151",
    notes: "已完成配送",
    isAbnormal: false
  }
];

const siteOptions = [
  { value: 'platform', label: '平台訂單模組' },
  { value: 'momo', label: 'Momo購物網' },
  { value: 'shopee', label: '蝦皮購物' },
  { value: 'official', label: '官方網站' },
];

export function OrderDashboard() {
  const [selectedSite, setSelectedSite] = useState('platform');
  const [activeStatus, setActiveStatus] = useState<OrderStatus | SpecialStatus | 'all'>('all');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const { toast } = useToast();

  // Calculate status counts
  const statusCounts: StatusCount[] = useMemo(() => {
    const counts = mockOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { status: 'manual_add', count: counts.manual_add || 0, label: '手動新增' },
      { status: 'pending_payment', count: counts.pending_payment || 0, label: '待付款' },
      { status: 'preorder_pending', count: counts.preorder_pending || 0, label: '預購訂單待處理' },
      { status: 'general_pending', count: counts.general_pending || 0, label: '一般訂單待處理' },
      { status: 'adding_stock', count: counts.adding_stock || 0, label: '追加中' },
      { status: 'ready_to_ship', count: counts.ready_to_ship || 0, label: '可出貨' },
      { status: 'shipping', count: counts.shipping || 0, label: '出貨中' },
      { status: 'shipped', count: counts.shipped || 0, label: '已出貨' },
      { status: 'completed', count: counts.completed || 0, label: '已完成' },
      { status: 'cancelled', count: counts.cancelled || 0, label: '已取消' },
    ];
  }, []);

  const specialCounts: StatusCount[] = [
    { status: 'abnormal', count: 0, label: '異常訂單區' },
    { status: 'duplicate_recipient', count: 0, label: '收件資訊重覆' },
    { status: 'temporary_hold', count: 14, label: '暫存區' },
  ];

  // Filter orders based on active status and filters
  const filteredOrders = useMemo(() => {
    let filtered = mockOrders;

    if (activeStatus !== 'all') {
      filtered = filtered.filter(order => order.status === activeStatus);
    }

    if (filters.platform) {
      filtered = filtered.filter(order => order.platform === filters.platform);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeStatus, filters]);

  const handleStatusClick = (status: OrderStatus | SpecialStatus) => {
    setActiveStatus(activeStatus === status ? 'all' : status);
    setSelectedOrders([]);
  };

  const handleSelectOrder = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveOrder = (updatedOrder: Order) => {
    toast({
      title: "訂單已更新",
      description: `訂單 ${updatedOrder.orderNumber} 已成功更新`,
    });
  };

  const handleBatchAction = (action: string) => {
    toast({
      title: "批次操作",
      description: `對 ${selectedOrders.length} 筆訂單執行 ${action} 操作`,
    });
  };

  const handleManualImport = () => {
    toast({
      title: "手動匯入",
      description: "開啟手動匯入訂單功能",
    });
  };

  const handleBatchEdit = () => {
    toast({
      title: "批次修改",
      description: "開啟批次修改訂單功能",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">平台訂單管理</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                設定
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Row 1: Site Switcher (Hidden for platform module) */}
        {selectedSite !== 'platform' && (
          <div className="bg-card p-4 rounded-lg border shadow-card">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">網站切換:</label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {siteOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Row 2: Status Bar */}
        <div className="bg-card p-6 rounded-lg border shadow-card">
          <div className="space-y-6">
            {/* Functions Section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">功能</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleManualImport} className="gap-2">
                  <Upload className="h-4 w-4" />
                  手動匯入訂單
                </Button>
                <Button variant="outline" onClick={handleBatchEdit} className="gap-2">
                  <Plus className="h-4 w-4" />
                  批次修改訂單資料
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                手動匯入訂單可能有手機個人訂單(離線單) 或 批次修改訂單資料(部分欄位)
              </p>
            </div>

            {/* Status Section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">狀態</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  status="manual_add"
                  count={statusCounts.find(s => s.status === 'manual_add')?.count}
                  isActive={activeStatus === 'manual_add'}
                  onClick={() => handleStatusClick('manual_add')}
                />
                {statusCounts.map((statusCount) => (
                  <StatusBadge
                    key={statusCount.status}
                    status={statusCount.status as OrderStatus}
                    count={statusCount.count}
                    isActive={activeStatus === statusCount.status}
                    onClick={() => handleStatusClick(statusCount.status as OrderStatus)}
                  />
                ))}
              </div>
            </div>

            {/* Special Status Section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">特殊狀態</h3>
              <div className="flex flex-wrap gap-2">
                {specialCounts.map((specialCount) => (
                  <StatusBadge
                    key={specialCount.status}
                    status={specialCount.status as SpecialStatus}
                    count={specialCount.count}
                    isActive={activeStatus === specialCount.status}
                    onClick={() => handleStatusClick(specialCount.status as SpecialStatus)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          selectedCount={selectedOrders.length}
          currentStatus={activeStatus === 'all' ? undefined : activeStatus as OrderStatus}
          onBatchAction={handleBatchAction}
        />

        {/* Row 4 & 5: Order Table */}
        <OrderTable
          orders={filteredOrders}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
        />

        {/* Order Modal */}
        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          onSave={handleSaveOrder}
          mode={modalMode}
        />
      </div>
    </div>
  );
}