import pandas as pd
import os

files = [
    "/home/user/uploaded_files/Копия spark_AI_Sheets-20260117_1717.xlsx",
    "/home/user/uploaded_files/02.12.2025_Exchange_Price_List.xlsx"
]

for file_path in files:
    print(f"\n--- ANALYZING: {os.path.basename(file_path)} ---")
    try:
        # Читаем все листы
        xls = pd.ExcelFile(file_path)
        print(f"Sheets: {xls.sheet_names}")
        
        for sheet in xls.sheet_names:
            print(f"\nSheet: {sheet}")
            df = pd.read_excel(file_path, sheet_name=sheet, nrows=3)
            print("Columns:", list(df.columns))
            print("First row data:", df.iloc[0].to_dict() if not df.empty else "Empty")
            
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
