import re
import time
import random

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def is_url(text: str) -> bool:
    return text.startswith("http://") or text.startswith("https://")


def _build_flipkart_review_url(url: str) -> str:
    """Convert any Flipkart product URL to its reviews URL."""
    if "/product-reviews/" in url:
        return url
    if "/p/" in url:
        return re.sub(r"/p/", "/product-reviews/", url, count=1)
    return url


def _get_driver():
    """
    Return an undetected Chrome driver.
    undetected_chromedriver patches Selenium so Flipkart/Amazon
    cannot detect it as a bot.
    """
    try:
        import undetected_chromedriver as uc
    except ImportError:
        raise ImportError(
            "Missing package! Run:  pip install undetected-chromedriver"
        )

    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280,900")
    # Optional: uncomment to run headless (less reliable for Flipkart)
    # options.add_argument("--headless=new")

    driver = uc.Chrome(
    options=options,
    version_main=147,
    use_subprocess=True
    )
    return driver


_JS_EXTRACT_REVIEWS = """
var SKIP = [
    "sign in", "log in", "add to cart", "buy now", "sort by",
    "filter", "helpful", "report abuse", "read more",
    "see all", "verified purchase", "certified buyer"
];

function isSkip(t) {
    var lower = t.toLowerCase();
    for (var i = 0; i < SKIP.length; i++) {
        if (lower.indexOf(SKIP[i]) !== -1) return true;
    }
    return false;
}

var results = [];
var seen = {};
var tags = document.querySelectorAll("div, p, span, li");

for (var i = 0; i < tags.length; i++) {
    var el = tags[i];
    var blockChildren = el.querySelectorAll("div, p");
    if (blockChildren.length > 2) continue;

    var text = (el.innerText || el.textContent || "").trim();
    text = text.replace(/\\s+/g, " ").trim();

    if (text.length < 40 || text.length > 2000) continue;
    if (isSkip(text)) continue;
    if (seen[text]) continue;

    var words = text.split(" ");
    var hasRealWord = words.some(function(w) { return w.length > 4; });
    if (!hasRealWord) continue;

    seen[text] = true;
    results.push(text);
}
return results;
"""


# ─────────────────────────────────────────────
#  FLIPKART
# ─────────────────────────────────────────────

def scrape_flipkart_reviews(url: str, max_pages: int = 3) -> list:
    driver = _get_driver()
    all_reviews = []

    try:
        reviews_base = _build_flipkart_review_url(url)
        reviews_base = re.sub(r"[&?]page=\d+", "", reviews_base)

        for page in range(1, max_pages + 1):
            sep = "&" if "?" in reviews_base else "?"
            page_url = f"{reviews_base}{sep}page={page}"

            print(f"  Flipkart page {page}: {page_url}")
            driver.get(page_url)

            # Wait for reviews to load
            time.sleep(random.uniform(4, 6))

            # Scroll to trigger lazy-load
            driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight * 0.6);"
            )
            time.sleep(2)

            # Try specific selectors first (faster)
            page_reviews = _extract_by_selectors_flipkart(driver)

            # Fall back to JS broad extraction if selectors yield nothing
            if not page_reviews:
                print("  Specific selectors found nothing — trying JS extractor...")
                page_reviews = _extract_by_js(driver)

            if not page_reviews:
                print(f"  No reviews on page {page}. Stopping pagination.")
                break

            print(f"  Page {page}: {len(page_reviews)} reviews found")
            all_reviews.extend(page_reviews)

            time.sleep(random.uniform(1.5, 3.0))

    finally:
        try:
            driver.quit()
        except Exception:
            pass

    return _deduplicate(all_reviews)


def _extract_by_selectors_flipkart(driver) -> list:
    """Try multiple known Flipkart review-body class patterns."""
    from selenium.webdriver.common.by import By

    # Known Flipkart review body class fragments — add new ones if Flipkart updates
    xpaths = [
        '//div[contains(@class,"ZmyHeo")]',
        '//div[contains(@class,"t-ZTKy")]',
        '//div[contains(@class,"Zmyq1t")]',
        '//div[contains(@class,"EPCmJX")]',
        '//div[contains(@class,"_6K-7Co")]',
        '//p[contains(@class,"z9E0IG")]',
        '//div[contains(@class,"row fk-row")]//div[contains(@class,"col")]//div[last()]',
    ]

    reviews = []
    for xpath in xpaths:
        try:
            elements = driver.find_elements(By.XPATH, xpath)
            for el in elements:
                text = el.text.strip()
                text = re.sub(r"\s+", " ", text)
                text = text.replace("READ MORE", "").strip()
                if 40 < len(text) < 2000:
                    reviews.append(text)
            if reviews:
                break  # Stop at first working selector
        except Exception:
            continue

    return reviews


