/**
 * Fetch GitHub repository stars at build time
 * This runs during the build process to avoid API rate limits
 */

interface GitHubRepo {
  owner: string;
  repo: string;
}

interface GitHubResponse {
  stargazers_count: number;
}

export async function getGitHubStars(githubUrl: string): Promise<number> {
  try {
    // Parse GitHub URL
    const url = new URL(githubUrl);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length < 2) {
      return 0;
    }

    const owner = parts[0];
    const repo = parts[1];

    // Fetch from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch stars for ${owner}/${repo}: ${response.statusText}`);
      return 0;
    }

    const data: GitHubResponse = await response.json();
    return data.stargazers_count || 0;
  } catch (error) {
    console.error(`Error fetching GitHub stars for ${githubUrl}:`, error);
    return 0;
  }
}

export async function getAllProjectStars(projects: Array<{ data: { github?: string } }>) {
  const starsPromises = projects.map(async (project) => {
    if (!project.data.github) {
      return { ...project, stars: 0 };
    }

    const stars = await getGitHubStars(project.data.github);
    return { ...project, stars };
  });

  return await Promise.all(starsPromises);
}
