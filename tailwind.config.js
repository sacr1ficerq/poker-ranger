module.exports = {
  content: [
    "./src/templates/**/*.html",  // Scan all Flask templates
    "./src/static/**/*.js"        // Scan any JS files
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          green: '#0a6847',   // Custom poker felt color
          gold: '#f59e0b'     // Poker chip gold
        }
      }
    }
  },
  plugins: [],
}