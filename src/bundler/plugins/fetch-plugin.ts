import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';

const fileCache = localForage.createInstance({ name: 'fileCache' });

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // if esbuild is attempting to load index.js file, lets intercept it and return the code to bundle.
      build.onLoad({ filter: /(^index\.js$)/ }, () => ({
        loader: 'jsx',
        contents: inputCode,
      }));

      // esbuild will continue to the other onLoad functions if cachedResult is false
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path,
        );

        // if it is, return immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      // Load CSS files
      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        // otherwise call the unpkg API
        const cssPkg = await axios.get(args.path);
        const data = cssPkg.data as string;
        const request = cssPkg.request as { responseURL: string };
        const escapedCss = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        // take contents from an imported css file and append it to the head tag
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escapedCss}';
          document.head.appendChild(style);
        `;

        // store response in the cache
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });

      // Load JavaScript files
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // otherwise call the unpkg API
        const pkg = await axios.get(args.path);
        const data = pkg.data as string;
        const request = pkg.request as { responseURL: string };

        // store response in the cache
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
