import os
import base64
import requests
import json
from dotenv import load_dotenv

load_dotenv()

# --- CONFIG ---
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    raise ValueError("⚠️ Please set your GITHUB_TOKEN in the .env file")

BASE_URL = "https://api.github.com"
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}


def fetch_readme(repo_full_name: str) -> str:
    """Fetch and decode README.md content for a repo."""
    url = f"{BASE_URL}/repos/{repo_full_name}/readme"
    resp = requests.get(url, headers=HEADERS)
    if resp.status_code != 200:
        return ""
    try:
        data = resp.json()
        return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    except Exception:
        return ""


def list_repositories(github_url: str):
    """Return list of repos with name, url, description, readme."""
    username = github_url.rstrip("/").split("/")[-1]

    # Fetch public repositories only — fast and simple
    repos_url = f"{BASE_URL}/users/{username}/repos"
    response = requests.get(repos_url, headers=HEADERS, params={"per_page": 100})
    response.raise_for_status()

    repos = response.json()
    projects = []

    for repo in repos:
        repo_full_name = repo["full_name"]
        name = repo["name"]
        url = repo["html_url"]
        desc = repo.get("description") or ""
        readme = fetch_readme(repo_full_name)

        projects.append(
            {"name": name, "url": url, "description": desc, "readme": readme}
        )

    return projects


if __name__ == "__main__":
    github_url = "https://github.com/piyush-eon"  # Change this to your profile
    projects = list_repositories(github_url)

    print(json.dumps(projects, indent=2, ensure_ascii=False))

    # with open("projects_min.json", "w", encoding="utf-8") as f:
    #     json.dump(projects, f, indent=2, ensure_ascii=False)

    # print("✅ Saved → projects_min.json")
