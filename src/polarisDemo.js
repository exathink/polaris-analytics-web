import React from "react";
import {IntlProvider} from "react-intl";
import AppLocale from "./app/i18n";
import config, {getCurrentLanguage} from "./containers/LanguageSwitcher/config";
import {initGA} from "./app/ga";
import {ProjectPipelineFunnelView} from "./app/dashboards/projects/shared/widgets/funnel/projectPipelineFunnelView";

const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

// Run the Google Analytics initialization
initGA();

const workItemStateTypeCounts = {
  __typename: "StateTypeAggregateMeasure",
  backlog: 102,
  open: 20,
  wip: 50,
  complete: 40,
  closed: 30,
  unmapped: null,
};

const totalEffortByStateType = {
  __typename: "StateTypeAggregateMeasure",
  backlog: 5.58333333333333,
  open: null,
  wip: 13,
  complete: 2.91666666666667,
  closed: null,
  unmapped: null,
};

const PolarisDemoApp = () => (
  <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
    <div className="tw-flex tw-h-full tw-flex-col">
      <header className="">
        <nav class="tw-py-2.5 dark:tw-bg-gray-900 tw-rounded tw-border-gray-200 tw-bg-white tw-px-2 sm:tw-px-4">
          <div class="container tw-mx-auto tw-flex tw-flex-wrap tw-items-center tw-justify-between">
            <a href="https://exathink.com/" class="tw-flex tw-items-center">
              <img
                src="https://uploads-ssl.webflow.com/6068e6779386fc260eac4f30/61704b9c8a31ad343ef0924e_exathink-powered-by-polaris-309x150.png"
                class="tw-mr-3 tw-w-[170px]"
                alt="Exathink Logo"
              />
            </a>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              class="tw-text-gray-500 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 dark:focus:tw-ring-gray-600 tw-ml-3 tw-inline-flex tw-items-center tw-rounded-lg tw-p-2 tw-text-sm hover:tw-bg-gray-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-200 md:tw-hidden"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span class="tw-sr-only">Open main menu</span>
              <svg
                class="tw-h-6 tw-w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <div class="tw-hidden tw-w-full md:tw-block md:tw-w-auto" id="navbar-default">
              <ul class="tw-bg-gray-50 dark:tw-bg-gray-800 md:dark:tw-bg-gray-900 dark:tw-border-gray-700 tw-mt-4 tw-flex tw-list-none tw-flex-col tw-rounded-lg tw-border tw-border-gray-100 tw-p-4 md:tw-mt-0 md:tw-flex-row md:tw-space-x-8 md:tw-border-0 md:tw-bg-white md:tw-text-sm md:tw-font-medium">
                <li>
                  <a
                    href="#"
                    class="tw-bg-blue-700 md:tw-text-blue-700 tw-block tw-rounded tw-py-2 tw-pl-3 tw-pr-4 md:tw-bg-transparent md:tw-p-0"
                    aria-current="page"
                  >
                    Polaris Advisor
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="tw-text-gray-700 md:hover:tw-text-blue-700 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 tw-block tw-rounded tw-py-2 tw-pl-3 tw-pr-4 hover:tw-bg-gray-100 dark:hover:tw-text-white md:tw-border-0 md:tw-p-0 md:hover:tw-bg-transparent md:dark:hover:tw-bg-transparent md:dark:hover:tw-text-white"
                  >
                    Polaris Platform
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="tw-text-gray-700 md:hover:tw-text-blue-700 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 tw-block tw-rounded tw-py-2 tw-pl-3 tw-pr-4 hover:tw-bg-gray-100 dark:hover:tw-text-white md:tw-border-0 md:tw-p-0 md:hover:tw-bg-transparent md:dark:hover:tw-bg-transparent md:dark:hover:tw-text-white"
                  >
                    Optimization
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="tw-text-gray-700 md:hover:tw-text-blue-700 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 tw-block tw-rounded tw-py-2 tw-pl-3 tw-pr-4 hover:tw-bg-gray-100 dark:hover:tw-text-white md:tw-border-0 md:tw-p-0 md:hover:tw-bg-transparent md:dark:hover:tw-bg-transparent md:dark:hover:tw-text-white"
                  >
                    Ergnometrics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="tw-text-gray-700 md:hover:tw-text-blue-700 dark:tw-text-gray-400 dark:hover:tw-bg-gray-700 tw-block tw-rounded tw-py-2 tw-pl-3 tw-pr-4 hover:tw-bg-gray-100 dark:hover:tw-text-white md:tw-border-0 md:tw-p-0 md:hover:tw-bg-transparent md:dark:hover:tw-bg-transparent md:dark:hover:tw-text-white"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="main tw-container tw-mx-auto">
        <div className="tw-flex tw-justify-center">
          <div className="tw-w-full lg:tw-w-1/2">
            <ProjectPipelineFunnelView
              context={{}}
              days={30}
              workItemStateTypeCounts={workItemStateTypeCounts}
              totalEffortByStateType={totalEffortByStateType}
              // workItemScope={workItemScope}
              // setWorkItemScope={setWorkItemScope}
              showVolumeOrEffort={"volume"}
              leadTimeTarget={30}
              cycleTimeTarget={7}
              view={"primary"}
              displayBag={{}}
            />
          </div>
        </div>
      </div>

      <footer class="dark:tw-bg-gray-800 tw-mt-auto tw-rounded-lg tw-bg-white tw-p-4 tw-shadow md:tw-flex md:tw-items-center md:tw-justify-between md:tw-p-6">
        <span class="tw-text-gray-500 dark:tw-text-gray-400 tw-text-sm sm:tw-text-center">
          © 2023{" "}
          <a href="https://exathink.com/" class="hover:tw-underline">
            Exathink
          </a>
          . All Rights Reserved.
        </span>
        <ul class="tw-text-gray-500 dark:tw-text-gray-400 tw-mt-3 tw-flex tw-list-none tw-flex-wrap tw-items-center tw-text-sm sm:tw-mt-0">
          <li>
            <a href="#" class="tw-mr-4 hover:tw-underline md:tw-mr-6 ">
              About
            </a>
          </li>
          <li>
            <a href="#" class="tw-mr-4 hover:tw-underline md:tw-mr-6">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" class="tw-mr-4 hover:tw-underline md:tw-mr-6">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" class="hover:tw-underline">
              Contact
            </a>
          </li>
        </ul>
      </footer>
    </div>
  </IntlProvider>
);
export default PolarisDemoApp;
export {AppLocale};
