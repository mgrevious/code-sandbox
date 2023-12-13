import { useState } from 'react';
import { Switch } from '@headlessui/react';
import CodeEditor from './components/code-editor';
import { classNames } from './utils/classNames';
import bundler from './bundler';

import 'bulmaswatch/lumen/bulmaswatch.min.css';
import Preview from './components/preview';

const App = () => {
  const [input, setInput] = useState('');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [code, setCode] = useState('');

  const onClick = async () => {
    const result = await bundler(input);
    setCode(result);
  };

  // using iframe srcDoc and sandbox="" prevents access to browser storage like localStorage and cookies
  // allow-scripts is added to allow code execution within iframe script tags
  return (
    <div className="bg-white dark:bg-zinc-700">
      <div className="container py-5">
        <div className="flex flex-col gap-4 mx-4 sm:mx-0">
          <div className="flex justify-start align-center gap-4">
            <Switch.Group
              as="div"
              className="flex items-center justify-between"
            >
              <span className="flex flex-grow flex-col mr-2">
                <Switch.Label
                  as="span"
                  className="dark:text-white text-sm font-medium leading-6 text-zinc-900"
                  passive
                >
                  Dark Mode
                </Switch.Label>
              </span>
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
                  darkModeEnabled ? 'bg-[#292929]' : 'bg-gray-200',
                  `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${
                    darkModeEnabled
                      ? 'focus:ring-[#1a1a1a]'
                      : 'focus:ring-[#158cba]'
                  } focus:ring-offset-2`,
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
            </Switch.Group>
          </div>
          <div className="mt-12">
            <CodeEditor
              darkMode={darkModeEnabled}
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
              className="py-2 px-4 border border-zinc-200 dark:border-zinc-700 h-60 rounded-sm mb-4 w-full dark:bg-zinc-900 dark:text-zinc-100"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button
              className="button button-format is-primary is-normal"
              onClick={onClick}
            >
              Submit
            </button>
          </div>
          <Preview code={code} />
        </div>
      </div>
    </div>
  );
};

export default App;
