// // // src/context/AppContext.js
// // import React, { createContext, useState, useContext } from 'react';

// // const AppContext = createContext();

// // export const AppProvider = ({ children }) => {
// //   const [chatHistory, setChatHistory] = useState([]);
// //   const [error, setError] = useState('');

// //   const addChatMessage = (message) => {
// //     setChatHistory((prevHistory) => [...prevHistory, message]);
// //   };

// //   return (
// //     <AppContext.Provider 
// //       value={{
// //         chatHistory,
// //         addChatMessage,
// //         error,
// //         setError
// //       }}
// //     >
// //       {children}
// //     </AppContext.Provider>
// //   );
// // };

// // export const useAppContext = () => useContext(AppContext);
// // src/context/AppContext.js
// import React, { createContext, useState, useContext } from 'react';

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [chatHistory, setChatHistory] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const addChatMessage = (message) => {
//     setChatHistory((prevHistory) => [...prevHistory, message]);
//   };

//   return (
//     <AppContext.Provider 
//       value={{
//         chatHistory,
//         addChatMessage,
//         error,
//         setError,
//         loading,
//         setLoading
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => useContext(AppContext);

import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const addChatMessage = (message) => {
    setChatHistory(prevHistory => [...prevHistory, message]);
  };

  return (
    <AppContext.Provider 
      value={{
        error,
        setError,
        loading,
        setLoading,
        chatHistory,
        addChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};