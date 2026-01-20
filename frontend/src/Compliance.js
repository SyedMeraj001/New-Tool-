import React, { useState, useEffect } from "react";
import {
  FaFileUpload,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./contexts/ThemeContext";
import { getThemeClasses } from "./utils/themeUtils";
import ProfessionalHeader from "./components/ProfessionalHeader";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ===================== 3D UI Styles ===================== */
const style = document.createElement("style");
style.textContent = `
@keyframes float3D {0%,100% { transform: translateY(0); }50% { transform: translateY(-8px); }}
.metric-3d { animation: float3D 3s ease-in-out infinite; }
.compliance-item-3d { transition: all 0.3s ease; }
.compliance-item-3d:hover { transform: translateY(-4px) scale(1.02); }
.upload-zone-3d { transition: all 0.3s ease; }
.upload-zone-3d:hover { transform: scale(1.01); }
`;
document.head.appendChild(style);

/* ===================== UI CONSTANTS ===================== */
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Overdue: "bg-red-100 text-red-800 border-red-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
};

const categoryIcons = {
  Environmental: "🌍",
  Social: "👥",
  Governance: "🏛️",
};

const Compliance = () => {
  const { isDark, toggleTheme } = useTheme();
  const theme = getThemeClasses(isDark);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  /* ===================== FETCH DATA ===================== */
  const fetchDocuments = async () => {
    const res = await fetch(`${API_URL}/api/compliance`);
    const data = await res.json();
    setDocuments(Array.isArray(data) ? data : []);
  };

  const fetchRequirements = async () => {
    const res = await fetch(`${API_URL}/api/compliance/requirements`);
    const data = await res.json();
    setRequirements(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    Promise.all([fetchDocuments(), fetchRequirements()]).finally(() =>
      setIsLoading(false)
    );
  }, []);

  /* ===================== ACTIONS ===================== */
  const handleFileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await fetch(`${API_URL}/api/compliance/upload`, {
      method: "POST",
      body: formData,
    });
    fetchDocuments();
    fetchRequirements();
  };

  const handlePreview = (fileName) =>
    window.open(`${API_URL}/api/compliance/preview/${fileName}`, "_blank");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    await fetch(`${API_URL}/api/compliance/${id}`, { method: "DELETE" });
    fetchDocuments();
    fetchRequirements();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-14 w-14 border-b-2 border-green-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <ProfessionalHeader
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <main className="max-w-7xl mx-auto p-6">
        {/* ===================== METRICS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Metric
            icon={<FaCheckCircle />}
            label="Completed"
            value={requirements.filter(r => r.status === "Completed").length}
            color="text-green-500"
          />
          <Metric
            icon={<FaClock />}
            label="Pending"
            value={requirements.filter(r => r.status === "Pending").length}
            color="text-yellow-500"
          />
          <Metric
            icon={<FaExclamationTriangle />}
            label="Overdue"
            value={requirements.filter(r => r.status === "Overdue").length}
            color="text-red-500"
          />
          <Metric
            icon="📊"
            label="Total"
            value={requirements.length}
          />
        </div>

        {/* ===================== UPLOAD ===================== */}
        <div className="upload-zone-3d rounded-2xl p-8 border-2 border-dashed mb-8 bg-white dark:bg-gray-900 dark:border-gray-700">
          <div className="text-center">
            <FaFileUpload className="mx-auto text-4xl mb-3 text-gray-700 dark:text-gray-300" />
            <p className="mb-3">Drag & drop files or click to upload</p>
            <label className="inline-block px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
              Choose File
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* ===================== COMPLIANCE REQUIREMENTS ===================== */}
        <div className="rounded-2xl p-6 border shadow mb-8 bg-white dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">
            Compliance Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="compliance-item-3d p-4 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 flex justify-between"
              >
                <div>
                  <h3 className="font-medium">
                    {categoryIcons[req.category]} {req.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {req.framework} • {req.category} • Due {req.due_date}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 text-xs border ${statusColors[req.status]}`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== DOCUMENT HISTORY ===================== */}
        <div className="rounded-2xl p-6 border shadow bg-white dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Document History</h2>

          {documents.map((doc) => (
            <div
              key={doc.id}
              className="compliance-item-3d p-4 mb-3 border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 flex justify-between"
            >
              <div>
                <h3 className="font-medium">{doc.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {doc.category} • {doc.status}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                {doc.file_name && (
                  <FaEye
                    onClick={() => handlePreview(doc.file_name)}
                    className="cursor-pointer"
                  />
                )}
                {doc.file_name && (
                  <a href={`${API_URL}/api/compliance/download/${doc.id}`}>
                    <FaDownload />
                  </a>
                )}
                <FaTrash
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/* ===================== METRIC CARD ===================== */
const Metric = ({ icon, label, value, color }) => (
  <div className="metric-3d rounded-2xl p-6 border shadow bg-white dark:bg-gray-900 dark:border-gray-700">
    <div className={`text-2xl mb-2 ${color}`}>{icon}</div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default Compliance;
