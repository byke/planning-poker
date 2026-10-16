import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import { Suspense, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch, useLocation } from 'react-router-dom';
import { Loading } from './components/Loading/Loading';
import { Toolbar } from './components/Toolbar/Toolbar';
import { AboutPage } from './pages/AboutPage/AboutPage';
import DeleteOldGames from './pages/DeleteOldGames/DeleteOldGames';
import { ExamplesPage } from './pages/ExamplesPage/ExamplesPage';
import { GamePage } from './pages/GamePage/GamePage';
import { GuidePage } from './pages/GuidePage/GuidePage';
import HomePage from './pages/HomePage/HomePage';
import JoinPage from './pages/JoinPage/JoinPage';
import { getSelectedTheme, themes } from './utils/themeUtils';

polyfillCountryFlagEmojis();

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Apply theme whenever route changes
    const applyTheme = () => {
      // Force fresh read from localStorage
      const currentTheme = getSelectedTheme(); 

      // Remove all theme classes
      document.documentElement.classList.remove(
        'halloween-theme',
        'christmas-theme',
        'stPatricks-theme',
        'easter-theme'
      );

      // Add current theme class if it's a special theme
      if (currentTheme !== 'light' && currentTheme !== 'dark') {
        document.documentElement.classList.add(`${currentTheme}-theme`);
      }

      // Toggle dark mode based on theme config
      const darkThemes = ['dark', 'halloween'];
      document.documentElement.classList.toggle('dark', darkThemes.includes(currentTheme));
    };

    applyTheme();
  }, [location]); // Re-run when route changes

  return (
    <div className='bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen'>
      <Suspense
        fallback={
          <div className='text-center items-center justify-center flex'>
            <Loading />
          </div>
        }
      >
        <Toolbar />
        <Switch>
          <Route path='/game/:id' component={GamePage} />
          <Route path='/delete-old-games' component={DeleteOldGames} />
          <Route path='/join/:id' component={JoinPage} />
          <Route path='/about-planning-poker' component={AboutPage} />
          <Route path='/examples' component={ExamplesPage} />
          <Route path='/guide' component={GuidePage} />
          <Route exact path='/*' component={HomePage} />
        </Switch>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;