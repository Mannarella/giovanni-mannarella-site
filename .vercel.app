{
  "buildCommand": "pnpm install && pnpm run build",
  "outputDirectory": "dist/public",
  "installCommand": "pnpm install",
  "framework": "vite",
  "routes": [
    {
      "src": "^.+$",
      "dest": "/index.html"
    }
  ]
}
