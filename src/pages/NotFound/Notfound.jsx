
import React from 'react';

const NotFound = () => {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
            <header className="flex items-center justify-between whitespace-nowrap px-4 py-3 sm:px-6">
              <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
                <div className="size-6 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-bold tracking-[-0.015em] text-slate-900 dark:text-white">Product Logo</h2>
              </div>
            </header>
            <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
              <div className="flex flex-col items-center gap-8 w-full max-w-lg">
                <div className="text-primary/20">
                  {/* Material Symbols Outlined icon - ensure you have the font loaded globally */}
                  <span className="material-symbols-outlined !text-9xl">search_off</span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-4xl font-black tracking-[-0.033em] text-slate-900 dark:text-white sm:text-5xl">404 - Page Not Found</p>
                  <p className="text-base font-normal text-slate-600 dark:text-slate-400">Oops! It looks like the page you're looking for doesn't exist or may have been moved.</p>
                </div>
                <div>
                  {/* Using an anchor tag for simplicity. If you use React Router, replace with <Link to="/"> */}
                  <a href="/" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                    <span className="truncate">Return to Homepage</span>
                  </a>
                </div>
              </div>
            </main>
            <footer className="flex flex-col gap-6 px-5 py-6 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary" href="#">Help Center</a>
                <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary" href="#">Contact Support</a>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-500">© 2024 Company Name. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
