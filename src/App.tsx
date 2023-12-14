import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { ResizableBox } from 'react-resizable';
import CodeCell from './components/code-cell';
import { classNames } from './utils/classNames';

import 'bulmaswatch/lumen/bulmaswatch.min.css';

const App = () => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <div className="bg-[#f7f6f6] dark:bg-zinc-800 py-5 min-h-screen">
      <div className="flex flex-col mx-4 sm:mx-0">
        <div className="flex justify-end align-center gap-4 mr-6">
          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col mr-2">
              <Switch.Label
                as="span"
                className="dark:text-white text-sm font-semibold leading-6 text-zinc-900"
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
                darkModeEnabled ? 'bg-[#158cba]' : 'bg-zinc-300',
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
          {' '}
          <CodeCell darkMode={darkModeEnabled} />
          {/* <CodeCell darkMode={darkModeEnabled} /> */}
        </div>
      </div>
    </div>
  );
};

export default App;
