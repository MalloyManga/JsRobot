import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 开启 Nuxt 4 目录结构
  future: {
    compatibilityVersion: 4,
  },

  css: ['./app/assets/css/main.css'],
  ssr: false,

  // 关键配置
  app: {
    baseURL: '/JsRobot/', // 必须和仓库名一致，注意前后斜杠
    buildAssetsDir: '/_nuxt/',
  },

  // 显式指定 GitHub Pages 预设
  nitro: {
    preset: 'github-pages'
  },

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})
