import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks';
import { PlayerProvider, StorageProvider, usePlayer, useStorage } from './contexts';
import { Header, Sidebar, PlayerBar, QueueView } from './components';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import GenreDetail from './pages/GenreDetail';
import PlaylistDetail from './pages/PlaylistDetail';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import RecentPage from './pages/RecentPage';

type PageState =
  | { type: 'home' }
  | { type: 'explore' }
  | { type: 'library' }
  | { type: 'recent' }
  | { type: 'playlist'; playlistId: string | number; title?: string }
  | { type: 'genre'; params: string; title: string; color?: string }
  | { type: 'search'; query: string };

// Helper component to handle side effects (like adding to recent) that need both contexts
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('sidebar-open', true);
  const [currentPage, setCurrentPage] = useState<PageState>({ type: 'home' });
  const [isQueueViewOpen, setIsQueueViewOpen] = useState(false);

  const { currentSong } = usePlayer();
  const { addToRecent } = useStorage();

  // Add current song to recents when it changes
  useEffect(() => {
    if (currentSong) {
      addToRecent(currentSong);
    }
  }, [currentSong, addToRecent]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev: boolean) => !prev);
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
            onBack={() => setCurrentPage({ type: 'explore' })}
          />
        );
      case 'search':
        return (
          <SearchPage
            isSidebarOpen={isSidebarOpen}
            query={currentPage.query}
          />
        );
      case 'library':
        return <LibraryPage isSidebarOpen={isSidebarOpen} />;
      case 'recent':
        return <RecentPage isSidebarOpen={isSidebarOpen} />;
      default:
        return <HomePage isSidebarOpen={isSidebarOpen} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuClick={toggleSidebar}
        onNavigate={handleNavigate}
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
  );
}

function App() {
  return (
    <StorageProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </StorageProvider>
  );
}

export default App;
