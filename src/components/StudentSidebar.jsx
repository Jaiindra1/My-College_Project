import React from "react";

const StudentSidebar = ({ name, rollNo, onLogout }) => {
  return (
    
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Sidebar */}
      <aside className="w-64 bg-background-light dark:bg-background-dark flex flex-col p-4 border-r border-primary/20 dark:border-primary/30">
        {/* Profile Section */}
         <div className="flex items-center gap-3 p-2 mb-6">
          <div
            className="w-12 h-12 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoB4M_FPLW_GWpjQwqowPKOWRrcPGw4hD0cdo9JDiS1eE8l7dSWGUhZV6jNDQ89xsr7O4gVUknUz1fG_S8TGYi-4XsEcgrDO2lPKYPCS2ey7Pe1PDq7X35tnbhKbf3eqvIuT7WLfik9OzMZms_jM87D_aRjhO5kbPs3tvTfT0dURyT7xqegdjOh6fQ7f1xHEKbV_WQ7Ve8n98_29gonxj6oj-UeQ2WpkqcUtABK8Ku39pJQB6iMxkc22evXD0BgSe_BWggIq-iI5g")',
            }}
          ></div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {name || "Student"}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Roll No: {rollNo || "--"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
            </svg>
            <span className="text-sm font-medium">Dashboard</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30"
           href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z" />
            </svg>
            <span className="text-sm font-medium">Attendance</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30" href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
            </svg>
            <span className="text-sm font-medium">Timetable</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30" href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
            </svg>
            <span className="text-sm font-medium">Exams & Results</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30" href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
            </svg>
            <span className="text-sm font-medium">Notification Center</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30" href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z" />
            </svg>
            <span className="text-sm font-medium">Placements</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30" href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z" />
            </svg>
            <span className="text-sm font-medium">Fee Management</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30" href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
            </svg>
            <span className="text-sm font-medium">Profile & Settings</span>
          </a>

          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30" href="#">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-1.39,168a12,12,0,1,1,12-12A12,12,0,0,1,126.61,192ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Z" />
            </svg>
            <span className="text-sm font-medium">Help Desk</span>
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M174.63,133.66a8,8,0,0,1,0,11.31l-40,40a8,8,0,0,1-11.31-11.31L148.69,136H88a8,8,0,0,1,0-16h60.69l-25.37-25.37a8,8,0,0,1,11.31-11.31ZM216,40H136a8,8,0,0,1,0-16h80a16,16,0,0,1,16,16V216a16,16,0,0,1-16,16H136a8,8,0,0,1,0-16h80Z" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </a>
        </nav>
      </aside>
    </div>
  );
};

export default StudentSidebar;
