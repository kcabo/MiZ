const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['./src/index.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  platform: 'node',
  logLevel: 'info',
  target: 'node14',
});
