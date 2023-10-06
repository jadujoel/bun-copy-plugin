
# Bun Copy Plugin

## Setup

```bash
bun i bun-copy-plugin
```

## Use

```typescript
import copy from 'bun-copy-plugin'

Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
  plugins: [
    copy('static/index.html', 'dist/index.html') // file 'static/index.html' -> 'dist/index.html'
    copy('static/', 'dist/static') // folder 'static' -> 'dist/static'
    copy('static/', 'dist') // contents of 'static' -> 'dist/*'
  ],
})
```
