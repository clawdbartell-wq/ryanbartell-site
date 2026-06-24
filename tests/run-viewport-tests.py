from playwright.sync_api import sync_playwright
import os

viewports = [
    {'name': 'desktop',        'width': 1440, 'height': 900},
    {'name': 'mid-desktop',    'width': 1280, 'height': 800},
    {'name': 'tablet',         'width': 1024, 'height': 768},
    {'name': 'tablet-portrait','width': 820,  'height': 1180},
    {'name': 'large-phone',    'width': 414,  'height': 896},
    {'name': 'small-phone',    'width': 360,  'height': 780},
    {'name': 'tiny-phone',     'width': 320,  'height': 640},
]

base_url = 'file:///Users/ryanbartell/The-Claw/work-trillium-hiring/ryan-bartell-theme-btizzy/index.html'

os.makedirs('/tmp/ryan-v2-tests', exist_ok=True)

def on_console_error(msg, errors_list):
    if msg.type == 'error':
        errors_list.append(msg.text)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    print('=' * 60)
    print('Ryan Bartell v2 - Multi-Viewport Visual Verification')
    print('=' * 60)

    for vp in viewports:
        context = browser.new_context(viewport={'width': vp['width'], 'height': vp['height']})
        page = context.new_page()

        console_errors = []
        page.on('console', lambda msg, errs=console_errors: on_console_error(msg, errs))

        page.goto(base_url)
        page.wait_for_timeout(1500)

        fits = page.evaluate('document.body.scrollWidth <= window.innerWidth + 1')

        screenshot_path = f'/tmp/ryan-v2-tests/preview-{vp["name"]}.png'
        page.screenshot(path=screenshot_path, full_page=True)

        vp_path = f'/tmp/ryan-v2-tests/viewport-{vp["name"]}.png'
        page.screenshot(path=vp_path, full_page=False)

        section_targets = []
        if vp['name'] in ['desktop', 'mid-desktop', 'large-phone', 'small-phone']:
            section_targets = [
                ('hero', '.hero'),
                ('work', '#work'),
                ('parallax', '.parallax-section'),
                ('connect', '#connect'),
            ]

        for name, sel in section_targets:
            try:
                anchor = page.locator(sel).first
                if anchor.count() > 0:
                    anchor.scroll_into_view_if_needed()
                    page.wait_for_timeout(300)
                    page.screenshot(path=f'/tmp/ryan-v2-tests/section-{vp["name"]}-{name}.png', full_page=False)
            except Exception as e:
                print(f'  Section {name} capture failed: {e}')

        print(f"  OK {vp['name']:18} ({vp['width']}x{vp['height']}) | fits={fits} | errors={len(console_errors)} | {screenshot_path}")

        context.close()

    browser.close()

print('=' * 60)
print('Tests complete. Files in /tmp/ryan-v2-tests/')
print('=' * 60)