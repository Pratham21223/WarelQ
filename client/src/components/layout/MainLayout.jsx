// src/components/layout/MainLayout.jsx
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

