// ==============================================
// ENHANCED CACHE MANAGEMENT
// ==============================================

const GITHUB_CACHE = {
    list: new Map(),
    json: new Map(),
    lastCleared: Date.now(),
    maxAge: 10 * 60 * 1000 // 10 minutes
};

function clearExpiredCache() {
    const now = Date.now();
    if (now - GITHUB_CACHE.lastCleared > GITHUB_CACHE.maxAge) {
        GITHUB_CACHE.list.clear();
        GITHUB_CACHE.json.clear();
        GITHUB_CACHE.lastCleared = now;
    }
}

function clearGitHubCache() {
    GITHUB_CACHE.list.clear();
    GITHUB_CACHE.json.clear();
    GITHUB_CACHE.lastCleared = Date.now();
}

// ==============================================
// GITHUB API FUNCTIONS (OPTIMIZED WITH RETRY)
// ==============================================

function getGitHubApiUrl(path) {
    return `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodeURIComponent(path)}?ref=${GITHUB_CONFIG.branch}`;
}

function getRawFileUrl(path) {
    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${encodeURIComponent(path)}`;
}

async function fetchWithRetry(url, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            if (i === retries) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

async function listFilesFromGitHub(folderPath) {
    clearExpiredCache();
    
    if (GITHUB_CACHE.list.has(folderPath)) {
        return GITHUB_CACHE.list.get(folderPath);
    }
    
    try {
        const response = await fetchWithRetry(getGitHubApiUrl(folderPath));
        const data = await response.json();
        const files = Array.isArray(data) ? data : [data];
        
        const result = files
            .filter(item => item.type === 'file')
            .map(file => ({
                name: file.name,
                path: file.path,
                size: file.size,
                download_url: file.download_url,
                html_url: file.html_url,
                type: file.type
            }));
        
        GITHUB_CACHE.list.set(folderPath, result);
        return result;
        
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        GITHUB_CACHE.list.set(folderPath, []);
        return [];
    }
}

async function getJsonFileFromGitHub(filePath) {
    clearExpiredCache();
    
    if (GITHUB_CACHE.json.has(filePath)) {
        return GITHUB_CACHE.json.get(filePath);
    }
    
    try {
        const response = await fetchWithRetry(getRawFileUrl(filePath));
        const data = await response.json();
        GITHUB_CACHE.json.set(filePath, data);
        return data;
        
    } catch (error) {
        console.error('Error fetching JSON file:', error);
        GITHUB_CACHE.json.set(filePath, null);
        return null;
    }
}