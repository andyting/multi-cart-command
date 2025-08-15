import { Platform } from "@/types/order";
import { ShoppingCart, Smartphone, Globe, Store, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const platformConfig = {
  momo: { 
    icon: ShoppingCart, 
    label: "Momo", 
    color: "text-purple-600 bg-purple-100",
    bgColor: "bg-purple-50"
  },
  shopee: { 
    icon: Smartphone, 
    label: "蝦皮", 
    color: "text-orange-600 bg-orange-100",
    bgColor: "bg-orange-50"
  },
  official: { 
    icon: Globe, 
    label: "官網", 
    color: "text-blue-600 bg-blue-100",
    bgColor: "bg-blue-50"
  },
  offline: { 
    icon: Store, 
    label: "門店", 
    color: "text-green-600 bg-green-100",
    bgColor: "bg-green-50"
  },
  manual: { 
    icon: Plus, 
    label: "手動", 
    color: "text-gray-600 bg-gray-100",
    bgColor: "bg-gray-50"
  },
} as const;

const sizeConfig = {
  sm: { icon: "h-4 w-4", container: "h-6 w-6 text-xs" },
  md: { icon: "h-5 w-5", container: "h-8 w-8 text-sm" },
  lg: { icon: "h-6 w-6", container: "h-10 w-10 text-base" },
} as const;

export function PlatformIcon({ platform, size = "md", showLabel = false }: PlatformIconProps) {
  const config = platformConfig[platform];
  const sizeClasses = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "rounded-full flex items-center justify-center",
        config.color,
        sizeClasses.container
      )}>
        <Icon className={sizeClasses.icon} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">
          {config.label}
        </span>
      )}
    </div>
  );
}