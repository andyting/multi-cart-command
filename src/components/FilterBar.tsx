import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FilterOptions, Platform, OrderStatus } from "@/types/order";
import { Search, Filter, Download, Trash2, Edit, Ship } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  selectedCount: number;
  currentStatus?: OrderStatus;
  onBatchAction: (action: string) => void;
}

const platformOptions = [
  { value: 'all', label: '所有平台' },
  { value: 'momo', label: 'Momo' },
  { value: 'shopee', label: '蝦皮' },
  { value: 'official', label: '官網' },
  { value: 'offline', label: '門店' },
  { value: 'manual', label: '手動' },
];

const statusActions = {
  ready_to_ship: [
    { key: 'confirm_ship', label: '確認出貨', icon: Ship, variant: 'default' },
    { key: 'batch_ship', label: '批量出貨', icon: Ship, variant: 'default' },
  ],
  shipping: [
    { key: 'check', label: '檢核', icon: Edit, variant: 'secondary' },
    { key: 'print', label: '列印出貨單', icon: Download, variant: 'outline' },
  ],
  cancelled: [
    { key: 'process_return', label: '處理退貨', icon: Trash2, variant: 'destructive' },
  ],
} as const;

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  selectedCount, 
  currentStatus,
  onBatchAction 
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handlePlatformChange = (platform: string) => {
    onFiltersChange({ 
      ...filters, 
      platform: platform === 'all' ? undefined : platform as Platform 
    });
  };

  const getCurrentActions = () => {
    if (!currentStatus || !(currentStatus in statusActions)) return [];
    return statusActions[currentStatus as keyof typeof statusActions] || [];
  };

  const actions = getCurrentActions();

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border shadow-card">
      {/* Search and Basic Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋訂單號、客戶姓名、追蹤號..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.platform || 'all'} onValueChange={handlePlatformChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          更多篩選
        </Button>

        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          匯出
        </Button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium mb-2 block">日期範圍</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value, end: filters.dateRange?.end || '' }
                })}
              />
              <Input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { start: filters.dateRange?.start || '', end: e.target.value }
                })}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">金額範圍</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="最小金額"
                value={filters.amountRange?.min || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  amountRange: { ...filters.amountRange, min: Number(e.target.value), max: filters.amountRange?.max || 0 }
                })}
              />
              <Input
                type="number"
                placeholder="最大金額"
                value={filters.amountRange?.max || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  amountRange: { min: filters.amountRange?.min || 0, max: Number(e.target.value) }
                })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Batch Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-4 pt-4 border-t">
          <Badge variant="secondary" className="px-3 py-1">
            已選擇 {selectedCount} 筆訂單
          </Badge>
          
          <div className="flex gap-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.key}
                  variant={action.variant as any}
                  size="sm"
                  onClick={() => onBatchAction(action.key)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchAction('batch_edit')}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              批次編輯
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}