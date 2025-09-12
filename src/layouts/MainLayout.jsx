import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      {/* Conteúdo deslocado no desktop para não ficar debaixo da sidebar */}
      <main className="lg:ml-64 p-6">{children}</main>
    </div>
  );
}
