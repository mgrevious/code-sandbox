import React, { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
}

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

export const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      // Reset contents of srcDoc so that #root div exists
      iframe.srcdoc = html;

      // trigger message event via postMessage call
      iframe.contentWindow?.postMessage(code, '*');
    }
  }, [code]);
  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts"
      title="preview"
      srcDoc={html}
    />
  );
};

export default Preview;
