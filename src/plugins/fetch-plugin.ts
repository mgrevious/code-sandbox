import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({ name: "fileCache" });

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // if esbuild is attempting to load index.js file, lets intercept it and return the code to bundle.
      build.onLoad({ filter: /(^index\.js$)/ }, async () => ({
        loader: "jsx",
        contents: inputCode,
      }));

      // esbuild will continue to the other onLoad functions if cachedResult is false
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // if it is, return immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      // Load CSS files
      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        // otherwise call the unpkg API
        const { data, request } = await axios.get(args.path);
        const escapedCss = data
          .replace(/\n/g, "")
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
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        fileCache.setItem(args.path, result);

        return result;
      });

      // Load JavaScript files
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // otherwise call the unpkg API
        const { data, request } = await axios.get(args.path);

        // store response in the cache
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
