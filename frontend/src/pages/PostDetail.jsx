import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
// Don't import the default github.css to avoid conflicts
import '../styles/blog-content.css';
import { formatDate, getImageUrl } from '../utils/helpers';
import postsService from '../services/posts';
import CommentsSection from '../components/comments/CommentsSection';
import { useTheme } from '../hooks/useTheme';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsService.getPostBySlug(slug);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
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

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Post not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blog')}
          variant="outlined"
        >
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - MyBlog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blog')}
          sx={{ mb: 4 }}
        >
          Back to Blog
        </Button>

        {/* Featured Image */}
        {post.featured_image && (
          <Box
            sx={{
              width: '100%',
              height: { xs: 250, sm: 350, md: 400 },
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <img
              src={getImageUrl(post.featured_image)}
              alt={post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {/* Category */}
        {post.category && (
          <Chip
            label={post.category.name}
            sx={{
              mb: 2,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 500,
            }}
          />
        )}

        {/* Title */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: 'text.primary',
            lineHeight: 1.2,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          {post.title}
        </Typography>

        {/* Author and Date */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={getImageUrl(post.author?.avatar)}
              alt={post.author?.name}
              sx={{ width: 32, height: 32 }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              By {post.author?.name}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatDate(post.created_at)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Excerpt */}
        {post.excerpt && (
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 4,
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            {post.excerpt}
          </Typography>
        )}

        {/* Content */}
        <Box
          className="blog-content"
          data-theme={isDarkMode ? 'dark' : 'light'}
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 4,
              mb: 2,
              fontWeight: 600,
              color: 'text.primary',
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.75rem' },
            '& h3': { fontSize: '1.5rem' },
            '& h4': { fontSize: '1.25rem' },
            '& p': {
              mb: 2,
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'text.primary',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              my: 2,
              display: 'block',
              margin: '16px auto',
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              ml: 0,
              my: 3,
              fontStyle: 'italic',
              color: 'text.secondary',
              py: 2,
              borderRadius: '0 4px 4px 0',
            },
            '& pre': {
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.9rem',
              my: 2,
            },
            '& code': {
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              fontSize: '0.9em',
              fontFamily: 'monospace',
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3,
              '& li': {
                mb: 1,
                lineHeight: 1.6,
                color: 'text.primary',
              },
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              my: 3,
              borderRadius: 1,
              overflow: 'hidden',
              '& th, & td': {
                p: 1.5,
                textAlign: 'left',
              },
              '& th': {
                fontWeight: 600,
              },
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                color: 'primary.dark',
                textDecoration: 'underline',
              },
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    margin: '16px auto',
                    display: 'block',
                  }}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </Box>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  variant="outlined"
                  sx={{
                    color: 'text.secondary',
                    borderColor: 'divider',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Comments Section */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '2px solid',
            borderColor: 'divider',
          }}
        >
          <CommentsSection postId={post.id} />
        </Box>
      </Container>
    </>
  );
};

export default PostDetail;
