/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  RetailSalesRow,
  DashboardData,
  DashboardMetrics,
  MonthlyTrendData,
  KeyValueData,
  BusinessInsights,
} from './types';

// Robust CSV Line parser that handles quotes and commas inside cells
export function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip linefeed
      }
      row.push(current.trim());
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
        result.push(row);
      }
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current !== '' || row.length > 0) {
    row.push(current.trim());
    result.push(row);
  }

  return result;
}

// Convert parsed CSV string matrix to structured objects and perform aggregation
export function processSalesData(csvText: string): DashboardData {
  const parsed = parseCSV(csvText);
  if (parsed.length < 2) {
    throw new Error("CSV file must contain a header and at least one data row.");
  }

  const headers = parsed[0].map(h => h.toLowerCase().trim().replace(/[\s_-]+/g, ''));

  // Locate columns dynamically using flexible header matching
  const colIndex = {
    orderId: headers.findIndex(h => h.includes('orderid') || h === 'id'),
    orderDate: headers.findIndex(h => h.includes('date')),
    customerName: headers.findIndex(h => h.includes('customer') || h.includes('name')),
    segment: headers.findIndex(h => h === 'segment'),
    region: headers.findIndex(h => h === 'region'),
    category: headers.findIndex(h => h === 'category'),
    productName: headers.findIndex(h => h.includes('product') || h.includes('item')),
    sales: headers.findIndex(h => h === 'sales' || h.includes('salesamt')),
    profit: headers.findIndex(h => h === 'profit'),
    quantity: headers.findIndex(h => h === 'quantity' || h === 'qty'),
  };

  // Fallback map if index is not found (-1), try common index positions
  const idx = {
    orderId: colIndex.orderId !== -1 ? colIndex.orderId : 0,
    orderDate: colIndex.orderDate !== -1 ? colIndex.orderDate : 1,
    customerName: colIndex.customerName !== -1 ? colIndex.customerName : 2,
    segment: colIndex.segment !== -1 ? colIndex.segment : 3,
    region: colIndex.region !== -1 ? colIndex.region : 4,
    category: colIndex.category !== -1 ? colIndex.category : 5,
    productName: colIndex.productName !== -1 ? colIndex.productName : 6,
    sales: colIndex.sales !== -1 ? colIndex.sales : 7,
    profit: colIndex.profit !== -1 ? colIndex.profit : 8,
    quantity: colIndex.quantity !== -1 ? colIndex.quantity : 9,
  };

  const rows: RetailSalesRow[] = [];

  // Parse each data row
  for (let r = 1; r < parsed.length; r++) {
    const rowData = parsed[r];
    // Ignore short empty rows or rows missing actual values
    if (rowData.length < Math.max(...Object.values(idx)) + 1) {
      continue;
    }

    const rawId = rowData[idx.orderId] || '';
    const rawDateStr = rowData[idx.orderDate] || '';
    const rawCustomer = rowData[idx.customerName] || 'Unknown Customer';
    const rawSegment = rowData[idx.segment] || 'Other';
    const rawRegion = rowData[idx.region] || 'Other';
    const rawCategory = rowData[idx.category] || 'Other';
    const rawProduct = rowData[idx.productName] || 'Other Product';
    
    // Clean currency indicators (₹, $, Rs., or commas)
    const rawSales = parseFloat((rowData[idx.sales] || '0').replace(/[₹\$,\s]|Rs\.?/gi, ''));
    const rawProfit = parseFloat((rowData[idx.profit] || '0').replace(/[₹\$,\s]|Rs\.?/gi, ''));
    const rawQuantity = parseInt((rowData[idx.quantity] || '1').replace(/[,\s]+/g, ''), 10);

    if (isNaN(rawSales) || rawId === '') {
      continue; // Skip invalid records
    }

    // Try parsing date
    let dateObj = new Date(rawDateStr);
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(); // default to current date if parsing fails
    }

    rows.push({
      orderId: rawId,
      orderDate: dateObj,
      customerName: rawCustomer,
      segment: rawSegment,
      region: rawRegion,
      category: rawCategory,
      productName: rawProduct,
      sales: rawSales,
      profit: rawProfit,
      quantity: isNaN(rawQuantity) ? 1 : rawQuantity,
    });
  }

  if (rows.length === 0) {
    throw new Error("Could not parse any valid sales rows from the uploaded CSV file. Please check columns.");
  }

  // --- CALCULATE SECTION 1: KPI METRICS ---
  let totalSales = 0;
  let totalProfit = 0;
  const uniqueOrders = new Set<string>();

  rows.forEach(r => {
    totalSales += r.sales;
    totalProfit += r.profit;
    uniqueOrders.add(r.orderId);
  });

  const totalOrders = uniqueOrders.size;
  const averageSalesPerOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

  const metrics: DashboardMetrics = {
    totalSales: parseFloat(totalSales.toFixed(2)),
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    totalOrders,
    averageSalesPerOrder: parseFloat(averageSalesPerOrder.toFixed(2)),
  };

  // --- CALCULATE SECTION 2: MONTHLY TREND ---
  // Group by "YYYY-MM"
  const monthlyMap = new Map<string, { sales: number; profit: number }>();
  rows.forEach(r => {
    const year = r.orderDate.getFullYear();
    const monthIndex = r.orderDate.getMonth() + 1;
    const monthKey = `${year}-${monthIndex.toString().padStart(2, '0')}`;
    
    const existing = monthlyMap.get(monthKey) || { sales: 0, profit: 0 };
    existing.sales += r.sales;
    existing.profit += r.profit;
    monthlyMap.set(monthKey, existing);
  });

  // Sort months chronologically
  const sortedMonths = Array.from(monthlyMap.keys()).sort();
  const monthlyTrend: MonthlyTrendData[] = sortedMonths.map(month => {
    const val = monthlyMap.get(month)!;
    return {
      month,
      sales: parseFloat(val.sales.toFixed(2)),
      profit: parseFloat(val.profit.toFixed(2)),
    };
  });

  // --- CALCULATE SALES & PROFIT BY CATEGORY & REGION ---
  const salesByCatMap = new Map<string, number>();
  const profitByCatMap = new Map<string, number>();
  const salesByRegMap = new Map<string, number>();
  const profitByRegMap = new Map<string, number>();
  const segmentMap = new Map<string, number>();

  rows.forEach(r => {
    const cat = r.category;
    const reg = r.region;
    const seg = r.segment;

    salesByCatMap.set(cat, (salesByCatMap.get(cat) || 0) + r.sales);
    profitByCatMap.set(cat, (profitByCatMap.get(cat) || 0) + r.profit);
    salesByRegMap.set(reg, (salesByRegMap.get(reg) || 0) + r.sales);
    profitByRegMap.set(reg, (profitByRegMap.get(reg) || 0) + r.profit);
    segmentMap.set(seg, (segmentMap.get(seg) || 0) + r.quantity); // Orders quantity or count
  });

  const salesByCategory: KeyValueData[] = Array.from(salesByCatMap.entries()).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  })).sort((a, b) => b.value - a.value);

  const profitByCategory: KeyValueData[] = Array.from(profitByCatMap.entries()).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  })).sort((a, b) => b.value - a.value);

  const salesByRegion: KeyValueData[] = Array.from(salesByRegMap.entries()).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  })).sort((a, b) => b.value - a.value);

  const profitByRegion: KeyValueData[] = Array.from(profitByRegMap.entries()).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  })).sort((a, b) => b.value - a.value);

  const segmentDistribution: KeyValueData[] = Array.from(segmentMap.entries()).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  // --- CALCULATE SECTION 4: PRODUCT ANALYSIS (TOP 10) ---
  const productSalesMap = new Map<string, number>();
  rows.forEach(r => {
    productSalesMap.set(r.productName, (productSalesMap.get(r.productName) || 0) + r.sales);
  });

  const topProducts: KeyValueData[] = Array.from(productSalesMap.entries())
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // --- CALCULATE SECTION 6: BUSINESS INSIGHTS ---
  // Find highest sales category
  const bestPerformingCategory = salesByCategory.length > 0 ? salesByCategory[0].name : 'N/A';
  const bestPerformingCategoryValue = salesByCategory.length > 0 ? salesByCategory[0].value : 0;

  // Find lowest profit category for constructive insight
  const lowestProfitCategory = profitByCategory.length > 0 ? profitByCategory[profitByCategory.length - 1].name : 'N/A';
  const lowestProfitCategoryValue = profitByCategory.length > 0 ? profitByCategory[profitByCategory.length - 1].value : 0;

  // Find highest profit region
  const highestSalesRegion = salesByRegion.length > 0 ? salesByRegion[0].name : 'N/A';
  const highestSalesRegionValue = salesByRegion.length > 0 ? salesByRegion[0].value : 0;

  const mostProfitableCategory = profitByCategory.length > 0 ? profitByCategory[0].name : 'N/A';
  const mostProfitableCategoryValue = profitByCategory.length > 0 ? profitByCategory[0].value : 0;

  // Top selling product (by sales)
  const topSellingProduct = topProducts.length > 0 ? topProducts[0].name : 'N/A';
  const topSellingProductValue = topProducts.length > 0 ? topProducts[0].value : 0;

  const insights: BusinessInsights = {
    bestPerformingCategory,
    bestPerformingCategoryValue,
    highestSalesRegion,
    highestSalesRegionValue,
    mostProfitableCategory,
    mostProfitableCategoryValue,
    topSellingProduct,
    topSellingProductValue,
    lowestProfitCategory,
    lowestProfitCategoryValue,
  };

  return {
    rows,
    metrics,
    monthlyTrend,
    salesByCategory,
    salesByRegion,
    profitByCategory,
    profitByRegion,
    topProducts,
    segmentDistribution,
    insights,
  };
}
