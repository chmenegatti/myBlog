import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, Preview as PreviewIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MDEditor from '@uiw/react-md-editor';
import { postsService } from '../services/posts';
import '../styles/editor.css';

const PostEditor = () => {
  const [post, setPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    category: '',
    tags: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const response = await postsService.getPostById(id);
        setPost(response.data);
      } catch (error) {
        setError('Failed to load post');
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      loadPost();
    }
  }, [id, isEdit]);

  const generateSlug = title => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleFieldChange = (field, value) => {
    setPost(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !isEdit && { slug: generateSlug(value) }),
    }));
  };

  const handleSubmit = async status => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const postData = { ...post, status };

      if (isEdit) {
        await postsService.updatePost(id, postData);
        setSuccess('Post updated successfully!');
      } else {
        await postsService.createPost(postData);
        setSuccess('Post created successfully!');
        setTimeout(() => navigate('/admin'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Post' : 'New Post'} - MyBlog Admin</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Title"
                value={post.title}
                onChange={e => handleFieldChange('title', e.target.value)}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                fullWidth
                label="Slug"
                value={post.slug}
                onChange={e => handleFieldChange('slug', e.target.value)}
                sx={{ mb: 3 }}
                helperText="URL-friendly version of the title"
                required
              />

              <TextField
                fullWidth
                label="Excerpt"
                value={post.excerpt}
                onChange={e => handleFieldChange('excerpt', e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 3 }}
                helperText="Brief description of the post"
              />

              <Typography variant="h6" sx={{ mb: 2 }}>
                Content
              </Typography>
              <Box sx={{ mb: 3 }}>
                <MDEditor
                  value={post.content}
                  onChange={value => handleFieldChange('content', value || '')}
                  height={400}
                  preview="edit"
                  data-color-mode="light"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={post.status}
                  onChange={e => handleFieldChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Category"
                value={post.category}
                onChange={e => handleFieldChange('category', e.target.value)}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Tags"
                value={post.tags}
                onChange={e => handleFieldChange('tags', e.target.value)}
                sx={{ mb: 3 }}
                helperText="Comma-separated tags"
              />

              <TextField
                fullWidth
                label="Featured Image URL"
                value={post.featured_image}
                onChange={e =>
                  handleFieldChange('featured_image', e.target.value)
                }
                sx={{ mb: 3 }}
              />

              <Typography variant="h6" sx={{ mb: 2 }}>
                SEO Settings
              </Typography>

              <TextField
                fullWidth
                label="Meta Title"
                value={post.meta_title}
                onChange={e => handleFieldChange('meta_title', e.target.value)}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Meta Description"
                value={post.meta_description}
                onChange={e =>
                  handleFieldChange('meta_description', e.target.value)
                }
                multiline
                rows={3}
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              startIcon={<SaveIcon />}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSubmit('published')}
              disabled={loading}
              startIcon={<PreviewIcon />}
            >
              {loading ? <CircularProgress size={20} /> : 'Publish'}
            </Button>
            <Button variant="text" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default PostEditor;
