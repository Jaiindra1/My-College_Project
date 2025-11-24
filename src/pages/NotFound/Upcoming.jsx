import React from 'react';

const Upcoming = () => {
  return (
    <body className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-1 items-center justify-center w-full py-10 sm:py-16">
            <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="layout-content-container flex flex-col gap-12">
                <div className="flex flex-wrap justify-between gap-3 text-center">
                  <div className="flex w-full flex-col items-center gap-4">
                    <p className="text-text-light dark:text-text-dark text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]"> We're Building Next</p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base sm:text-lg font-normal leading-normal max-w-2xl">We're constantly working to improve your experience. Here's a sneak peek at what's in development to help you achieve even more.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
};

export default Upcoming;
