from playwright.sync_api import sync_playwright
import sys

def capture(url, output_path, viewport_width=1920, viewport_height=1080):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': viewport_width, 'height': viewport_height})
        page.goto(url, wait_until='networkidle', timeout=60000)
        page.screenshot(path=output_path, full_page=False)
        browser.close()
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        w = int(sys.argv[3]) if len(sys.argv) > 3 else 1920
        h = int(sys.argv[4]) if len(sys.argv) > 4 else 1080
        capture(sys.argv[1], sys.argv[2], w, h)
