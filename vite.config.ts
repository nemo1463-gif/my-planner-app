import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    // 로컬 개발 중 /api 또는 /auth/google 요청을 
    // 백엔드 서버(localhost:8080)로 전달하는 프록시 설정
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth/google': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      // ES 모듈 환경에서 'path'를 사용하기 위한 설정
      'path': 'path-browserify',
    }
  }
})
