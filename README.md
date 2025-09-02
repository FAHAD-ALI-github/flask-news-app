# 📌 News Aggregator App

A dynamic web application that aggregates and displays news headlines from the NewsAPI, allowing users to filter by category, language, and country, or search for specific keywords. The project features a clean, responsive user interface and a robust backend API built with Flask.

-----

## ✨ Features

  - **Real-time News Feed**: Fetches the latest articles from a public news API.
  - **Advanced Filtering**: Filter news articles by predefined categories (e.g., business, technology, sports), language, and country.
  - **Keyword Search**: Search for articles using specific keywords.
  - **Responsive UI**: A clean, modern interface that works well on both desktop and mobile devices.
  - **Dark Mode**: Toggle between light and dark themes for better readability.
  - **Dynamic Content Loading**: Articles are loaded asynchronously, and the UI provides a skeleton loading state for a smooth user experience.

-----

## 🛠️ Tech Stack

  - **Backend**:
      - Python
      - Flask
      - `requests`
      - `python-dotenv`
  - **Frontend**:
      - HTML5
      - CSS3
      - JavaScript (ES6+)
  - **API**:
      - NewsAPI

-----

## 📁 Folder Structure

```
.
├── app.py
├── .env   # you have to create it after cloning the repo
├── static/
│   ├── app.js
│   ├── styles.css
│   └── theme-toggle.js
└── templates/
    └── index.html
```

-----

## 🚀 How to Run

### Prerequisites

You need a **NewsAPI key** to run this application. You can get one for free from the [NewsAPI website](https://newsapi.org/).

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/FAHAD-ALI-github/flask-news-app.git
    ```

2.  **Navigate into the project directory:**

    ```bash
    cd flask-news-app
    ```

3.  **Create a `.env` file:**

    Create a file named `.env` in the root directory and add your NewsAPI key:

    ```
    NEWSAPI_KEY="YOUR_API_KEY_HERE"
    ```

4.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```


5.  **Run the application:**

    ```bash
    python app.py
    ```

The application will be accessible at `http://127.0.0.1:5000`.

-----

## 🌐 Live Demo

[🔗 Live Site](https://fahadali1.pythonanywhere.com/)

-----

## 👤 Author

**Fahad Ali**

  - GitHub: [@FAHAD-ALI-github](https://github.com/FAHAD-ALI-github)
  - LinkedIn: [fahadali1078](https://www.linkedin.com/in/fahadali1078/)
