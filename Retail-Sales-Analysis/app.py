# -*- coding: utf-8 -*-
"""
Retail Sales Performance Analysis Dashboard
A beginner-friendly B.Tech Minor Project codebase.
"""

import os
from flask import Flask, render_react, render_template, request, redirect, url_for, flash, jsonify
import pandas as pd
import json

app = Flask(__name__)
app.secret_key = "retail_project_key_secret_123"

# Configurations for uploading datasets
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def parse_and_analyze_csv(filepath):
    """
    Core data processing function using Pandas.
    Loads raw sales records and calculates key metrics, groupings and insights.
    """
    # Load dataset
    df = pd.read_csv(filepath)
    
    # Clean data (remove spaces in column names)
    df.columns = [col.strip() for col in df.columns]
    
    # Handle missing values
    df = df.dropna(subset=['Order ID', 'Sales', 'Profit'])
    
    # Convert dates to datetime type
    df['Order Date'] = pd.to_datetime(df['Order Date'], errors='coerce')
    df = df.dropna(subset=['Order Date']) # drop rows with malformed dates
    
    # Clean numerical strings if any (like stripping currency indicators)
    if df['Sales'].dtype == object:
        df['Sales'] = df['Sales'].astype(str).str.replace(r'[₹\$,]', '', regex=True).astype(float)
    if df['Profit'].dtype == object:
        df['Profit'] = df['Profit'].astype(str).str.replace(r'[₹\$,]', '', regex=True).astype(float)
    if df['Quantity'].dtype == object:
        df['Quantity'] = df['Quantity'].astype(str).str.replace(r'[,]', '', regex=True).astype(int)

    # --- SECTION 1: KEY PERFORMANCE INDICATORS (KPIs) ---
    total_sales = round(float(df['Sales'].sum()), 2)
    total_profit = round(float(df['Profit'].sum()), 2)
    total_orders = int(df['Order ID'].nunique())
    
    # Average Sales per Order ID (Total Sales / Unique Orders)
    avg_sales_per_order = round(total_sales / total_orders if total_orders > 0 else 0, 2)
    
    metrics = {
        "total_sales": total_sales,
        "total_profit": total_profit,
        "total_orders": total_orders,
        "avg_sales_per_order": avg_sales_per_order
    }

    # --- SECTION 2: MONTHLY TRENDS ---
    # Extract Year-Month for sorting
    df['YearMonth'] = df['Order Date'].dt.to_period('M')
    monthly_df = df.groupby('YearMonth').agg({'Sales': 'sum', 'Profit': 'sum'}).sort_index()
    
    monthly_trend = {
        "labels": [str(x) for x in monthly_df.index],
        "sales": [round(float(x), 2) for x in monthly_df['Sales']],
        "profit": [round(float(x), 2) for x in monthly_df['Profit']]
    }

    # --- SECTION 3: SALES & PROFIT BY CATEGORY ---
    cat_df = df.groupby('Category').agg({'Sales': 'sum', 'Profit': 'sum'}).sort_values('Sales', ascending=False)
    category_data = {
        "labels": list(cat_df.index),
        "sales": [round(float(x), 2) for x in cat_df['Sales']],
        "profit": [round(float(x), 2) for x in cat_df['Profit']]
    }

    # --- SECTION 4: SALES & PROFIT BY REGION ---
    region_df = df.groupby('Region').agg({'Sales': 'sum', 'Profit': 'sum'}).sort_values('Sales', ascending=False)
    region_data = {
        "labels": list(region_df.index),
        "sales": [round(float(x), 2) for x in region_df['Sales']],
        "profit": [round(float(x), 2) for x in region_df['Profit']]
    }

    # --- SECTION 5: TOP 10 PRODUCTS BY SALES ---
    prod_df = df.groupby('Product Name')['Sales'].sum().reset_index()
    prod_df = prod_df.sort_values(by='Sales', ascending=False).head(10)
    top_products = {
        "labels": list(prod_df['Product Name']),
        "values": [round(float(x), 2) for x in prod_df['Sales']]
    }

    # --- SECTION 6: CUSTOMER SEGMENTATION ---
    segment_df = df.groupby('Segment')['Quantity'].sum()
    segment_data = {
        "labels": list(segment_df.index),
        "values": [int(x) for x in segment_df.values]
    }

    # --- SECTION 7: AUTOMATED BUSINESS INSIGHTS ---
    best_cat = cat_df.index[0] if not cat_df.empty else "N/A"
    best_cat_sales = round(float(cat_df['Sales'].iloc[0]), 2) if not cat_df.empty else 0
    
    best_region_profit = region_df.sort_values('Profit', ascending=False)
    best_region = best_region_profit.index[0] if not best_region_profit.empty else "N/A"
    best_region_profit_val = round(float(best_region_profit['Profit'].iloc[0]), 2) if not best_region_profit.empty else 0

    most_profitable_cat = cat_df.sort_values('Profit', ascending=False).index[0] if not cat_df.empty else "N/A"
    most_profitable_cat_val = round(float(cat_df['Profit'].max()), 2) if not cat_df.empty else 0

    top_product_title = prod_df['Product Name'].iloc[0] if not prod_df.empty else "N/A"
    top_product_sales = round(float(prod_df['Sales'].iloc[0]), 2) if not prod_df.empty else 0

    insights = [
        f"The '{best_cat}' category generated the highest gross sales of ₹{best_cat_sales:,.2f}.",
        f"The '{best_region}' region achieved the highest absolute net profit of ₹{best_region_profit_val:,.2f}.",
        f"The '{most_profitable_cat}' category remains the highest contributor to company profitability margins (₹{most_profitable_cat_val:,.2f}).",
        f"Flagship Product: '{top_product_title}' is the top-selling product generating ₹{top_product_sales:,.2f} in sales value."
    ]

    return {
        "metrics": metrics,
        "monthly_trend": monthly_trend,
        "category_data": category_data,
        "region_data": region_data,
        "top_products": top_products,
        "segment_data": segment_data,
        "insights": insights
    }


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part uploaded', 'error')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)
            
        if file and allowed_file(file.filename):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_sales_data.csv')
            file.save(filepath)
            
            try:
                # Run pandas analysis on CSV
                analysis_results = parse_and_analyze_csv(filepath)
                return render_template('index.html', results=analysis_results)
            except Exception as e:
                flash(f"Error parsing local dataset: {str(e)}", "error")
                return redirect(url_for('index'))
        else:
            flash('Invalid file extension. Please upload a .csv file document.', 'error')
            return redirect(request.url)

    # Empty GET requests, render standard form landing page
    return render_template('index.html', results=None)


if __name__ == '__main__':
    # Flask defaults to port 5000 for local execution
    app.run(host='0.0.0.0', port=5000, debug=True)
