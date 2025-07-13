import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Box,
  Alert,
  Grid,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { postsService } from '../services/posts';
import { imageService } from '../services/image';
import '../styles/editor.css';

// Import new components
import PostStatsHeader from '../components/editor/PostStatsHeader';
import PostBasicFields from '../components/editor/PostBasicFields';
import PostContentEditor from '../components/editor/PostContentEditor';
import PostSettings from '../components/editor/PostSettings';
import PostImageUpload from '../components/editor/PostImageUpload';
import PostActionBar from '../components/editor/PostActionBar';

const PostEditor = () => {
  const [post, setPost] = useState({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    category: '',
    tags: '',
    featured_img: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveTimer = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const response = await postsService.getPostById(id);

        if (response.data) {
          setPost(response.data);
          const words = calculateWordCount(response.data.content);
          setWordCount(words);
          setReadingTime(calculateReadingTime(words));
        } else {
          setError('No post data received');
        }
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
    if (!title) return '';

    return (
      title
        .toLowerCase()
        // Replace common accented characters
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Replace spaces and special characters with hyphens
        .replace(/[^a-z0-9]+/g, '-')
        // Remove leading and trailing hyphens
        .replace(/^-+|-+$/g, '') || 'untitled'
    );
  };

  const calculateWordCount = content => {
    if (!content) return 0;
    const text = content.replace(/[#*`_~]/g, '').trim();
    return text ? text.split(/\s+/).length : 0;
  };

  const calculateReadingTime = wordCount => {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200);
  };

  const autoSavePost = async () => {
    if (!isEdit || !post.title.trim()) return;

    try {
      const postData = { ...post, status: 'draft' };
      await postsService.updatePost(id, postData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleFieldChange = (field, value) => {
    setPost(prev => {
      const updated = {
        ...prev,
        [field]: value,
        // Generate slug automatically whenever title changes
        ...(field === 'title' && { slug: generateSlug(value) }),
      };

      // Update word count and reading time when content changes
      if (field === 'content') {
        const words = calculateWordCount(value);
        setWordCount(words);
        setReadingTime(calculateReadingTime(words));
      }

      return updated;
    });

    // Auto-save after 2 seconds of inactivity
    if (autoSave && isEdit) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(autoSavePost, 2000);
    }
  };

  const handleImageUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await imageService.uploadImage(file, 'Featured image');
      setPost(prev => ({
        ...prev,
        featured_img: response.url,
      }));
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPost(prev => ({
      ...prev,
      featured_img: '',
    }));
  };

  const handleSubmit = async status => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const postData = { ...post, status };
      console.log('Submitting post with status:', status);
      console.log('Full post data:', postData);

      if (isEdit) {
        const response = await postsService.updatePost(id, postData);
        console.log('Update response:', response);
        setSuccess(
          `Post ${status === 'published' ? 'published' : 'saved'} successfully!`
        );

        // Update local state to reflect the new status
        setPost(prev => ({ ...prev, status }));
      } else {
        const response = await postsService.createPost(postData);
        console.log('Create response:', response);
        setSuccess(
          `Post ${status === 'published' ? 'published' : 'created'} successfully!`
        );
        setTimeout(() => navigate('/admin'), 1500);
      }
    } catch (err) {
      console.error('Submit error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit && !post.id) {
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <PostStatsHeader
          isEdit={isEdit}
          wordCount={wordCount}
          readingTime={readingTime}
          lastSaved={lastSaved}
          autoSave={autoSave}
          setAutoSave={setAutoSave}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <Paper sx={{ overflow: 'hidden', boxShadow: 3 }}>
          {error && (
            <Alert severity="error" sx={{ m: 3, mb: 0 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ m: 3, mb: 0 }}>
              {success}
            </Alert>
          )}

          {/* Layout reorganizado: Linha 1 = Conteúdo Principal, Linha 2 = Settings + Image */}
          <Grid container sx={{ minHeight: '100vh' }} spacing={0}>
            {/* PRIMEIRA LINHA - Conteúdo Principal (100% largura) */}
            <Grid
              item
              xs={12}
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                minHeight: '70vh',
              }}
            >
              <Stack spacing={3}>
                <PostBasicFields
                  post={post}
                  handleFieldChange={handleFieldChange}
                />
                <Divider />
                <PostContentEditor
                  post={post}
                  handleFieldChange={handleFieldChange}
                  activeTab={activeTab}
                />
              </Stack>
            </Grid>

            {/* SEGUNDA LINHA - Settings (50% largura) */}
            <Grid
              item
              size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
              sx={{
                p: 3,
                minHeight: '30vh',
              }}
            >
              <PostSettings post={post} handleFieldChange={handleFieldChange} />
            </Grid>

            {/* SEGUNDA LINHA - Image Upload (50% largura) */}
            <Grid
              item
              size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
              sx={{
                p: 3,
                minHeight: '20vh',
              }}
            >
              <PostImageUpload
                post={post}
                uploading={uploading}
                handleFieldChange={handleFieldChange}
                handleImageUpload={handleImageUpload}
                handleRemoveImage={handleRemoveImage}
              />
            </Grid>
          </Grid>

          <PostActionBar loading={loading} handleSubmit={handleSubmit} />
        </Paper>
      </Container>
    </>
  );
};

export default PostEditor;
