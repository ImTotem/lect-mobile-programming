import { useState } from 'react';
import { Header, Sidebar } from './components';
import HomePage from './pages/HomePage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <HomePage isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default App;
