import React, { useState, useRef, useEffect } from "react";
import ptlogo from "../image/ptlogo.png";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleSidebar]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="p-4">
        <button onClick={toggleSidebar} className="mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <a href="/" className="flex items-center mb-4">
        </a>
        <nav>
          <SidebarItem icon="dashboard" text="Dashboard" path="/dashboard" />
          <SidebarItem icon="analysis" text="Analysis" path="/analysis" />
          <SidebarItem icon="news" text="News" path="/news" />
          <SidebarItem icon="history" text="History" path="/history" />
          <SidebarItem icon="journal" text="Journal" path="/journal" />
          <div className="border-t border-gray-700 my-4"></div>
          <h3 className="text-lg font-semibold mb-2">You</h3>
          <SidebarItem
            icon="manage-alerts"
            text="Manage Alerts"
            path="/manage-alerts"
          />
          <SidebarItem icon="reminders" text="Reminders" path="/reminders" />
          <SidebarItem
            icon="favourite-stocks"
            text="Favourite Stocks"
            path="/favorite-stocks"
          />
          <SidebarItem icon="notes" text="Notes" path="/notes" />
          <SidebarItem
            icon="saved-patterns"
            text="Saved Patterns"
            path="/saved-patterns"
          />
        </nav>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
      analysis: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      ),
      news: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      ),
      history: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      journal: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      ),
      "manage-alerts": (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      ),
      reminders: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      "favourite-stocks": (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      ),
      notes: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      ),
      "saved-patterns": (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <a
      href="#"
      className="flex items-center py-2 px-4 hover:bg-gray-800"
      onClick={(e) => {
        e.preventDefault();
        navigate(path);
      }}
    >
      <svg
        className="w-6 h-6 mr-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {getIcon(icon)}
      </svg>
      <span>{text}</span>
    </a>
  );
};

const UserMenu = ({ isOpen, toggleMenu }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleMenu]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-64 bg-gray-900 rounded-md shadow-lg py-1 z-20"
    >
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center">
          <img
            src={ptlogo}
            alt="User"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-white font-semibold">Aditya Inampudi</span>
        </div>
      </div>
      <MenuItem icon="settings" text="Settings & privacy" path="/account-profile" />
      <MenuItem icon="feedback" text="Give feedback" path="/feedback" />
      <MenuItem icon="help" text="Help & support" path="/help" />
      <MenuItem icon="logout" text="Log Out" path="/login" />
    </div>
  );
};

const MenuItem = ({ icon, text, path }) => {
  const navigate = useNavigate();

  const icons = {
    settings: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
    ),
    help: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    display: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    ),
    feedback: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
      />
    ),
    logout: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    ),
  };

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigate(path);
      }}
      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
    >
      <svg
        className="w-5 h-5 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {icons[icon]}
      </svg>
      {text}
    </a>
  );
};

const NotificationsMenu = ({ isOpen, toggleMenu }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleMenu]);

  const notifications = [
    { id: 1, text: "New market update available", time: "5 minutes ago" },
    { id: 2, text: "Your watchlist stock XYZ is up by 5%", time: "1 hour ago" },
    { id: 3, text: "Earnings report for ABC company released", time: "3 hours ago" },
    { id: 4, text: "New feature: Advanced charting tools added", time: "1 day ago" },
  ];

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-80 bg-gray-900 rounded-md shadow-lg py-1 z-20"
    >
      <div className="px-4 py-2 border-b border-gray-700">
        <h3 className="text-white font-semibold">Notifications</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="px-4 py-3 hover:bg-gray-800 cursor-pointer">
            <p className="text-white text-sm">{notification.text}</p>
            <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-gray-700">
        <a href="/notifications" className="text-blue-400 text-sm hover:text-blue-300">View all notifications</a>
      </div>
    </div>
  );
};

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setUserMenuOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-black text-white p-4 flex items-center justify-between relative z-30">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <a href="/dashboard" className="flex items-center">
            <svg
              className="w-8 h-8 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 18l4-4 4 4 8-8" />
              <path d="M12 8V6M12 6h2M12 6H9.5" />
              <path d="M20 6H16" />
            </svg>
            <span className="font-bold text-xl">Profitable Trader</span>
          </a>
        </div>
        <div className="flex items-center relative">
          <button onClick={toggleNotifications} className="p-2 ml-2 hover:bg-gray-700 rounded-full">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button
            onClick={toggleUserMenu}
            className="ml-2 w-8 h-8 bg-gray-600 rounded-full overflow-hidden z-30"
          >
            <img
              src={ptlogo}
              alt="User"
              className="w-full h-full object-cover"
            />
          </button>
          <UserMenu isOpen={userMenuOpen} toggleMenu={setUserMenuOpen} />
          <NotificationsMenu isOpen={notificationsOpen} toggleMenu={setNotificationsOpen} />
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default NavBar;