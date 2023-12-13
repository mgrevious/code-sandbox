import * as esbuild from 'esbuild-wasm';
import { useState, useRef } from 'react';
import { Switch } from '@headlessui/react';
import { resolvePlugin } from './plugins/resolve-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';
import { classNames } from './utils/classNames';

import 'bulmaswatch/lumen/bulmaswatch.min.css';

const App = () => {
  const [input, setInput] = useState('');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [resolvePlugin(), fetchPlugin(input)],
        define: { 'process.env.NODE_ENV': "'production'", global: 'window' },
      });

      // trigger message event via postMessage call
      iframe.contentWindow?.postMessage(result.outputFiles[0].text, '*');
    }
  };

  // Define html that will run inside iframe. Register message event listener on window
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
    <div className="bg-white dark:bg-slate-900">
      <div className="container py-5">
        <div className="flex flex-col gap-4 mx-4 sm:mx-0">
          <div className="flex justify-end align-center gap-4">
            <label className="dark:text-white">Dark Mode</label>
            <div>
              <Switch
                checked={darkModeEnabled}
                onChange={(checked) => {
                  setDarkModeEnabled(checked);
                  if (checked) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }}
                className={classNames(
                  darkModeEnabled ? 'bg-indigo-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    darkModeEnabled ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  )}
                />
              </Switch>
            </div>
          </div>
          <div className="mt-12">
            <CodeEditor
              initialValue="const a = 1;"
              onChange={(value) => {
                if (value) {
                  setInput(value);
                }
              }}
            />
          </div>
          <div>
            <textarea
              className="border border-slate-200 h-60 rounded-sm mb-4 w-full"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button className="button" onClick={onClick}>
              Submit
            </button>
          </div>
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts"
            title="preview"
            srcDoc={html}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
