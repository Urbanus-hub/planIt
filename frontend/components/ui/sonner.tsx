"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-600" />,
        info: <InfoIcon className="size-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-600" />,
        error: <OctagonXIcon className="size-5 text-red-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-gray-600" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast border-2 shadow-lg",
          title: "font-semibold text-base",
          description: "text-sm opacity-90",
          success: "!bg-green-50 !border-green-500 !text-green-900",
          error: "!bg-red-50 !border-red-500 !text-red-900",
          warning: "!bg-yellow-50 !border-yellow-500 !text-yellow-900",
          info: "!bg-blue-50 !border-blue-500 !text-blue-900",
        },
        ...props.toastOptions,
      }}
      {...props}
    />
  );
};

export { Toaster };
