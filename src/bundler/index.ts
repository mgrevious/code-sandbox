import * as esbuild from 'esbuild-wasm';
import { resolvePlugin } from '../plugins/resolve-plugin';
import { fetchPlugin } from '../plugins/fetch-plugin';

export default async (rawCode: string) => {
  // // if esbuild doesn't exist, initialize service
  // if (!esbuild) {
  //   const startService = async () => {
  //     await esbuild.initialize({
  //       worker: true,
  //       wasmURL: 'https://unpkg.com/esbuild-wasm@0.19.8/esbuild.wasm',
  //     });
  //   };

  //   startService();
  // }

  // use unpkg plugin to bundle, entry point is index.js
  const result = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [resolvePlugin(), fetchPlugin(rawCode)],
    define: { 'process.env.NODE_ENV': "'production'", global: 'window' },
  });

  return result.outputFiles[0].text;
};
