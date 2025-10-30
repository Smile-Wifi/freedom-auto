// GitHub Integration Module
class GitHubIntegration {
    constructor() {
        this.owner = 'your-github-username'; // Replace with your GitHub username
        this.repo = 'your-repo-name'; // Replace with your repository name
        this.token = 'your-github-token'; // Replace with your GitHub personal access token
        this.branch = 'main'; // or 'master' depending on your default branch
    }

    async saveConfiguration(config) {
        try {
            const path = 'video-config.json';
            const content = btoa(JSON.stringify(config, null, 2)); // Base64 encode
            
            // Get current file SHA if it exists
            const currentFile = await this.getFile(path);
            const sha = currentFile ? currentFile.sha : null;

            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: `Update video configuration - ${new Date().toISOString()}`,
                        content: content,
                        branch: this.branch,
                        sha: sha
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            throw error;
        }
    }

    async getFile(path) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
                {
                    headers: {
                        'Authorization': `token ${this.token}`,
                    }
                }
            );

            if (response.status === 404) {
                return null; // File doesn't exist
            }

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting file from GitHub:', error);
            throw error;
        }
    }

    async loadConfiguration() {
        try {
            const file = await this.getFile('video-config.json');
            if (file) {
                const content = atob(file.content); // Base64 decode
                return JSON.parse(content);
            }
            return null;
        } catch (error) {
            console.error('Error loading from GitHub:', error);
            throw error;
        }
    }
}

// Usage in your main script
const github = new GitHubIntegration();

// Replace the handleSaveToGitHub function with this:
async function handleSaveToGitHub() {
    showStatus('Saving to GitHub...', 'success');
    
    try {
        const config = {
            videoUrl: currentVideoUrl,
            videoTitle: currentVideoTitle,
            lastUpdated: new Date().toISOString()
        };
        
        await github.saveConfiguration(config);
        showStatus('Configuration saved to GitHub successfully!', 'success');
    } catch (error) {
        showStatus('Error saving to GitHub: ' + error.message, 'error');
    }
}