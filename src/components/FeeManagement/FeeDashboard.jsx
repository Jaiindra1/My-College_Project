import React, { useState } from "react";
import FeeList from "./FeeList";
import PendingFees from "./PendingFees";
import AddFee from "./AddFee";
import UpdateFee from "./UpdateFee";
import Sidebar from "../../components/Sidebar";

const FeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");

  const renderTab = () => {
    switch (activeTab) {
      case "pending":
        return <PendingFees />;
      case "add":
        return <AddFee />;
      case "update":
        return <UpdateFee />;
      default:
        return <FeeList />;
    }
  };

  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Page Header */}
        <header className="mb-8">
          <h2 className="text-4xl font-bold dark:text-black text-center">
             Fee Management Dashboard
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
            Manage all fee records, pending payments, and updates in one place
          </p>
        </header>

        {/* Tabs */}
        <div className="bg-white dark:bg-background-dark/50 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <nav className="flex justify-around border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "all", label: " All Fees" },
              { id: "pending", label: " Pending Fees" },
              { id: "add", label: "➕ Add Fee" },
              { id: "update", label: "✏️ Update Fee" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-inner"
                    : "text-gray-600 dark:text-black hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="p-6">{renderTab()}</div>
        </div>
      </main>
    </div>
  );
};

export default FeeDashboard;
