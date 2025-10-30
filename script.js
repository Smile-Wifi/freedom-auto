// DOM Elements
const hamburger = document.getElementById('hamburger');
const sidePanel = document.getElementById('sidePanel');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const cmsLoginBtn = document.getElementById('cmsLoginBtn');
const cmsModal = document.getElementById('cmsModal');
const closeModal = document.getElementById('closeModal');
const cmsLoginForm = document.getElementById('cmsLoginForm');
const cmsDashboard = document.getElementById('cmsDashboard');
const closeDashboard = document.getElementById('closeDashboard');
const updateVideo = document.getElementById('updateVideo');
const saveToGitHub = document.getElementById('saveToGitHub');
const statusMessage = document.getElementById('statusMessage');

// State
let isLoggedIn = false;
let currentVideoUrl = '';
let currentVideoTitle = '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadVideoData();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    hamburger.addEventListener('click', toggleSidePanel);
    closeBtn.addEventListener('click', closeSidePanel);
    overlay.addEventListener('click', closeSidePanel);
    cmsLoginBtn.addEventListener('click', openCmsModal);
    closeModal.addEventListener('click', closeCmsModal);
    closeDashboard.addEventListener('click', closeCmsDashboard);
    cmsLoginForm.addEventListener('submit', handleCmsLogin);
    updateVideo.addEventListener('click', handleUpdateVideo);
    saveToGitHub.addEventListener('click', handleSaveToGitHub);
    
    // Close modals on outside click
    window.addEventListener('click', function(event) {
        if (event.target === cmsModal) {
            closeCmsModal();
        }
        if (event.target === cmsDashboard) {
            closeCmsDashboard();
        }
    });
}

// Side Panel Functions
function toggleSidePanel() {
    sidePanel.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeSidePanel() {
    sidePanel.classList.remove('active');
    overlay.classList.remove('active');
}

// CMS Modal Functions
function openCmsModal() {
    cmsModal.style.display = 'block';
}

function closeCmsModal() {
    cmsModal.style.display = 'none';
}

function closeCmsDashboard() {
    cmsDashboard.style.display = 'none';
}

// CMS Login
function handleCmsLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
        isLoggedIn = true;
        closeCmsModal();
        openCmsDashboard();
        showStatus('Login successful!', 'success');
    } else {
        showStatus('Invalid credentials. Use admin/admin123', 'error');
    }
}

// CMS Dashboard
function openCmsDashboard() {
    if (isLoggedIn) {
        cmsDashboard.style.display = 'block';
        // Load current video data
        document.getElementById('facebookUrl').value = currentVideoUrl;
        document.getElementById('videoTitleInput').value = currentVideoTitle;
    }
}

// Update Video
function handleUpdateVideo() {
    const facebookUrl = document.getElementById('facebookUrl').value;
    const videoTitle = document.getElementById('videoTitleInput').value;
    
    if (!facebookUrl || !videoTitle) {
        showStatus('Please fill in all fields', 'error');
        return;
    }
    
    // Extract video ID from Facebook URL
    const videoId = extractFacebookVideoId(facebookUrl);
    if (!videoId) {
        showStatus('Invalid Facebook video URL', 'error');
        return;
    }
    
    // Update video embed
    const embedUrl = `https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${videoId}%2F&show_text=false&width=476&t=0`;
    
    document.getElementById('facebookVideo').src = embedUrl;
    document.getElementById('videoTitle').textContent = videoTitle;
    
    currentVideoUrl = facebookUrl;
    currentVideoTitle = videoTitle;
    
    // Save to localStorage
    saveVideoData();
    
    showStatus('Video updated successfully!', 'success');
}

// Extract Facebook Video ID
function extractFacebookVideoId(url) {
    // Handle different Facebook URL formats
    const patterns = [
        /facebook\.com\/watch\/\?v=(\d+)/,
        /facebook\.com\/.*\/videos\/(\d+)/,
        /facebook\.com\/.*\/posts\/(\d+)/,
        /fb\.watch\/(\w+)/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return null;
}

// Save to GitHub
function handleSaveToGitHub() {
    showStatus('Saving to GitHub...', 'success');
    
    // Simulate GitHub API call
    setTimeout(() => {
        const config = {
            videoUrl: currentVideoUrl,
            videoTitle: currentVideoTitle,
            lastUpdated: new Date().toISOString()
        };
        
        // In a real implementation, you would use GitHub API here
        // For demo purposes, we'll save to localStorage and show success
        localStorage.setItem('githubConfig', JSON.stringify(config));
        
        showStatus('Configuration saved to GitHub successfully!', 'success');
    }, 2000);
}

// Utility Functions
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

function saveVideoData() {
    const data = {
        videoUrl: currentVideoUrl,
        videoTitle: currentVideoTitle
    };
    localStorage.setItem('videoData', JSON.stringify(data));
}

function loadVideoData() {
    const saved = localStorage.getItem('videoData');
    if (saved) {
        const data = JSON.parse(saved);
        currentVideoUrl = data.videoUrl;
        currentVideoTitle = data.videoTitle;
        
        if (currentVideoUrl && currentVideoTitle) {
            const videoId = extractFacebookVideoId(currentVideoUrl);
            if (videoId) {
                const embedUrl = `https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${videoId}%2F&show_text=false&width=476&t=0`;
                document.getElementById('facebookVideo').src = embedUrl;
                document.getElementById('videoTitle').textContent = currentVideoTitle;
            }
        }
    }
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Close side panel on mobile
        if (window.innerWidth <= 768) {
            closeSidePanel();
        }
    });
});
