/**
 * PMERIT AI PLATFORM: ROUTER.JS
 * Handles hash-based navigation for sections
 */

const Router = {
  routes: {},
  
  addRoute: function(path, callback) {
    this.routes[path] = callback;
  },
  
  navigate: function(path) {
    window.location.hash = path;
    this.check();
  },
  
  check: function() {
    const path = window.location.hash.substring(1) || '/';
    
    if (this.routes[path]) {
      this.routes[path]();
    } else {
      // Default route
      console.log('Route not found:', path);
    }
  },
  
  init: function() {
    window.addEventListener('hashchange', () => this.check());
    this.check();
  }
};

// Initialize router
document.addEventListener('DOMContentLoaded', function() {
  Router.init();
  
  // Example routes
  Router.addRoute('/about', function() {
    console.log('Navigated to About page');
    // You would show/hide content sections here
  });
  
  Router.addRoute('/assessment', function() {
    console.log('Navigated to Assessment page');
    // You would show/hide content sections here
  });
});
