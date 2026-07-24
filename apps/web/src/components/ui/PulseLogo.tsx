import React from "react";
import { cn } from "@/lib/utils";

export interface PulseLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  xl: "h-12",
};

export const PulseIcon: React.FC<{ className?: string; size?: "sm" | "md" | "lg" | "xl" | number }> = ({
  className,
  size = "md",
}) => {
  const heightClass = typeof size === "string" ? sizeMap[size] : undefined;
  const style = typeof size === "number" ? { height: `${size}px`, width: `${size}px` } : undefined;

  return (
    <div
      className={cn("relative inline-block overflow-hidden aspect-square shrink-0", heightClass, className)}
      style={style}
    >
      <img
        src="/logo.png"
        alt="Pulse Icon"
        className="h-full w-auto max-w-none object-left object-contain"
        style={{ height: "100%" }}
      />
    </div>
  );
};

export const PulseLogo: React.FC<PulseLogoProps> = ({
  variant = "full",
  size = "md",
  className,
  showText = true,
  ...props
}) => {
  const heightClass = typeof size === "string" ? sizeMap[size] : undefined;
  const customStyle = typeof size === "number" ? { height: `${size}px` } : undefined;

  if (variant === "icon" || !showText) {
    return <PulseIcon className={className} size={size} />;
  }

  return (
    <img
      src="/logo.png"
      alt="Pulse"
      className={cn("w-auto shrink-0 object-contain select-none", heightClass, className)}
      style={customStyle}
      {...props}
    />
  );
};
