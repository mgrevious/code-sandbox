import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import { resolvePlugin } from "./plugins/resolve-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const [input, setInput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.19.8/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
    console.log("i am called");
  }, []);

  const onClick = async () => {
    if (!esbuild) {
      return;
    }

    const iframe = iframeRef.current;
    // Reset contents of srcDoc so that #root div exists
    if (iframe) {
      iframe.srcdoc = html;

      // use unpkg plugin to bundle, entry point is index.js
      const result = await esbuild.build({
        entryPoints: ["index.js"],
        bundle: true,
        write: false,
        plugins: [resolvePlugin(), fetchPlugin(input)],
        define: { "process.env.NODE_ENV": "'production'", global: "window" },
      });

      iframe.contentWindow?.postMessage(result.outputFiles[0].text, "*");
    }
  };

  const html = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Output</title>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
              console.log(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  // using iframe srcDoc and sandbox="" prevents access to browser storage like localStorage and cookies
  // allow-scripts is added to allow code execution within iframe script tags
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        title="preview"
        srcDoc={html}
      />
    </div>
  );
};

export default App;
