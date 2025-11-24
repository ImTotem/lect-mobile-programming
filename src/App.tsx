import { useState } from 'react';
import { Header, Sidebar, PlayerBar } from './components';
import HomePage from './pages/HomePage';
import { MOCK_SONGS } from './data/mockData';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // 현재 재생 중인 곡 (임시로 첫 번째 곡)
  const currentSong = MOCK_SONGS[0];

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <HomePage isSidebarOpen={isSidebarOpen} />
      <PlayerBar currentSong={currentSong} />
    </div>
  );
}

export default App;
