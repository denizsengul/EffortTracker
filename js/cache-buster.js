// Cache Busting Utility
(function() {
    // Prevent multiple executions
    if (window.cacheBusterLoaded) return;
    window.cacheBusterLoaded = true;
    
    // Generate a random version string
    const version = Math.floor(Math.random() * 1000000) + Date.now();
    
    // Function to add version parameter to CSS files only
    function addVersionToResources() {
        // Update CSS files only
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href*=".css"]');
        cssLinks.forEach(link => {
            if (!link.href.includes('cdnjs.cloudflare.com') && !link.href.includes('?v=')) { // Skip CDN files and already processed files
                const url = new URL(link.href);
                url.searchParams.set('v', version);
                link.href = url.toString();
            }
        });
    }
    
    // Run when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addVersionToResources);
    } else {
        addVersionToResources();
    }
})();