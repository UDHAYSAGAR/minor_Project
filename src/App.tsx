/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  Coins,
  ShoppingCart,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  RefreshCcw,
  Download,
  BookOpen,
  Terminal,
  ArrowLeft,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Info,
  Layers,
  FileCode
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SAMPLE_CSV_CONTENT } from './sample_csv';
import { processSalesData } from './utils';
import { DashboardData } from './types';

export default function App() {
  const [csvContent, setCsvContent] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guide'>('dashboard');
  const [selectedChartTab, setSelectedChartTab] = useState<'sales' | 'profit' | 'product' | 'customer'>('sales');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse and trigger analytical report
  const analyzeCSVData = (text: string) => {
    try {
      setError(null);
      const data = processSalesData(text);
      setDashboardData(data);
      setCsvContent(text);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze the uploaded file. Please verify CSV columns.');
      setDashboardData(null);
    }
  };

  // Instant pre-loaded dataset option
  const handleLoadSampleData = () => {
    analyzeCSVData(SAMPLE_CSV_CONTENT);
  };

  // Raw file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      analyzeCSVData(text);
    };
    reader.onerror = () => {
      setError('Error reading the selected file.');
    };
    reader.readAsText(file);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      analyzeCSVData(text);
    };
    reader.readAsText(file);
  };

  // Download Sample CSV Helper
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "retail_sales_sample.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear loaded state
  const handleReset = () => {
    setDashboardData(null);
    setCsvContent('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Standard elegant Color schemes for charting
  const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Title / Identity */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-md">
                <BarChart3 className="h-5 w-5" id="logo-icon" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-display tracking-tight text-slate-900 leading-tight">
                  Retail Sales Performance Analysis
                </h1>
                <p className="text-xs text-slate-500 font-medium">B.Tech Minor Project Dashboard</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 shadow-3xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="tab-dashboard"
              >
                <div className="flex items-center space-x-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Live Dashboard</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                  activeTab === 'guide'
                    ? 'bg-indigo-50 text-indigo-700 shadow-3xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="tab-guide"
              >
                <div className="flex items-center space-x-1.5">
                  <FileCode className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Local Python Code & Report Pack</span>
                </div>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' ? (
          <div>
            
            {/* NO FILE UPLOADED STATE: HOME SCREEN */}
            {!dashboardData ? (
              <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                
                {/* Brand Showcase Hero Section */}
                <div className="text-center space-y-3 py-4">
                  <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full tracking-wide">
                    ACADEMIC PROJECT REPORT WORKSPACE
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900">
                    Instantly Analyze Retail Sales Performance
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
                    An elegant, full-featured analytics pipeline designed to parse multi-region transactions,
                    evaluate profit margins, visualize trends, and outline structural business intelligence.
                  </p>
                </div>

                {/* Main Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Half: Upload Card */}
                  <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                    
                    <div>
                      <div className="flex items-center space-x-2.5 mb-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          Ready for ingestion
                        </h3>
                      </div>
                      
                      {/* Drag-and-drop Area */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center min-h-[220px] ${
                          isDragging
                            ? 'border-indigo-500 bg-indigo-50/50'
                            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                        id="drag-drop-zone"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".csv"
                          className="hidden"
                          id="file-input-raw"
                        />
                        <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-4 shadow-sm">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800">
                          Drag & drop your CSV file here
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          or click to browse your local filesystem
                        </p>
                        <span className="mt-4 px-2.5 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500">
                          LIMIT: .CSV FILES ONLY
                        </span>
                      </div>
                    </div>

                    {/* Quick Access Benchmarks */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* Quick Sample Button */}
                      <button
                        onClick={handleLoadSampleData}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-1.5"
                        id="btn-load-sample"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                        <span>Load Sample Retail Data</span>
                      </button>

                      {/* Download Template */}
                      <button
                        onClick={handleDownloadSample}
                        className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center space-x-1.5 transition-all"
                        id="btn-download-sample"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-500" />
                        <span>Download Sample CSV Template</span>
                      </button>

                    </div>

                  </div>

                  {/* Right Half: Schema and Column Info */}
                  <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Dataset Specification
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        To accurately map metrics, ensure your uploaded CSV contains these headers (case & spacing are relaxed dynamically):
                      </p>
                    </div>

                    {/* Columns Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-xs italic">
                      {[
                        { name: 'Order ID', required: 'Yes', desc: 'String unique transaction key' },
                        { name: 'Order Date', required: 'Yes', desc: 'YYYY-MM-DD Date format' },
                        { name: 'Customer Name', required: 'No', desc: 'Demographics name' },
                        { name: 'Segment', required: 'Yes', desc: 'Consumer, Corporate, etc.' },
                        { name: 'Region', required: 'Yes', desc: 'East, West, South, etc.' },
                        { name: 'Category', required: 'Yes', desc: 'Technology, Furniture, etc.' },
                        { name: 'Product Name', required: 'Yes', desc: 'Product Title' },
                        { name: 'Sales', required: 'Yes', desc: 'Numeric sales volume' },
                        { name: 'Profit', required: 'Yes', desc: 'Numeric profit margin' },
                        { name: 'Quantity', required: 'Yes', desc: 'Units ordered (Integer)' },
                      ].map((col) => (
                        <div key={col.name} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
                          <span className="font-semibold text-slate-900 not-italic block">{col.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{col.desc}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

                {/* ERROR BOX */}
                {error && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-800 text-xs flex items-start space-x-2 animate-pulse">
                    <Info className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Execution Interrupted</p>
                      <p className="mt-0.5 text-red-600 font-mono">{error}</p>
                    </div>
                  </div>
                )}

                {/* Subtle project context footer block */}
                <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span><strong>Academic Mentorship:</strong> Safe sample data pre-compiled for straightforward presentation.</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono bg-white px-2.5 py-1 rounded border border-slate-200/75 text-[10px]">
                    <Terminal className="h-3 w-3 mr-1 text-emerald-500" />
                    <span>JS Standard CSV-Engine</span>
                  </div>
                </div>

              </div>
            ) : (
              
              /* PRESENTING LIVE DASHBOARD FOR LOADED DATASET */
              <div className="space-y-8 animate-fade-in">
                
                {/* Control bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-3xs flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Operational Dataset Applied
                      </h3>
                      <p className="text-xs text-slate-500">
                        Analyzing <strong className="font-semibold font-mono text-indigo-600">{dashboardData.rows.length} records</strong> across unique nodes.
                      </p>
                    </div>
                  </div>
                  
                  {/* Action row */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleReset}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all flex items-center space-x-1.5"
                      id="btn-upload-another"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      <span>Upload Different CSV</span>
                    </button>
                  </div>
                </div>

                {/* SECTION 1: KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* CARD 1: Total Sales */}
                  <div className="bg-gradient-to-br from-indigo-50 to-white hover:from-indigo-100/50 hover:to-white transition-all rounded-xl p-5 border border-indigo-100 shadow-3xs flex items-center space-x-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-500 tracking-wider block uppercase">Total Sales</span>
                      <strong className="text-xl font-extrabold text-slate-900 font-display">
                        ₹{dashboardData.metrics.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  {/* CARD 2: Total Profit */}
                  <div className={`bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100/50 hover:to-white transition-all rounded-xl p-5 border border-emerald-100 shadow-3xs flex items-center space-x-4`}>
                    <div className={`p-3 rounded-xl text-white shadow-xs ${dashboardData.metrics.totalProfit >= 0 ? "bg-emerald-600" : "bg-rose-600"}`}>
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-500 tracking-wider block uppercase">Total Net Profit</span>
                      <strong className={`text-xl font-extrabold font-display ${dashboardData.metrics.totalProfit >= 0 ? "text-slate-900" : "text-rose-600"}`}>
                        ₹{dashboardData.metrics.totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  {/* CARD 3: Total Orders */}
                  <div className="bg-gradient-to-br from-blue-50 to-white hover:from-blue-100/50 hover:to-white transition-all rounded-xl p-5 border border-blue-100 shadow-3xs flex items-center space-x-4">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-500 tracking-wider block uppercase">Total Orders</span>
                      <strong className="text-xl font-extrabold text-slate-900 font-display">
                        {dashboardData.metrics.totalOrders.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* CARD 4: Average Order Value */}
                  <div className="bg-gradient-to-br from-violet-50 to-white hover:from-violet-100/50 hover:to-white transition-all rounded-xl p-5 border border-violet-100 shadow-3xs flex items-center space-x-4">
                    <div className="p-3 bg-violet-600 text-white rounded-xl shadow-xs">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-500 tracking-wider block uppercase">Avg. Sales / Order</span>
                      <strong className="text-xl font-extrabold text-slate-900 font-display">
                        ₹{dashboardData.metrics.averageSalesPerOrder.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* GRAPH CONTROLLER TABS */}
                <div className="bg-slate-200/60 p-1.5 rounded-xl flex space-x-1 max-w-lg">
                  {[
                    { id: 'sales', label: 'Sales Trends & Markets' },
                    { id: 'profit', label: 'Margins & Regional Profit' },
                    { id: 'product', label: 'Top Product Analysis' },
                    { id: 'customer', label: 'Customer Segmentation' }
                  ].map((tb) => (
                    <button
                      key={tb.id}
                      onClick={() => setSelectedChartTab(tb.id as any)}
                      className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
                        selectedChartTab === tb.id
                          ? 'bg-white text-indigo-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                      }`}
                    >
                      {tb.label}
                    </button>
                  ))}
                </div>

                {/* MAIN ANALYTICS VISUALIZER PANEL */}
                <div className="grid grid-cols-1 gap-6">
                  
                  {/* TAB 1: SALES TRENDS */}
                  {selectedChartTab === 'sales' && (
                    <div className="space-y-6">
                      
                      {/* Monthly sales trend full width */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h2 className="text-base font-bold text-slate-900 font-display">Monthly Sales Trend</h2>
                            <p className="text-xs text-slate-500">Chronological analysis of incoming volume over parsed months</p>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Section 2</span>
                        </div>
                        <div className="h-80 w-full" id="monthly-trend-container">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                              <Tooltip 
                                formatter={(value) => [`₹${parseFloat(value as string).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Sales amount']}
                                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }}
                              />
                              <Legend verticalAlign="top" height={36} iconSize={10} />
                              <Line 
                                type="monotone" 
                                dataKey="sales" 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                name="Sales Total"
                                activeDot={{ r: 6 }} 
                                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Bar charts side by side */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Sales by category */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 font-display">Sales Volume by Category</h3>
                              <p className="text-xs text-slate-500">Gross revenue generated per structural category</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Sec 2.2</span>
                          </div>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={dashboardData.salesByCategory} barSize={34}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                                <Tooltip
                                  formatter={(value) => [`₹${parseFloat(value as string).toLocaleString('en-IN')}`, 'Sales']}
                                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }}
                                />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Sales amount">
                                  {dashboardData.salesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Sales by region */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 font-display">Sales Volume by Region</h3>
                              <p className="text-xs text-slate-500">Market distribution geography overview</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Sec 2.3</span>
                          </div>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={dashboardData.salesByRegion} barSize={34}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                                <Tooltip
                                  formatter={(value) => [`₹${parseFloat(value as string).toLocaleString('en-IN')}`, 'Sales']}
                                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sales amount">
                                  {dashboardData.salesByRegion.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* TAB 2: MARGIN ANALYSIS */}
                  {selectedChartTab === 'profit' && (
                    <div className="space-y-6">
                      
                      {/* Profit trend vs sales line chart */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h2 className="text-base font-bold text-slate-900 font-display">Revenue vs Profit Timeline</h2>
                            <p className="text-xs text-slate-500">Margin trajectory across operational months</p>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Section 3</span>
                        </div>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                              <Tooltip 
                                formatter={(value) => [`₹${parseFloat(value as string).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`]}
                                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }} 
                              />
                              <Legend verticalAlign="top" height={36} iconSize={10} />
                              
                              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={1} activeDot={{ r: 4 }} name="Total Revenue" />
                              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} name="Net Profit" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Profit by Category */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 font-display">Net Profit by Product Category</h3>
                              <p className="text-xs text-slate-500">Actual margin return per sector</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Sec 3.1</span>
                          </div>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={dashboardData.profitByCategory} barSize={34}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                                <Tooltip
                                  formatter={(value) => [`₹${parseFloat(value as string).toLocaleString('en-IN')}`, 'Profit']}
                                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit">
                                  {dashboardData.profitByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#ef4444' : '#10b981'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Profit by Region */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 font-display">Net Profit by Geographic Region</h3>
                              <p className="text-xs text-slate-500">Net profitability yields inside structural territories</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Sec 3.2</span>
                          </div>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={dashboardData.profitByRegion} barSize={34}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                                <Tooltip
                                  formatter={(value) => [`₹${parseFloat(value as string).toLocaleString('en-IN')}`, 'Profit']}
                                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }}
                                />
                                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Profit">
                                  {dashboardData.profitByRegion.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#ef4444' : '#06b6d4'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* TAB 3: PRODUCT ANALYSIS */}
                  {selectedChartTab === 'product' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-base font-bold text-slate-900 font-display">Top 10 Selling Products</h2>
                          <p className="text-xs text-slate-500">Gross Sales achievement leaders inside selected transactions</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Section 4</span>
                      </div>
                      <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={dashboardData.topProducts}
                            margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
                            barSize={18}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={130} tickLine={false} />
                            <Tooltip
                              formatter={(value) => [`₹${parseFloat(value as string).toLocaleString('en-IN')}`, 'Sales Volume']}
                              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }}
                            />
                            <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Sales Volume">
                              {dashboardData.topProducts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[6 - (index % CHART_COLORS.length)]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CUSTOMER ANALYSIS */}
                  {selectedChartTab === 'customer' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Cust segment Chart */}
                      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h2 className="text-base font-bold text-slate-900 font-display">Customer Segments Distribution</h2>
                            <p className="text-xs text-slate-500">Product quantity representation relative to buyer demographic groups</p>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Section 5</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-around h-72">
                          {/* Pie chart */}
                          <div className="h-64 w-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={dashboardData.segmentDistribution}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={90}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {dashboardData.segmentDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} units`, 'Total Units']} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          {/* Legends inside segment mapping */}
                          <div className="space-y-3 shrink-0">
                            {dashboardData.segmentDistribution.map((seg, index) => (
                              <div key={seg.name} className="flex items-center space-x-3 text-xs">
                                <span className="h-3.5 w-3.5 rounded-full inline-block shadow-3xs" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                                <div>
                                  <span className="font-semibold text-slate-800">{seg.name}</span>
                                  <span className="text-slate-400 ml-2 font-mono">{seg.value.toLocaleString()} units</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Side segment detail overview */}
                      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                            Segmentation Summary
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Understanding demographics guides marketing strategies. Higher volume segments represents loyal clients, while smaller units show secondary business sectors.
                          </p>
                          
                          {/* Progress breakdown */}
                          <div className="space-y-3 pt-2">
                            {dashboardData.segmentDistribution.map((seg, idx) => {
                              const totalQty = dashboardData.segmentDistribution.reduce((acc, curr) => acc + curr.value, 0);
                              const pct = totalQty > 0 ? ((seg.value / totalQty) * 100).toFixed(1) : '0';
                              return (
                                <div key={seg.name} className="space-y-1">
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-slate-700">{seg.name}</span>
                                    <span className="text-indigo-600 font-mono">{pct}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full rounded-full transition-all duration-500" 
                                      style={{ 
                                        width: `${pct}%`, 
                                        backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] 
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs mt-4">
                          <div className="flex items-center space-x-1.5 font-bold text-indigo-700">
                            <Award className="h-4 w-4" />
                            <span>Primary Demographic Yield</span>
                          </div>
                          <p className="text-slate-500 text-[10px]">
                            {dashboardData.segmentDistribution.length > 0 ? (
                              <>The <strong>{dashboardData.segmentDistribution[0].name}</strong> sector continues to yield dominant purchase counts.</>
                            ) : 'No metrics detected.'}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* SECTION 6: BUSINESS INSIGHTS */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold font-display text-slate-900">
                      Automated Operational Insights
                    </h2>
                  </div>
                  
                  {/* Grid of beautiful Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Insight 1: Best performing category */}
                    <div className="bg-white rounded-xl border-l-[5px] border-l-blue-500 border-y border-r border-slate-200 p-5 shadow-3xs space-y-2 hover:shadow-xs transition-shadow">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">TOP EARNER CATEGORY</span>
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                        The <strong className="text-blue-700 underline decoration-indigo-200 underline-offset-4">{dashboardData.insights.bestPerformingCategory}</strong> category generated the highest gross sales.
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Accomplishing absolute income of: <strong className="text-slate-600">₹{dashboardData.insights.bestPerformingCategoryValue.toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                    {/* Insight 2: Most profitable category */}
                    <div className="bg-white rounded-xl border-l-[5px] border-l-emerald-500 border-y border-r border-slate-200 p-5 shadow-3xs space-y-2 hover:shadow-xs transition-shadow">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">NET HIGHEST MARGIN</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                        Maximum bottom-line profitability was achieved in <strong className="text-emerald-700 underline decoration-indigo-200 underline-offset-4">{dashboardData.insights.mostProfitableCategory}</strong>.
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Achieved aggregate net-profit of: <strong className="text-slate-600">₹{dashboardData.insights.mostProfitableCategoryValue.toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                    {/* Insight 3: Highest sales region */}
                    <div className="bg-white rounded-xl border-l-[5px] border-l-purple-500 border-y border-r border-slate-200 p-5 shadow-3xs space-y-2 hover:shadow-xs transition-shadow">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">TERRITORIAL LEADER</span>
                        <Award className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                        Purchasing volume highlights <strong className="text-purple-700 underline decoration-indigo-200 underline-offset-4">{dashboardData.insights.highestSalesRegion}</strong> region as the highest consumer base.
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Territory sales aggregate of: <strong className="text-slate-600">₹{dashboardData.insights.highestSalesRegionValue.toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                    {/* Insight 4: Best selling product */}
                    <div className="bg-white rounded-xl border-l-[5px] border-l-amber-500 border-y border-r border-slate-200 p-5 shadow-3xs space-y-2 hover:shadow-xs transition-shadow md:col-span-2 lg:col-span-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">FLAGSHIP INVENTORY</span>
                        <CheckCircle className="h-4 w-4 text-amber-500" />
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                        Product <strong className="text-amber-700 font-semibold italic">{dashboardData.insights.topSellingProduct}</strong> remains the top-selling product.
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Gross individual unit sales yield: <strong className="text-slate-600">₹{dashboardData.insights.topSellingProductValue.toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                    {/* Insight 5: Margin improvement vector */}
                    <div className="bg-white rounded-xl border-l-[5px] border-l-rose-500 border-y border-r border-slate-200 p-5 shadow-3xs space-y-2 hover:shadow-xs transition-shadow md:col-span-2 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded">MARGIONAL WATCHLIST</span>
                        <Info className="h-4 w-4 text-rose-500" />
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                        Structural costs or pricing metrics inside <strong className="text-rose-600 font-semibold">{dashboardData.insights.lowestProfitCategory}</strong> highlight it as the lowest margin performer, requiring cost audits.
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Category baseline profit margin index: <strong className="text-slate-600">₹{dashboardData.insights.lowestProfitCategoryValue.toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                  </div>
                </div>

                {/* PROJECT WORKSPACE FOOTER */}
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Looking to build your local B.Tech submission?
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check out our blueprint files and detailed deployment setup guide. Code structures and documentation matrices are fully supported!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('guide')}
                    className="w-full md:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>View Project Submission Materials</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        ) : (
          
          /* ACADEMIC B.TECH SUPPORT CENTER & SOURCE CODE GUIDE */
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id="academic-guide">
            
            {/* Guide Head */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <FileCode className="h-4.5 w-4.5" />
                <span>B.Tech Minor Project Companion Pack</span>
              </div>
              <h2 className="text-2xl font-extrabold font-display text-slate-900">
                Local Submission Materials (Flask + Python)
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                As a senior mentor, I have fully scaffolded the Python and Flask codebase in your directory tree. Use the following guides to copy the files, assemble your reports, and deliver a clean project review.
              </p>
            </div>

            {/* Quick Action Box: Download Flask ZIP or view local tree */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-mono">WORKSPACE EXCLUSIVES</h4>
                <p className="text-sm font-bold text-slate-900">Local Blueprint Files Preloaded</p>
                <p className="text-xs text-slate-500">
                  I have automatically saved a secondary folder <code className="font-mono bg-slate-100 text-indigo-600 px-1 py-0.5 rounded text-[11px]">/Retail-Sales-Analysis/</code> in your file system containing the exact app.py, templates/index.html, CSS, requirements.txt, and setup readmes requested!
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="text-xs font-medium text-slate-500 flex items-center space-x-1 justify-center sm:justify-start">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                  <span>Files stored in current path</span>
                </div>
                <button
                  onClick={handleDownloadSample}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  <span>Download Sample CSV Dataset</span>
                </button>
              </div>
            </div>

            {/* Structured Project Setup Documentation */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
                <h3 className="font-bold text-base font-display">Python & Flask Setup Instructions</h3>
                <p className="text-xs text-indigo-100 mt-1">Four simple steps to boot your locally processed business intelligence engine.</p>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Step 1 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center text-xs font-bold">1</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Initialize Python Environment</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-7">
                    Create a Python virtual environment to keep your dependencies catalog isolated. Run these commands inside your local directory:
                  </p>
                  <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 pl-7">
                    {`# Create Virtual Environment\npython -m venv venv\n\n# Activate (Windows / macOS)\nvenv\\Scripts\\activate  # on Windows\nsource venv/bin/activate  # on macOS/Linux`}
                  </pre>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center text-xs font-bold">2</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Install Dependencies</h4>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">
                    Use <strong className="font-semibold text-slate-700">pip</strong> to ingest the necessary data analysis libraries (Pandas and Flask framework):
                  </p>
                  <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 pl-7">
                    {`pip install -r requirements.txt`}
                  </pre>
                </div>

                {/* Step 3 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center text-xs font-bold">3</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Boot local server</h4>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">
                    Start the Flask application server on your local machine:
                  </p>
                  <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 pl-7">
                    {`python app.py`}
                  </pre>
                </div>

                {/* Step 4 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center text-xs font-bold">4</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Access Local Sandbox</h4>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">
                    Launch your preferred web browser and direct your navigation to the local hosting client:
                  </p>
                  <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 pl-7">
                    {`http://localhost:5000`}
                  </pre>
                </div>

              </div>
            </div>

            {/* Examination Questions to get 10/10 Score */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 font-display">
                  Viva / Examination Defense Guide
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Be prepared to answer these common questions regarding your Minor Project:
              </p>

              <div className="space-y-4 pt-2">
                
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <strong className="text-slate-800 block">Q1: How does Pandas process and clean the uploaded CSV raw datastream?</strong>
                  <p className="text-slate-500 text-[11px] italic leading-relaxed">
                    Ans: Under standard Python execution, Pandas utilizes <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[10px]">pd.read_csv()</code> to load the text file into a DataFrame. Handled via the pandas engine, invalid data elements are scrubbed using <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[10px]">df.dropna()</code> or <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[10px]">df.fillna()</code>, and dates are coerced into timestamps via <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[10px]">pd.to_datetime()</code>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <strong className="text-slate-800 block">Q2: Why do we use aggregated groupings like GroupBy in your analysis?</strong>
                  <p className="text-slate-500 text-[11px] italic leading-relaxed">
                    Ans: Groupings permit consolidating row-level transactions into structural segments. For instances, grouping by Region and aggregating on Profit allows us to assess geographic territories dynamically.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <strong className="text-slate-800 block">Q3: How are the charts rendered interactively?</strong>
                  <p className="text-slate-500 text-[11px] italic leading-relaxed">
                    Ans: For local execution, the compiled aggregations are parsed into JSON variables inside Python-Flask, which are then passed downstream to Chart.js in the index.html templates for lightweight, SVG/Canvas canvas styling.
                  </p>
                </div>

              </div>
            </div>

            {/* Back to main layout button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Live Dashboard</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 Retail Sales Analytics. Scaled with modern React, Tailwind and Chart Engine.</p>
          <p>Prepared for Academic Evaluation & Presentation.</p>
        </div>
      </footer>

    </div>
  );
}
