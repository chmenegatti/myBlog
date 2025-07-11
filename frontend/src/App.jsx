import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { ThemeContextProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';

function App() {
  return (
    <HelmetProvider>
      <ThemeContextProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* TODO: Add more routes */}
              <Route path="/blog" element={<Blog />} />
              <Route
                path="/blog/:slug"
                element={
                  <div style={{ padding: '2rem' }}>
                    Post Details - Coming Soon
                  </div>
                }
              />
              <Route
                path="/categories"
                element={
                  <div style={{ padding: '2rem' }}>
                    Categories - Coming Soon
                  </div>
                }
              />
              <Route
                path="/search"
                element={
                  <div style={{ padding: '2rem' }}>Search - Coming Soon</div>
                }
              />
              <Route
                path="/about"
                element={
                  <div style={{ padding: '2rem' }}>About - Coming Soon</div>
                }
              />
              <Route
                path="*"
                element={
                  <div style={{ padding: '2rem' }}>404 - Page Not Found</div>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </ThemeContextProvider>
    </HelmetProvider>
  );
}

export default App;
