import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2 } from 'lucide-react';
import NavBar from '../NavBar';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Market Update', message: 'S&P 500 hits new all-time high', time: '5 minutes ago', read: false },
    { id: 2, title: 'Stock Alert', message: 'AAPL up by 3% in pre-market trading', time: '1 hour ago', read: false },
    { id: 3, title: 'Earnings Report', message: 'TSLA Q2 earnings beat expectations', time: '2 hours ago', read: true },
    { id: 4, title: 'Economic Indicator', message: 'US jobless claims lower than expected', time: '1 day ago', read: true },
    { id: 5, title: 'Watchlist Update', message: 'GOOGL added to your watchlist', time: '2 days ago', read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gray-100">
      {/* <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="mr-3 h-8 w-8 text-blue-600" /> Notifications
          </h1>
        </div>
      </header> */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <motion.div 
              className="divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {notifications.map((notif) => (
                <motion.div 
                  key={notif.id} 
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 ${notif.read ? 'opacity-60' : ''}`}
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{notif.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                      <p className="mt-1 text-xs text-gray-400">{notif.time}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      {!notif.read && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors duration-200"
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {notifications.length === 0 && (
              <div className="p-4 sm:p-6 text-center text-gray-500">
                No notifications to display.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default NotificationsPage;