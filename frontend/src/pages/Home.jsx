import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
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
        <title>Cesar Menegatti - Blog Pessoal</title>
        <meta
          name="description"
          content="A modern blog focused on technology, design, and innovation. Sharing insights and stories that matter."
        />
      </Helmet>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Bem-vindo ao meu blog pessoal.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.5,
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            Descubra insights de tecnologia, design e inovação que moldam nosso
            mundo digital.
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
              fontSize: { xs: '1rem', sm: '1.1rem' },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.2, sm: 1.5 },
            }}
          >
            Explore Todos os Posts
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
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              Posts em Destaques
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {featuredPosts.slice(0, 3).map(post => (
                <Grid item size={{ xs: 12, sm: 12, md: 12 }} key={post.id}>
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
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Posts Recentes
              </Typography>
              <Button
                component={Link}
                to="/blog"
                endIcon={<ArrowForward />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  alignSelf: { xs: 'flex-start', sm: 'auto' },
                }}
              >
                Ver Todos
              </Button>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {recentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </Box>
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
            Fique Atualizado
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
            Inscreva-se na nossa newsletter e receba os últimos posts
            diretamente na sua caixa de entrada.
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
            Inscreva-se
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home;
