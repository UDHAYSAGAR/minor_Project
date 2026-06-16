/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Interface representing a single row of the parsed Retail Sales CSV.
export interface RetailSalesRow {
  orderId: string;
  orderDate: Date;
  customerName: string;
  segment: string;
  region: string;
  category: string;
  productName: string;
  sales: number;
  profit: number;
  quantity: number;
}

// Interface for aggregated metrics.
export interface DashboardMetrics {
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
  averageSalesPerOrder: number;
}

// Interface for monthly sales data point.
export interface MonthlyTrendData {
  month: string; // e.g., "2026-01"
  sales: number;
  profit: number;
}

// Interface for key value pairing.
export interface KeyValueData {
  name: string;
  value: number;
}

// Interface for business insights.
export interface BusinessInsights {
  bestPerformingCategory: string;
  bestPerformingCategoryValue: number;
  highestSalesRegion: string;
  highestSalesRegionValue: number;
  mostProfitableCategory: string;
  mostProfitableCategoryValue: number;
  topSellingProduct: string;
  topSellingProductValue: number;
  lowestProfitCategory: string;
  lowestProfitCategoryValue: number;
}

// Interface for complete dashboard state.
export interface DashboardData {
  rows: RetailSalesRow[];
  metrics: DashboardMetrics;
  monthlyTrend: MonthlyTrendData[];
  salesByCategory: KeyValueData[];
  salesByRegion: KeyValueData[];
  profitByCategory: KeyValueData[];
  profitByRegion: KeyValueData[];
  topProducts: KeyValueData[];
  segmentDistribution: KeyValueData[];
  insights: BusinessInsights;
}
