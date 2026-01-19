import pandas as pd
import json
import os
import re

OUTPUT_DIR = "/home/user/webapp/public/data"
FILE_EXCHANGE = "/home/user/uploaded_files/02.12.2025_Exchange_Price_List.xlsx"
FILE_SERVICE = "/home/user/uploaded_files/Копия spark_AI_Sheets-20260117_1717.xlsx"

def process_exchange_prices():
    print("Processing Exchange Prices...")
    try:
        df = pd.read_excel(FILE_EXCHANGE)
        # Ожидаем колонки: Article, Part Description, Stock UAH, Exchange UAH
        
        exchange_db = {}
        for _, row in df.iterrows():
            article = str(row.get('Article', '')).strip()
            if not article or article == 'nan': continue
            
            exchange_db[article] = {
                "description": str(row.get('Part Description', '')).strip(),
                "price_stock_uah": float(row.get('Stock UAH', 0)) if pd.notna(row.get('Stock UAH')) else 0,
                "price_exchange_uah": float(row.get('Exchange UAH', 0)) if pd.notna(row.get('Exchange UAH')) else 0
            }
            
        with open(f"{OUTPUT_DIR}/exchange_prices.json", "w", encoding='utf-8') as f:
            json.dump(exchange_db, f, indent=2, ensure_ascii=False)
        print(f"Saved {len(exchange_db)} exchange prices.")
        
    except Exception as e:
        print(f"Error processing exchange prices: {e}")

def process_service_prices():
    print("Processing Service Prices...")
    try:
        xls = pd.ExcelFile(FILE_SERVICE)
        service_db = {}
        
        # Обрабатываем листы цен
        price_sheets = {
            'Iphone_price': 'iPhone',
            'Macbook_price': 'MacBook',
            'Ipad_price': 'iPad',
            'Watch_price': 'Apple Watch'
        }
        
        for sheet_name, category in price_sheets.items():
            if sheet_name not in xls.sheet_names: continue
            
            print(f"  - Sheet: {sheet_name}")
            df = pd.read_excel(FILE_SERVICE, sheet_name=sheet_name)
            
            # Определяем ключевую колонку (Model, или просто первая)
            model_col = df.columns[0] # Обычно первая колонка это модель
            
            models_data = []
            for _, row in df.iterrows():
                model_name = str(row[model_col]).strip()
                if not model_name or model_name == 'nan': continue
                
                # Собираем цены на услуги (все остальные колонки)
                services = {}
                for col in df.columns[1:]:
                    price = row[col]
                    if pd.notna(price) and price != 0:
                        services[col.strip()] = str(price)
                
                if services:
                    models_data.append({
                        "model": model_name,
                        "services": services
                    })
            
            service_db[category] = models_data

        with open(f"{OUTPUT_DIR}/service_prices_romania.json", "w", encoding='utf-8') as f:
            json.dump(service_db, f, indent=2, ensure_ascii=False)
        print(f"Saved service prices for {list(service_db.keys())}.")

    except Exception as e:
        print(f"Error processing service prices: {e}")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    process_exchange_prices()
    process_service_prices()
