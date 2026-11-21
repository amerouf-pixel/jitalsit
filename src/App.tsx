import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SiteProvider, useSite } from './context/SiteContext';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HomePage } from './pages/HomePage';
import { MemberPage } from './pages/MemberPage';
import { NewsPage } from './pages/NewsPage';
import { PricingPage } from './pages/PricingPage';
import { StreamerStudioPage } from './pages/StreamerStudioPage';
import { SupportPage } from './pages/SupportPage';
import { VideosPage } from './pages/VideosPage';

function PageRouter() {
  const { currentPage } = useSite();

  switch (currentPage) {
    case 'decouvrir':
      return <DiscoverPage />;
    case 'fonctionnalites':
      return <FeaturesPage />;
    case 'videos':
      return <VideosPage />;
    case 'streamer-studio':
      return <StreamerStudioPage />;
    case 'tarifs':
      return <PricingPage />;
    case 'connexion':
      return <AuthPage />;
    case 'membre':
      return <MemberPage />;
    case 'actualites':
      return <NewsPage />;
    case 'assistance':
      return <SupportPage />;
    case 'admin':
      return <AdminPage />;
    case 'accueil':
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <div className="min-h-screen bg-[#09090F] text-[#F4F4F8] flex flex-col">
          <Navbar />
          <main className="flex-1">
            <PageRouter />
          </main>
          <Footer />
        </div>
      </SiteProvider>
    </ErrorBoundary>
  );
}
