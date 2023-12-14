import * as esbuild from 'esbuild-wasm';
import { resolvePlugin } from './plugins/resolve-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const bundle = async (rawCode: string) => {
  // use unpkg plugin to bundle, entry point is index.js

  try {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [resolvePlugin(), fetchPlugin(rawCode)],
      define: { 'process.env.NODE_ENV': "'production'", global: 'window' },
    });
    return {
      code: result.outputFiles[0].text,
      err: '',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        code: '',
        err: err.message,
      };
    } else {
      throw err;
    }
  }
};

export default bundle;
