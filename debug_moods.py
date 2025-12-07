import requests
import json

try:
    response = requests.get('http://127.0.0.1:8000/api/moods')
    data = response.json()
    
    total_items = 0
    print("Categories:")
    for title, items in data.items():
        print(f"[{title}] - {len(items)} items")
        total_items += len(items)
        for item in items:
            print(f"  - {item['title']}")
            
    print(f"\nTotal items: {total_items}")
    
except Exception as e:
    print(f"Error: {e}")