def _extract_by_js(driver) -> list:
    """Use the class-name-independent JavaScript extractor."""
    try:
        raw = driver.execute_script(_JS_EXTRACT_REVIEWS)
        return [r for r in (raw or []) if isinstance(r, str) and len(r) > 40]
    except Exception as e:
        print(f"  JS extractor error: {e}")
        return []


def scrape_amazon_reviews(url: str, max_pages: int = 3) -> list:
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    asin_match = re.search(r"/dp/([A-Z0-9]{10})", url)
    if asin_match:
        asin = asin_match.group(1)
        base = re.match(r"(https?://[^/]+)", url).group(1)
        reviews_base = f"{base}/product-reviews/{asin}"
    elif "/product-reviews/" in url:
        reviews_base = re.sub(r"[&?]pageNumber=\d+", "", url)
    else:
        reviews_base = url

    driver = _get_driver()
    all_reviews = []

    try:
        for page in range(1, max_pages + 1):
            sep = "&" if "?" in reviews_base else "?"
            page_url = f"{reviews_base}{sep}pageNumber={page}"

            print(f"  Amazon page {page}: {page_url}")
            driver.get(page_url)

            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.XPATH, '//span[@data-hook="review-body"]')
                    )
                )
            except Exception:
                pass

            time.sleep(random.uniform(2, 4))

            elements = driver.find_elements(
                By.XPATH, '//span[@data-hook="review-body"]'
            )
            page_reviews = []
            for el in elements:
                text = el.text.strip()
                if len(text) > 20:
                    page_reviews.append(text)

            if not page_reviews:
                print(f"  No reviews on page {page}. Stopping.")
                break

            print(f"  Page {page}: {len(page_reviews)} reviews found")
            all_reviews.extend(page_reviews)
            time.sleep(random.uniform(1.5, 2.5))

    finally:
        try:
            driver.quit()
        except Exception:
            pass

    return _deduplicate(all_reviews)


# ─────────────────────────────────────────────
#  UTILS
# ─────────────────────────────────────────────

def _deduplicate(items: list) -> list:
    seen = set()
    result = []
    for x in items:
        if x not in seen:
            seen.add(x)
            result.append(x)
    return result


# ─────────────────────────────────────────────
#  PUBLIC ENTRY POINT
# ─────────────────────────────────────────────

def scrape_reviews_from_url(url: str, max_reviews: int = 30) -> list:
    """
    Pass any Flipkart or Amazon product URL.
    Returns a list of real review strings (never dummy data).
    Raises ValueError with a clear message if nothing was scraped.
    """
    url = url.strip()

    if "flipkart" in url:
        reviews = scrape_flipkart_reviews(url)
    elif "amazon" in url:
        reviews = scrape_amazon_reviews(url)
    else:
        raise ValueError(
            f"Unsupported site. Only Flipkart and Amazon are supported.\nGot: {url}"
        )

    if not reviews:
        raise ValueError(
            "No reviews found. Try these fixes:\n"
            "  1. Make sure the product page actually has reviews.\n"
            "  2. Open Flipkart manually in Chrome first (solves CAPTCHA).\n"
            "  3. Comment out the --headless line in _get_driver().\n"
            "  4. Try the direct reviews URL:\n"
            "     Change  .../p/item-id  to  .../product-reviews/item-id"
        )

    print(f"\nTotal unique reviews scraped: {len(reviews)}")
    return reviews[:max_reviews]


# ─────────────────────────────────────────────
#  QUICK TEST
# ─────────────────────────────────────────────

if __name__ == "__main__":
    test_url = input("Paste Flipkart or Amazon product URL: ").strip()
    try:
        reviews = scrape_reviews_from_url(test_url)
        for i, r in enumerate(reviews, 1):
            print(f"\n[{i}] {r[:250]}")
    except ValueError as e:
        print(f"\n{e}")
