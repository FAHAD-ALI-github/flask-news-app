import os
import requests
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")
NEWSAPI_BASE = "https://newsapi.org/v2"
MAX_PAGE_SIZE = 100

# Fixed categories (NewsAPI supported ones)
VALID_CATEGORIES = {
    "business", "entertainment", "general", "health", "science", "sports", "technology"
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/metadata")
def metadata():
    """Fetch supported languages & countries from /top-headlines/sources"""
    if not NEWSAPI_KEY:
        return jsonify({"status": "error", "message": "Missing API key"}), 500
    try:
        resp = requests.get(
            f"{NEWSAPI_BASE}/top-headlines/sources",
            headers={"X-Api-Key": NEWSAPI_KEY},
            timeout=10
        )
        data = resp.json()
        if resp.status_code != 200 or data.get("status") != "ok":
            return jsonify({"status":"error","message":data.get("message","Failed to fetch sources")}), resp.status_code

        langs, countries = set(), set()
        for src in data.get("sources", []):
            if src.get("language"):
                langs.add(src["language"])
            if src.get("country"):
                countries.add(src["country"])

        return jsonify({
            "status": "ok",
            "languages": sorted(langs),
            "countries": sorted(countries),
            "categories": sorted(list(VALID_CATEGORIES))
        })
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}), 500

@app.route("/api/news")
def api_news():
    """
    Query params:
      - category
      - language
      - country
      - q (search term)
    """
    if not NEWSAPI_KEY:
        return jsonify({"status": "error", "message": "Missing API key"}), 500

    category = request.args.get("category", "all").lower()
    language = request.args.get("language", "all").lower()
    country = request.args.get("country", "all").lower()
    q = (request.args.get("q") or "").strip()

    try:
        headers = {"X-Api-Key": NEWSAPI_KEY}
        params = {"pageSize": MAX_PAGE_SIZE, "page": 1}

        # Decide endpoint
        if country != "all":
            endpoint = f"{NEWSAPI_BASE}/top-headlines"
            params["country"] = country
            if category != "all" and category in VALID_CATEGORIES:
                params["category"] = category
            if q:
                params["q"] = q
        else:
            endpoint = f"{NEWSAPI_BASE}/everything"
            if language != "all":
                params["language"] = language
            keywords = []
            if q:
                keywords.append(q)
            if category != "all" and category in VALID_CATEGORIES:
                keywords.append(category)
            params["q"] = " OR ".join(keywords) if keywords else "news"
            params["sortBy"] = "publishedAt"

        r = requests.get(endpoint, headers=headers, params=params, timeout=15)
        data = r.json()

        if r.status_code != 200 or data.get("status") != "ok":
            return jsonify({
                "status": "error",
                "message": data.get("message", "Failed to fetch news")
            }), r.status_code

        articles = data.get("articles", [])[:MAX_PAGE_SIZE]
        safe_articles = []
        for a in articles:
            safe_articles.append({
                "title": a.get("title") or "Untitled",
                "description": a.get("description") or "",
                "url": a.get("url"),
                "urlToImage": a.get("urlToImage"),
                "source": (a.get("source") or {}).get("name"),
                "publishedAt": a.get("publishedAt"),
                "author": a.get("author")
            })

        return jsonify({
            "status": "ok",
            "articles": safe_articles,
            "totalResults": data.get("totalResults", len(safe_articles))
        })
    except requests.Timeout:
        return jsonify({"status": "error", "message": "Request timed out"}), 504
    except Exception as e:
        return jsonify({"status": "error", "message": f"Server error: {e}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
