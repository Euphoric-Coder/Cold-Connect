import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()  # take environment variables

# Load GitHub Token
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    raise ValueError("⚠️ Please set your GITHUB_TOKEN as an environment variable.")

HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}
BASE_URL = "https://api.github.com"

def list_repositories_with_readme(github_url):
    """List all public and private repositories of a GitHub user/org with README.md content."""

    username = github_url.rstrip("/").split("/")[-1]

    # Step 1: Fetch repos (public + private)
    repos_url = f"{BASE_URL}/user/repos" if username == get_authenticated_user() else f"{BASE_URL}/users/{username}/repos"
    response = requests.get(repos_url, headers=HEADERS)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch repositories: {response.json()}")

    repos = response.json()
    projects = []

    for repo in repos:
        repo_name = repo["name"]
        repo_desc = repo["description"]
        repo_url = repo["html_url"]

        # Step 2: Try fetching README
        readme_url = f"{BASE_URL}/repos/{repo['owner']['login']}/{repo_name}/readme"
        readme_response = requests.get(readme_url, headers=HEADERS)

        if readme_response.status_code == 200:
            try:
                readme_data = readme_response.json()
                readme_content = base64.b64decode(readme_data["content"]).decode("utf-8")
            except Exception:
                readme_content = "⚠️ Failed to decode README content"
        else:
            readme_content = "❌ No README.md found"

        projects.append({
            "name": repo_name,
            "description": repo_desc,
            "url": repo_url,
            "private": repo["private"],
            "readme": readme_content[:500] + ("..." if len(readme_content) > 500 else "")
        })

    return projects


def get_authenticated_user():
    """Get the username of the authenticated token owner."""
    user_url = f"{BASE_URL}/user"
    user_response = requests.get(user_url, headers=HEADERS)
    if user_response.status_code != 200:
        raise Exception("Failed to fetch authenticated user info")
    return user_response.json()["login"]


# Example usage
if __name__ == "__main__":
    github_url = "https://github.com/piyush-eon"  # Replace with your GitHub profile
    repos = list_repositories_with_readme(github_url)

    print(f"\n🔹 All Repositories (Public + Private) for {github_url}:\n")
    for repo in repos:
        visibility = "🔒 Private" if repo["private"] else "🌍 Public"
        print(f"Repo: {repo['name']} ({visibility})")
        print(f"Description: {repo['description']}")
        print(f"URL: {repo['url']}")
        print(f"README Preview:\n{repo['readme']}\n{'-'*60}\n")
