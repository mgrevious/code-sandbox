import React, { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
  error: string;
}

// Define html that will run inside iframe. Register message event listener on window
// handle async runtime errors that would normally be ignored by the try/catch
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
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red; font-family: Helvetica,Arial,sans-serif;"><h4>Error</h4><span style="font-weight: 300;">' + err + '</span></div>'
            console.log(err);      
          }
          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

export const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      // Reset contents of srcDoc so that #root div exists
      iframe.srcdoc = html;

      // trigger message event via postMessage call
      // delay code execution until after the iframe #root html has been updated due to the re-render from user input
      setTimeout(() => {
        iframe.contentWindow?.postMessage(code, '*');
      }, 50);
    }
  }, [code]);

  // using iframe srcDoc and sandbox="" prevents access to browser storage like localStorage and cookies
  // allow-scripts is added to allow code execution within iframe script tags
  return (
    <div className="relative h-full iframe-wrapper grow">
      <iframe
        className="bg-white dark:bg-zinc-900 dark:text-zinc-100 w-full h-full"
        ref={iframeRef}
        sandbox="allow-scripts"
        title="preview"
        srcDoc={html}
      />
      {error && (
        <div className="px-2 pt-4 text-red-500 absolute top-0 left-0 right-0">
          <h4 className="font-bold text-lg mb-2">Error</h4>
          <span className="font-normal">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Preview;
