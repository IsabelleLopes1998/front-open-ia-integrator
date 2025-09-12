// src/components/Sidebar/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const baseItem =
    "nav-item flex items-center px-6 py-4 text-gray-300 hover:text-white";
  const activeItem = "active";
  const linkClass = ({ isActive }) =>
    `${baseItem} ${isActive ? activeItem : ""}`;

  return (
    <>
      {/* Botão Mobile */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 p-3 rounded-lg"
        aria-label="Abrir menu"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0b0b0b] border-r border-[#222] z-50 transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo / Header */}
        <div className="px-6 py-6 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold leading-tight">
                Ia integrator 
              </p>
              <p className="text-gray-400 text-xs">Integração</p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="py-6 space-y-1">
          <NavLink to="/ia" className={linkClass} onClick={() => setOpen(false)}>
            <svg
              className="w-5 h-5 mr-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="font-medium">Gerar Imagens IA</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
