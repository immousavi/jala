import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Uncommon port on purpose: the detector probes it to hint about a
    // running dev server, and a common port (8080) is often occupied on dev
    // machines, which would make the oracle golden environment-dependent.
    port: 48080,
  },
});
