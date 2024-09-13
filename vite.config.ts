import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "https://teinlb.github.io/Dispositum/",
    build: {
        outDir: "dist", // Zorg ervoor dat de output naar de `dist` map gaat
    },
});
