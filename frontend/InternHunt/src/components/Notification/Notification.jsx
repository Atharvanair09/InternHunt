// Alert.js
import React from "react";
import "./Notification.css";

const Alert = ({ type, children }) => {
  const baseClasses =
    "alert border-l-4 p-2 rounded-lg flex items-center transition duration-300 ease-in-out transform hover:scale-105";

  const typeClasses = {
    success:
      "bg-green-100 text-green-900 border-green-500 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800",
    info: "bg-blue-100 text-blue-900 border-blue-500 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 dark:hover:bg-blue-800",
    warning:
      "bg-yellow-100 text-yellow-900 border-yellow-500 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-800",
    error:
      "bg-red-100 text-red-900 border-red-500 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700 dark:hover:bg-red-800",
  };

  const iconPath = "M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <svg
        stroke="currentColor"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`icon icon-${type}`}
        aria-hidden="true"
      >
        <path d={iconPath}></path>
      </svg>
      <p className="text-xs font-semibold">{children}</p>
    </div>
  );
};

export default function Notification() {
  return (
    <div className="space-y-2 p-4">
      <Alert type="success">Success - Everything went smoothly!</Alert>
      <Alert type="info">Info - This is some information for you.</Alert>
      <Alert type="warning">Warning - Be careful with this next step.</Alert>
      <Alert type="error">Error - Something went wrong.</Alert>
    </div>
  );
}
