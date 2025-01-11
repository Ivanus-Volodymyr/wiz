import { defineConfig } from 'cypress';
require('dotenv').config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        ...process.env,
      };
      return config;
    },
  },
});
