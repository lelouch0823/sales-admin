// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///D:/Code/sales-admin/node_modules/.pnpm/vite@6.4.1_@types+node@22.1_eb541a21aa2bb12e92d7bc4a8e436b99/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Code/sales-admin/node_modules/.pnpm/@vitejs+plugin-react@5.1.2__4096f68877d31450740c620dfa6eea35/node_modules/@vitejs/plugin-react/dist/index.js";
import compression from "file:///D:/Code/sales-admin/node_modules/.pnpm/vite-plugin-compression@0.5_986f45ebad45f10d21cb991f6eb1215b/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Code\\sales-admin";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3e3,
      host: "0.0.0.0"
    },
    plugins: [
      react(),
      // Gzip 压缩
      compression({
        algorithm: "gzip",
        ext: ".gz",
        threshold: 10240
        // 10KB 以上才压缩
      })
    ],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "."),
        "@hooks": path.resolve(__vite_injected_original_dirname, "./hooks"),
        "@constants": path.resolve(__vite_injected_original_dirname, "./constants"),
        "@styles": path.resolve(__vite_injected_original_dirname, "./styles"),
        "@router": path.resolve(__vite_injected_original_dirname, "./router"),
        "@components": path.resolve(__vite_injected_original_dirname, "./components"),
        "@modules": path.resolve(__vite_injected_original_dirname, "./modules"),
        "@lib": path.resolve(__vite_injected_original_dirname, "./lib"),
        "@types": path.resolve(__vite_injected_original_dirname, "./types"),
        "@utils": path.resolve(__vite_injected_original_dirname, "./utils")
      }
    },
    // 构建优化配置
    build: {
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: {
            // React 核心
            "vendor-react": ["react", "react-dom"],
            // 图表库 (recharts 较大)
            "vendor-charts": ["recharts"],
            // 动画库
            "vendor-motion": ["framer-motion"],
            // Excel 处理库
            "vendor-xlsx": ["xlsx"],
            // UI 组件库
            "vendor-radix": [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-popover",
              "@radix-ui/react-tooltip"
            ],
            // 表单相关
            "vendor-form": ["react-hook-form", "@hookform/resolvers", "zod"],
            // 国际化
            "vendor-i18n": ["i18next", "react-i18next"],
            // 数据获取
            "vendor-query": ["@tanstack/react-query", "@tanstack/react-table"],
            // 图标库
            "vendor-icons": ["lucide-react"]
          }
        }
      },
      // 提高 chunk 警告阈值
      chunkSizeWarningLimit: 400
    },
    // Vitest 配置
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./tests/setup.ts"],
      include: ["tests/**/*.{test,spec}.{js,ts,tsx}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/", "tests/", "**/*.d.ts"]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RlXFxcXHNhbGVzLWFkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxDb2RlXFxcXHNhbGVzLWFkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Db2RlL3NhbGVzLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgJy4nLCAnJyk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiAzMDAwLFxyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICByZWFjdCgpLFxyXG4gICAgICAvLyBHemlwIFx1NTM4Qlx1N0YyOVxyXG4gICAgICBjb21wcmVzc2lvbih7XHJcbiAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXHJcbiAgICAgICAgZXh0OiAnLmd6JyxcclxuICAgICAgICB0aHJlc2hvbGQ6IDEwMjQwLCAvLyAxMEtCIFx1NEVFNVx1NEUwQVx1NjI0RFx1NTM4Qlx1N0YyOVxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgJ3Byb2Nlc3MuZW52LkFQSV9LRVknOiBKU09OLnN0cmluZ2lmeShlbnYuR0VNSU5JX0FQSV9LRVkpLFxyXG4gICAgICAncHJvY2Vzcy5lbnYuR0VNSU5JX0FQSV9LRVknOiBKU09OLnN0cmluZ2lmeShlbnYuR0VNSU5JX0FQSV9LRVkpLFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuJyksXHJcbiAgICAgICAgJ0Bob29rcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2hvb2tzJyksXHJcbiAgICAgICAgJ0Bjb25zdGFudHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9jb25zdGFudHMnKSxcclxuICAgICAgICAnQHN0eWxlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3N0eWxlcycpLFxyXG4gICAgICAgICdAcm91dGVyJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcm91dGVyJyksXHJcbiAgICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vY29tcG9uZW50cycpLFxyXG4gICAgICAgICdAbW9kdWxlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL21vZHVsZXMnKSxcclxuICAgICAgICAnQGxpYic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2xpYicpLFxyXG4gICAgICAgICdAdHlwZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi90eXBlcycpLFxyXG4gICAgICAgICdAdXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi91dGlscycpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIC8vIFx1Njc4NFx1NUVGQVx1NEYxOFx1NTMxNlx1OTE0RFx1N0Y2RVxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgIC8vIFJlYWN0IFx1NjgzOFx1NUZDM1xyXG4gICAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgICAgLy8gXHU1NkZFXHU4ODY4XHU1RTkzIChyZWNoYXJ0cyBcdThGODNcdTU5MjcpXHJcbiAgICAgICAgICAgICd2ZW5kb3ItY2hhcnRzJzogWydyZWNoYXJ0cyddLFxyXG4gICAgICAgICAgICAvLyBcdTUyQThcdTc1M0JcdTVFOTNcclxuICAgICAgICAgICAgJ3ZlbmRvci1tb3Rpb24nOiBbJ2ZyYW1lci1tb3Rpb24nXSxcclxuICAgICAgICAgICAgLy8gRXhjZWwgXHU1OTA0XHU3NDA2XHU1RTkzXHJcbiAgICAgICAgICAgICd2ZW5kb3IteGxzeCc6IFsneGxzeCddLFxyXG4gICAgICAgICAgICAvLyBVSSBcdTdFQzRcdTRFRjZcdTVFOTNcclxuICAgICAgICAgICAgJ3ZlbmRvci1yYWRpeCc6IFtcclxuICAgICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsXHJcbiAgICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JyxcclxuICAgICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXBvcG92ZXInLFxyXG4gICAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCcsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIFx1ODg2OFx1NTM1NVx1NzZGOFx1NTE3M1xyXG4gICAgICAgICAgICAndmVuZG9yLWZvcm0nOiBbJ3JlYWN0LWhvb2stZm9ybScsICdAaG9va2Zvcm0vcmVzb2x2ZXJzJywgJ3pvZCddLFxyXG4gICAgICAgICAgICAvLyBcdTU2RkRcdTk2NDVcdTUzMTZcclxuICAgICAgICAgICAgJ3ZlbmRvci1pMThuJzogWydpMThuZXh0JywgJ3JlYWN0LWkxOG5leHQnXSxcclxuICAgICAgICAgICAgLy8gXHU2NTcwXHU2MzZFXHU4M0I3XHU1M0Q2XHJcbiAgICAgICAgICAgICd2ZW5kb3ItcXVlcnknOiBbJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsICdAdGFuc3RhY2svcmVhY3QtdGFibGUnXSxcclxuICAgICAgICAgICAgLy8gXHU1NkZFXHU2ODA3XHU1RTkzXHJcbiAgICAgICAgICAgICd2ZW5kb3ItaWNvbnMnOiBbJ2x1Y2lkZS1yZWFjdCddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBcdTYzRDBcdTlBRDggY2h1bmsgXHU4QjY2XHU1NDRBXHU5NjA4XHU1MDNDXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNDAwLFxyXG4gICAgfSxcclxuICAgIC8vIFZpdGVzdCBcdTkxNERcdTdGNkVcclxuICAgIHRlc3Q6IHtcclxuICAgICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgICAgIHNldHVwRmlsZXM6IFsnLi90ZXN0cy9zZXR1cC50cyddLFxyXG4gICAgICBpbmNsdWRlOiBbJ3Rlc3RzLyoqLyoue3Rlc3Qsc3BlY30ue2pzLHRzLHRzeH0nXSxcclxuICAgICAgY292ZXJhZ2U6IHtcclxuICAgICAgICBwcm92aWRlcjogJ3Y4JyxcclxuICAgICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCddLFxyXG4gICAgICAgIGV4Y2x1ZGU6IFsnbm9kZV9tb2R1bGVzLycsICd0ZXN0cy8nLCAnKiovKi5kLnRzJ10sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlQLE9BQU8sVUFBVTtBQUNsUSxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7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
