import json
from datetime import datetime, timezone
from pathlib import Path

import requests
import yaml

BASE_HTML = "https://github.com/acidanthera/OpenCorePkg/blob/master/AppleModels/DataBase/{family}/{file}.yaml"
BASE_RAW = "https://raw.githubusercontent.com/acidanthera/OpenCorePkg/master/AppleModels/DataBase/{family}/{file}.yaml"

TARGETS = [
    {"family": "MacBookPro", "file": "MBP161"},   # MacBook Pro 16" 2019 (Intel)
    {"family": "MacBookPro", "file": "MBP164"},   # MacBook Pro 16" 2019 (alt board)
    {"family": "MacBookPro", "file": "MBP143"},   # MacBook Pro 15" 2017 (Touch Bar)
    {"family": "MacBookPro", "file": "MBP132"},   # MacBook Pro 13" 2016 Touch Bar (A1706)
    {"family": "MacBookPro", "file": "MBP131"},   # MacBook Pro 13" 2016 Two Thunderbolt (A1708)
    {"family": "MacBookPro", "file": "MBP121"},   # MacBook Pro 13" 2015
    {"family": "MacBookPro", "file": "MBP112"},   # MacBook Pro 15" 2014
    {"family": "MacBookAir", "file": "MBA82"},    # MacBook Air Retina 2019
    {"family": "MacBookAir", "file": "MBA81"},    # MacBook Air Retina 2018
    {"family": "MacBookAir", "file": "MBA72"},    # MacBook Air 13" 2015 / 2017
    {"family": "MacBookAir", "file": "MBA91"},    # MacBook Air M2 2022
    {"family": "iMac", "file": "IM201"},          # iMac 27" 5K 2020
    {"family": "iMac", "file": "IM192"}           # iMac 27" 5K 2019
]

OUTPUT_PATH = Path(__file__).parent / "public" / "data" / "mac_board_reference.json"

MANUAL_OVERRIDES: dict[str, dict[str, list[str]]] = {
    "MacBookPro16,1": {"a_numbers": ["A2141"]},
    "MacBookPro16,4": {"a_numbers": ["A2141"]},
    "MacBookPro14,3": {"a_numbers": ["A1707"]},
    "MacBookPro13,2": {"a_numbers": ["A1706"]},
    "MacBookPro13,1": {"a_numbers": ["A1708"]},
    "MacBookPro12,1": {"a_numbers": ["A1502"]},
    "MacBookPro11,2": {"a_numbers": ["A1398"]},
    "MacBookAir9,1": {"a_numbers": ["A2179"]},
    "MacBookAir8,2": {"a_numbers": ["A1932"]},
    "MacBookAir8,1": {"a_numbers": ["A1932"]},
    "MacBookAir7,2": {"a_numbers": ["A1466"]},
    "iMac20,1": {"a_numbers": ["A2115"]},
    "iMac19,2": {"a_numbers": ["A2116"]}
}

def ensure_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def format_hex(value):
    if value is None:
        return None
    if isinstance(value, str):
        return value
    if isinstance(value, int):
        return hex(value)
    return value


def format_hex_list(values):
    return [format_hex(v) for v in ensure_list(values)]


def fetch_yaml(family: str, file_code: str):
    url = BASE_RAW.format(family=family, file=file_code)
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return yaml.safe_load(response.text)


def extract_entry(family: str, file_code: str, label_override: str | None = None):
    data = fetch_yaml(family, file_code)

    specs = data.get("Specifications", {})
    marketing_names = ensure_list(specs.get("MarketingName"))
    system_report_names = ensure_list(specs.get("SystemReportName"))

    label = (
        label_override
        or (marketing_names[0] if marketing_names else None)
        or (system_report_names[0] if system_report_names else None)
        or data.get("SystemProductName")
        or file_code
    )

    firmware = {
        "bios_version": data.get("BIOSVersion"),
        "bios_release_date": data.get("BIOSReleaseDate"),
        "firmware_features": format_hex(data.get("FirmwareFeatures")),
        "firmware_features_mask": format_hex(data.get("FirmwareFeaturesMask")),
        "extended_firmware_features": format_hex(data.get("ExtendedFirmwareFeatures")),
        "extended_firmware_features_mask": format_hex(data.get("ExtendedFirmwareFeaturesMask"))
    }

    system_product = data.get("SystemProductName")

    entry = {
        "label": label,
        "family": data.get("SystemFamily"),
        "system_product_name": system_product,
        "system_report_names": system_report_names,
        "marketing_names": marketing_names,
        "a_numbers": ensure_list(data.get("ANumber")),
        "fcc_ids": ensure_list(data.get("FCCID")),
        "board_product": ensure_list(data.get("BoardProduct")),
        "board_revision": format_hex(data.get("BoardRevision")),
        "board_type": format_hex(data.get("BoardType")),
        "board_codes": ensure_list(data.get("AppleBoardCode")),
        "model_codes": ensure_list(data.get("AppleModelCode")),
        "model_years": ensure_list(data.get("AppleModelYear")),
        "cpu_options": ensure_list(specs.get("CPU")),
        "cpu_codenames": ensure_list(specs.get("CPUCodename")),
        "gpu_options": ensure_list(specs.get("GPU")),
        "ram_options": ensure_list(specs.get("RAM")),
        "minimum_os_version": data.get("MinimumOSVersion"),
        "maximum_os_version": data.get("MaximumOSVersion"),
        "smc_generation": data.get("SmcGeneration"),
        "smc_platform": format_hex_list(data.get("SmcPlatform")),
        "platform_feature": format_hex(data.get("PlatformFeature")),
        "firmware": firmware,
        "source": {
            "html": BASE_HTML.format(family=family, file=file_code),
            "raw": BASE_RAW.format(family=family, file=file_code),
            "license": "BSD-3-Clause (OpenCorePkg)"
        }
    }

    if system_product in MANUAL_OVERRIDES:
        overrides = MANUAL_OVERRIDES[system_product]
        if "a_numbers" in overrides:
            existing = set(entry.get("a_numbers", []))
            entry["a_numbers"] = sorted(existing.union(overrides["a_numbers"]))

    return entry


def main():
    models = []
    for target in TARGETS:
        family = target["family"]
        file_code = target["file"]
        label = target.get("label")
        try:
            models.append(extract_entry(family, file_code, label))
        except Exception as exc:
            raise SystemExit(f"Failed to process {family}/{file_code}: {exc}")

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "dataset": "mac_board_reference",
        "description": "Reference of Apple Mac logic boards derived from OpenCorePkg AppleModels database (BSD-3-Clause)",
        "models": models,
        "attribution": [
            {
                "name": "acidanthera/OpenCorePkg",
                "url": "https://github.com/acidanthera/OpenCorePkg",
                "license": "BSD-3-Clause"
            }
        ]
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Saved {len(models)} entries to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
