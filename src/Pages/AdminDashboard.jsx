import React, { useEffect, useState } from "react";
import backendApi from "../backendApi";
import Navbar from "../componets/Header/Navbar";
import Footer from "../componets/Footer/Footer";
import toast, { Toaster } from "react-hot-toast";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ activeUsers: 0, serverStatus: "Loading...", cachedItems: 0 });
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState({ status: "Loading...", uptime: 0 });

  useEffect(() => {
    if (activeTab === "overview") {
      backendApi.get("/admin/overview").then((res) => setStats(res.data)).catch(console.error);
    } else if (activeTab === "users") {
      backendApi.get("/admin/users").then((res) => setUsers(res.data.users)).catch(console.error);
    } else if (activeTab === "health") {
      backendApi.get("/admin/health").then((res) => setHealth(res.data)).catch(console.error);
    }
  }, [activeTab]);

  const handleClearCache = () => {
    backendApi.post("/admin/cache/clear").then((res) => {
      toast.success(res.data.message);
    }).catch(() => {
      toast.error("Failed to clear cache");
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <Toaster />
      <div className="pt-24 px-10 pb-10 flex">
        <div className="w-1/4 bg-gray-800 p-4 rounded-lg mr-6">
          <h2 className="text-white text-xl mb-4 border-b border-gray-600 pb-2">Admin Menu</h2>
          <ul>
            <li className={`text-white p-2 cursor-pointer ${activeTab === 'overview' ? 'bg-red-700' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('overview')}>Overview</li>
            <li className={`text-white p-2 cursor-pointer ${activeTab === 'users' ? 'bg-red-700' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('users')}>Users</li>
            <li className={`text-white p-2 cursor-pointer ${activeTab === 'cache' ? 'bg-red-700' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('cache')}>Cache Management</li>
            <li className={`text-white p-2 cursor-pointer ${activeTab === 'health' ? 'bg-red-700' : 'hover:bg-gray-700'}`} onClick={() => setActiveTab('health')}>System Health</li>
          </ul>
        </div>

        <div className="w-3/4">
          <h1 className="text-white text-4xl mb-6 capitalize">{activeTab}</h1>

          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 p-6 rounded-lg border-t-4 border-red-700 shadow">
                <h3 className="text-gray-400 text-sm">Active Users</h3>
                <p className="text-white text-3xl font-bold">{stats.activeUsers}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border-t-4 border-green-500 shadow">
                <h3 className="text-gray-400 text-sm">Server Status</h3>
                <p className="text-white text-3xl font-bold">{stats.serverStatus}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border-t-4 border-blue-500 shadow">
                <h3 className="text-gray-400 text-sm">Cached Items</h3>
                <p className="text-white text-3xl font-bold">{stats.cachedItems}</p>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-gray-800 p-6 rounded-lg shadow overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="text-gray-100 border-b border-gray-600">
                  <tr>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Firebase UID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.role}</td>
                      <td className="py-2 font-mono text-sm">{user.firebaseUid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "cache" && (
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <p className="text-gray-300 mb-4">Manage the system's content caches to ensure freshness.</p>
              <button onClick={handleClearCache} className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
                Clear All Content Caches
              </button>
            </div>
          )}

          {activeTab === "health" && (
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <p className="text-gray-300 mb-2">Status: <span className="text-white font-bold">{health.status}</span></p>
              <p className="text-gray-300 mb-2">Uptime: <span className="text-white font-bold">{Math.floor(health.uptime / 60)} minutes</span></p>
              {health.memoryUsage && (
                <div className="mt-4">
                  <h4 className="text-white mb-2">Memory Usage</h4>
                  <p className="text-gray-400 text-sm">Heap Total: {Math.floor(health.memoryUsage.heapTotal / 1024 / 1024)} MB</p>
                  <p className="text-gray-400 text-sm">Heap Used: {Math.floor(health.memoryUsage.heapUsed / 1024 / 1024)} MB</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
