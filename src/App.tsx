import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import UploadLog from "./pages/UploadLog";


export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/upload-log" element={<UploadLog />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}