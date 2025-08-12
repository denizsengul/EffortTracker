// Cache Busting Utility
(function() {
    // Generate a random version string
    const version = Math.floor(Math.random() * 1000000) + Date.now();
    
    // Function to add version parameter to CSS and JS files
    function addVersionToResources() {
        // Update CSS files
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href*=".css"]');
        cssLinks.forEach(link => {
            if (!link.href.includes('cdnjs.cloudflare.com')) { // Skip CDN files
                const url = new URL(link.href);
                url.searchParams.set('v', version);
                link.href = url.toString();
            }
        });
        
        // Update JS files
        const scriptTags = document.querySelectorAll('script[src*=".js"]');
        scriptTags.forEach(script => {
            if (!script.src.includes('cdn.jsdelivr.net') && !script.src.includes('cdnjs.cloudflare.com')) { // Skip CDN files
                const url = new URL(script.src, window.location.href);
                url.searchParams.set('v', version);
                
                // Create new script element
                const newScript = document.createElement('script');
                newScript.src = url.toString();
                newScript.async = script.async;
                newScript.defer = script.defer;
                
                // Copy attributes
                Array.from(script.attributes).forEach(attr => {
                    if (attr.name !== 'src') {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });
                
                // Replace old script
                script.parentNode.insertBefore(newScript, script.nextSibling);
                script.remove();
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