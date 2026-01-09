'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  mobileLabel?: string;
  mobileHidden?: boolean; // Hide on mobile
  mobilePriority?: number; // Lower number = shown first on mobile
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  mobileCardRender?: (item: T) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  loadingSkeleton?: ReactNode;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  mobileCardRender,
  emptyMessage = 'No data available',
  loading = false,
  loadingSkeleton,
}: ResponsiveTableProps<T>) {
  
  if (loading) {
    return loadingSkeleton || (
      <div className="w-full p-8 text-center text-muted-foreground">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full p-8 sm:p-12 text-center">
        <div className="text-muted-foreground text-sm sm:text-base">
          {emptyMessage}
        </div>
      </div>
    );
  }

  // Sort columns by mobile priority for mobile view
  const mobileColumns = columns
    .filter(col => !col.mobileHidden)
    .sort((a, b) => (a.mobilePriority || 999) - (b.mobilePriority || 999));

  return (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block w-full overflow-x-auto">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className={cn(
                      "font-semibold text-xs sm:text-sm",
                      column.className
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={keyExtractor(item)} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key} 
                      className={cn(
                        "text-sm",
                        column.className
                      )}
                    >
                      {column.render 
                        ? column.render(item) 
                        : String(item[column.key] ?? '')
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-3 sm:space-y-4 w-full">
        {data.map((item) => (
          <Card key={keyExtractor(item)} className="w-full overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              {mobileCardRender ? (
                mobileCardRender(item)
              ) : (
                <div className="space-y-3">
                  {mobileColumns.map((column, idx) => (
                    <div 
                      key={column.key} 
                      className={cn(
                        "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2",
                        idx === 0 && "pb-2 border-b"
                      )}
                    >
                      <span className="text-xs font-medium text-muted-foreground min-w-0 flex-shrink-0 sm:min-w-[100px]">
                        {column.mobileLabel || column.header}:
                      </span>
                      <div className={cn(
                        "text-sm font-medium text-foreground text-left sm:text-right flex-1 min-w-0",
                        idx === 0 && "text-base font-semibold"
                      )}>
                        {column.render 
                          ? column.render(item) 
                          : String(item[column.key] ?? '')
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

