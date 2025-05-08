import { Link, useLocation } from "react-router-dom";
import { Package, Upload, Pencil } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { label: "Products", path: "/", icon: <Package className="w-5 h-5" /> },
    { label: "Upload Products", path: "/upload-products", icon: <Upload className="w-5 h-5" /> },
    { label: "Update Rack Space", path: "/update-rack-space", icon: <Pencil className="w-5 h-5" /> },
  ];

  return (
    <aside className="h-screen fixed w-64 bg-gray-900 text-white flex flex-col p-4 border-r border-gray-700">
      {/* Header */}
      <div className="px-3 py-4 mb-2">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Inventory Manager
        </h2>
        <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${location.pathname === link.path
                ? "bg-blue-900/30 text-blue-100 border-l-4 border-blue-500"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
          >
            <span className={`transition-colors ${location.pathname === link.path ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-300'}`}>
              {link.icon}
            </span>
            <span className="font-medium truncate">{link.label}</span>
            {location.pathname === link.path && (
              <span className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pt-4 mt-auto border-t border-gray-800">
        <div className="text-xs text-gray-400 pb-2">
          v1.0.0 • {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
}