"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-center"
      offset={20}
      expand={true}
      richColors={false}
      closeButton={true}
      duration={4000}
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
        ),
        info: <InfoIcon className="size-5 text-blue-600 dark:text-blue-400" />,
        warning: (
          <TriangleAlertIcon className="size-5 text-amber-600 dark:text-amber-400" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-600 dark:text-red-400" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-gray-600 dark:text-gray-400" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-4 min-w-[320px] max-w-[420px] bg-white/95 dark:bg-gray-800/95 transition-all duration-300",
          title: "font-semibold text-base text-gray-900 dark:text-gray-100",
          description:
            "text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed",
          actionButton:
            "bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          cancelButton:
            "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          closeButton:
            "!bg-gray-100 hover:!bg-gray-200 dark:!bg-gray-700 dark:hover:!bg-gray-600 !text-gray-600 dark:!text-gray-400 !border-gray-300 dark:!border-gray-600 hover:!border-gray-400 dark:hover:!border-gray-500 transition-all",
          success:
            "!bg-emerald-50 dark:!bg-emerald-950/50 !border-emerald-200 dark:!border-emerald-800 !text-emerald-900 dark:!text-emerald-100",
          error:
            "!bg-red-50 dark:!bg-red-950/50 !border-red-200 dark:!border-red-800 !text-red-900 dark:!text-red-100",
          warning:
            "!bg-amber-50 dark:!bg-amber-950/50 !border-amber-200 dark:!border-amber-800 !text-amber-900 dark:!text-amber-100",
          info: "!bg-blue-50 dark:!bg-blue-950/50 !border-blue-200 dark:!border-blue-800 !text-blue-900 dark:!text-blue-100",
        },
        ...props.toastOptions,
      }}
      {...props}
    />
  );
};

export { Toaster };
