import os
import base64
import requests
import json
from dotenv import load_dotenv

load_dotenv()

# CONFIG
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    raise ValueError("Please set your GITHUB_TOKEN in the .env file")

BASE_URL = "https://api.github.com"
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}


def get_authenticated_user() -> str:
    """Return the username of the authenticated user (for private repos)."""
    resp = requests.get(f"{BASE_URL}/user", headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["login"]


def fetch_readme(full_name: str) -> str:
    """Fetch README.md content for a repo."""
    url = f"{BASE_URL}/repos/{full_name}/readme"
    resp = requests.get(url, headers=HEADERS)
    if resp.status_code != 200:
        return ""
    try:
        data = resp.json()
        return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    except Exception:
        return ""


def list_repositories(github_url: str):
    """
    Fetch both public and private repositories (if token allows),
    returning minimal info for each: name, url, description, readme.
    """
    username = github_url.rstrip("/").split("/")[-1]
    auth_user = get_authenticated_user()

    # Include private repos if user == authenticated
    if username.lower() == auth_user.lower():
        repos_url = f"{BASE_URL}/user/repos"
    else:
        repos_url = f"{BASE_URL}/users/{username}/repos"

    # Fetch up to 100 repos, public + private if allowed
    response = requests.get(
        repos_url, headers=HEADERS, params={"per_page": 100, "sort": "updated"}
    )
    response.raise_for_status()

    repos = response.json()
    projects = []

    for repo in repos:
        full_name = repo["full_name"]
        name = repo["name"]
        url = repo["html_url"]
        desc = repo.get("description") or ""
        readme = fetch_readme(full_name)

        projects.append(
            {"name": name, "url": url, "description": desc, "readme": readme}
        )

    return projects


if __name__ == "__main__":
    github_url = "https://github.com/piyush-eon"  # Change this to your GitHub profile
    projects = list_repositories(github_url)

    print(json.dumps(projects, indent=2, ensure_ascii=False))
