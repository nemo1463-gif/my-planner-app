"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    // This is the key change to fix the 404 error on GCS.
    // It tells Vite to use relative paths for assets.
    base: './',
    build: {
        outDir: 'dist'
    }
});
