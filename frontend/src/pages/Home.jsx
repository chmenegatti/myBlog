import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PostCard from '../components/blog/PostCard';
import postsService from '../services/posts';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const [featured, recent] = await Promise.all([
          postsService.getFeaturedPosts(),
          postsService.getAllPosts(1, 6),
        ]);

        setFeaturedPosts(featured.data || []);
        setRecentPosts(recent.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>MyBlog - Modern Blog Platform</title>
        <meta
          name="description"
          content="A modern blog focused on technology, design, and innovation. Sharing insights and stories that matter."
        />
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome to MyBlog
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Discover insights on technology, design, and innovation that shape
            our digital world
          </Typography>
          <Button
            component={Link}
            to="/blog"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
            }}
          >
            Explore All Posts
          </Button>
        </Box>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                mb: 4,
                textAlign: 'center',
              }}
            >
              Featured Posts
            </Typography>
            <Grid container spacing={4}>
              {featuredPosts.slice(0, 3).map(post => (
                <Grid item xs={12} md={4} key={post.id}>
                  <PostCard post={post} featured />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                }}
              >
                Recent Posts
              </Typography>
              <Button
                component={Link}
                to="/blog"
                endIcon={<ArrowForward />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                View All
              </Button>
            </Box>
            <Grid container spacing={3}>
              {recentPosts.map(post => (
                <Grid item xs={12} sm={6} lg={4} key={post.id}>
                  <PostCard post={post} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: 'action.hover',
            borderRadius: 3,
            mt: 8,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Stay Updated
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            Subscribe to our newsletter and get the latest posts delivered
            directly to your inbox.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
            }}
            onClick={() => {
              document
                .querySelector('footer')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Subscribe Now
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home;
