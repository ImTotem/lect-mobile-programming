import { useLocalStorage } from './hooks';
import { PlayerProvider } from './contexts';
import { Header, Sidebar, PlayerBar } from './components';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('sidebar-open', true);
  const [currentPage, setCurrentPage] = useLocalStorage<'home' | 'explore' | 'library' | 'recent'>('current-page', 'home');

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleNavigate = (page: 'home' | 'explore' | 'library' | 'recent') => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage isSidebarOpen={isSidebarOpen} />;
      case 'explore':
        return <ExplorePage isSidebarOpen={isSidebarOpen} />;
      case 'library':
        return (
          <div className={`min-h-screen bg-white pt-16 pb-28 transition-all duration-300 ${
            isSidebarOpen ? 'pl-0 lg:pl-64 2xl:pl-20' : 'pl-0 lg:pl-20'
          }`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-4xl font-bold text-gray-900">보관함</h1>
              <p className="text-gray-600 mt-2">준비 중입니다...</p>
            </div>
          </div>
        );
      case 'recent':
        return (
          <div className={`min-h-screen bg-white pt-16 pb-28 transition-all duration-300 ${
            isSidebarOpen ? 'pl-0 lg:pl-64 2xl:pl-20' : 'pl-0 lg:pl-20'
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
        <Header onMenuClick={toggleSidebar} />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        {renderPage()}
        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}

export default App;
