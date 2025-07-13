import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { ThemeContextProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthProvider';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PostEditor from './pages/PostEditor';
import TestPosts from './pages/TestPosts';

function App() {
  return (
    <HelmetProvider>
      <ThemeContextProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<PostDetail />} />
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
                          <div style={{ padding: '2rem' }}>
                            Search - Coming Soon
                          </div>
                        }
                      />
                      <Route path="/about" element={<About />} />
                      <Route path="/test-posts" element={<TestPosts />} />
                      <Route
                        path="*"
                        element={
                          <div style={{ padding: '2rem' }}>
                            404 - Page Not Found
                          </div>
                        }
                      />
                    </Routes>
                  </Layout>
                }
              />

              {/* Auth Routes (no layout) */}
              <Route path="/login" element={<Login />} />

              {/* Admin Routes (protected) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/posts/new"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/posts/:id/edit"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeContextProvider>
    </HelmetProvider>
  );
}

export default App;
