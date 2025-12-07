import { useState } from 'react';
import { useLocalStorage } from './hooks';
import { PlayerProvider } from './contexts';
import { Header, Sidebar, PlayerBar, QueueView } from './components';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import GenreDetail from './pages/GenreDetail';
import PlaylistDetail from './pages/PlaylistDetail';

type PageState =
  | { type: 'home' }
  | { type: 'explore' }
  | { type: 'library' }
  | { type: 'recent' }
  | { type: 'playlist'; playlistId: string | number; title?: string }
  | { type: 'genre'; params: string; title: string; color?: string };

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('sidebar-open', true);
  // Default to home, but use object state
  const [currentPage, setCurrentPage] = useState<PageState>({ type: 'home' });
  const [isQueueViewOpen, setIsQueueViewOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleNavigate = (page: PageState) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage.type) {
      case 'home':
        return <HomePage isSidebarOpen={isSidebarOpen} />;
      case 'explore':
        return (
          <ExplorePage
            isSidebarOpen={isSidebarOpen}
            onNavigate={handleNavigate}
          />
        );
      case 'genre':
        return (
          <GenreDetail
            isSidebarOpen={isSidebarOpen}
            genreParams={currentPage.params}
            title={currentPage.title}
            initialColor={currentPage.color}
            onBack={() => setCurrentPage({ type: 'explore' })}
            onPlaylistClick={(playlist) =>
              setCurrentPage({ type: 'playlist', playlistId: playlist.id, title: playlist.title })
            }
          />
        );
      case 'playlist':
        return (
          <PlaylistDetail
            isSidebarOpen={isSidebarOpen}
            playlistId={currentPage.playlistId}
            initialTitle={currentPage.title}
            onBack={() => setCurrentPage({ type: 'explore' })} // Or go back to genre if history existed
          />
        );
      case 'library':
        return (
          <div className={`min-h-screen bg-white pt-16 pb-28 transition-all duration-300 ${isSidebarOpen ? 'pl-0 lg:pl-64' : 'pl-0 lg:pl-20'
            }`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-4xl font-bold text-gray-900">보관함</h1>
              <p className="text-gray-600 mt-2">준비 중입니다...</p>
            </div>
          </div>
        );
      case 'recent':
        return (
          <div className={`min-h-screen bg-white pt-16 pb-28 transition-all duration-300 ${isSidebarOpen ? 'pl-0 lg:pl-64' : 'pl-0 lg:pl-20'
            }`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-4xl font-bold text-gray-900">최근 재생</h1>
              <p className="text-gray-600 mt-2">준비 중입니다...</p>
            </div>
          </div>
        );
      default:
        return <HomePage isSidebarOpen={isSidebarOpen} />;
    }
  };

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-white">
        <Header
          onMenuClick={toggleSidebar}
          onLogoClick={() => {
            setCurrentPage({ type: 'home' });
            setIsQueueViewOpen(false);
          }}
        />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPage={currentPage.type === 'home' || currentPage.type === 'explore' || currentPage.type === 'library' || currentPage.type === 'recent' ? currentPage.type : 'explore'}
          onNavigate={(page) => {
            handleNavigate({ type: page });
            setIsQueueViewOpen(false);
          }}
        />
        {renderPage()}
        <PlayerBar onExpand={() => setIsQueueViewOpen(!isQueueViewOpen)} />
        <QueueView
          isOpen={isQueueViewOpen}
          onClose={() => setIsQueueViewOpen(false)}
        />
      </div>
    </PlayerProvider>
  );
}

export default App;
