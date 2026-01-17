import json
import os

# Path to the devices database
DB_PATH = '/home/user/webapp/public/data/devices.json'

# 1. New Data: iPhone 15 Pro
iphone_15_pro = {
    "id": 28,
    "name": "iPhone 15 Pro",
    "model": "A2848, A3101, A3102, A3104",
    "year": 2023,
    "category": "iPhone",
    "processor": "Apple A17 Pro",
    "processor_family": "A17",
    "charging_ic": {
      "main": "SN2012027",
      "location": "Lower board / USB-C flex assembly",
      "voltage": "5V/9V/15V/20V PD 3.0",
      "current": "Up to 3A (27W)",
      "aliexpress": "https://www.aliexpress.com/w/wholesale-SN2012027.html",
      "price_range": "$15-25",
      "full_name": "Apple Custom USB-C Controller (SN2012027)",
      "voltage_support": "5V/9V/15V/20V PD 3.0",
      "max_current": "3A (27W)",
      "fast_charging": "Yes (27W)",
      "usb_pd": "3.0",
      "wireless_charging": "Yes (15W MagSafe + Qi2)"
    },
    "power_ic": {
        "main": "338S00946", 
        "full_name": "Power Delivery IC 338S00946"
    },
    "memory": {
      "nand_type": "NVMe",
      "ram_type": "LPDDR5",
      "price_nand": "$40-80",
      "price_ram": "$20-30"
    },
    "audio_codec": {
      "main": "Cirrus Logic Custom", 
      "location": "Main logic board"
    },
    "donors": [],
    "common_issues": [
      "Motherboard random reboots",
      "USB-C port wear/loose connection",
      "Overheating during fast charging",
      "No power after 3rd party charger use"
    ],
    "repair_notes": "First iPhone with USB-C. Contains paired ICs. Requires programmer for battery/display serialization.",
    "repair_difficulty": "Expert",
    "repair_time": "2-4 hours",
    "tools_needed": [
      "Heating mat (screen removal)",
      "Torx Plus screwdrivers",
      "USB-C ammeter",
      "Programmer (V1S Pro)"
    ],
    "technical_specs": {},
    "documentation_links": {
      "ifixit": "https://www.ifixit.com/Device/iPhone_15_Pro",
      "apple_support": "https://support.apple.com/iphone-15-pro",
      "boardview": "N/A yet",
      "schematics": "N/A yet"
    }
}

# 2. Board Numbers Mapping
board_numbers = {
    "iPhone 6s": ["820-5585"],
    "iPhone 6s Plus": ["820-5586"],
    "iPhone 7": ["820-00188 (Qualcomm)", "820-00189 (Intel)"],
    "iPhone 7 Plus": ["820-00229 (Qualcomm)", "820-00249 (Intel)"],
    "iPhone 8": ["820-00909 (Qualcomm)", "820-00908 (Intel)"],
    "iPhone 8 Plus": ["820-00927 (Qualcomm)", "820-00926 (Intel)"],
    "iPhone X": ["820-00863 (Qualcomm)", "820-00864 (Intel)"],
    "iPhone XR": ["820-01173"],
    "iPhone XS": ["820-01127"],
    "iPhone XS Max": ["820-01053"],
    "iPhone 11": ["820-01582"],
    "iPhone 11 Pro": ["820-01682"],
    "iPhone 11 Pro Max": ["820-01682"], # Usually shares layout
    "iPhone 12": ["820-02057"],
    "iPhone 12 Pro": ["820-02057"],
    "iPhone 12 Pro Max": ["820-02059"]
}

# 3. Specific Forum Knowledge (Faults)
forum_knowledge = {
    "iPhone 7": [
        "Audio IC Disease (Loop Disease) - C12 Pad broken under U3101",
        "No Service (Intel Models) - BBPMU internal failure",
        "TriStar failure (Fake charging)"
    ],
    "iPhone 7 Plus": [
        "Audio IC Disease (Loop Disease) - C12 Pad broken under U3101",
        "Camera LDO short - Black camera screen",
        "Touch Disease (less common than 6 Plus but exists)"
    ],
    "iPhone 6s": [
        "No Backlight - Short on backlight filter/diode",
        "No Power - Short on VCC_MAIN (often WiFi cap)"
    ],
    "iPhone X": [
        "Interposer Separation - Touch issues, No Sim, Restarting",
        "Face ID failure due to water ingress (Dot Projector)",
        "Short on VDD_MAIN"
    ],
    "iPhone 12": [
        "No Service - Interposer crack",
        "Green Screen (Display issue)",
        "Camera glass easy to crack"
    ],
    "iPhone 13 Pro Max": [
        "WSOD (White Screen of Death) - LCD flex bonding issue",
        "BSOD (Green Screen of Death)",
        "Rear System failure (Panic Full reset)"
    ]
}

def enrich_database():
    print("Reading existing database...")
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            devices = json.load(f)
    except FileNotFoundError:
        print("Database not found!")
        return

    print(f"Loaded {len(devices)} devices.")
    
    # Update existing devices
    for device in devices:
        name = device.get('name')
        
        # 1. Add Board Numbers
        if name in board_numbers:
            device['board_numbers'] = board_numbers[name]
            print(f"Added board numbers for {name}")
            
        # 2. Enrich Common Issues
        if name in forum_knowledge:
            current_issues = device.get('common_issues', [])
            new_issues = forum_knowledge[name]
            # Add only unique new issues
            for issue in new_issues:
                if issue not in current_issues:
                    current_issues.insert(0, f"🔥 {issue}") # Mark as hot/forum info
            device['common_issues'] = current_issues
            print(f"Enriched issues for {name}")

    # 3. Check if iPhone 15 Pro exists, if not add it
    exists = any(d.get('name') == "iPhone 15 Pro" for d in devices)
    if not exists:
        devices.append(iphone_15_pro)
        print("Added iPhone 15 Pro to database.")
    
    # Save back
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(devices, f, ensure_ascii=False, indent=2)
    
    print("Database enrichment complete!")

if __name__ == "__main__":
    enrich_database()
