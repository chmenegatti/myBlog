import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Fab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Article as PostsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import { postsService } from '../services/posts';
import { commentService } from '../services/comment';
import CommentsAdmin from '../components/admin/CommentsAdmin';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    pendingComments: 0,
    approvedComments: 0,
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
    loadCommentStats();
  }, []);

  const loadPosts = async () => {
    try {
      console.log('Loading posts...');
      const response = await postsService.getAdminPosts();
      console.log('Raw response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));

      // The mock returns { data: posts[], total, page, limit, totalPages }
      // The real API should return { data: posts[] } or just posts[]
      let postsData = [];

      if (Array.isArray(response)) {
        // Direct array response
        console.log('Response is direct array');
        postsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Response has data property with array
        console.log('Response has data property with array');
        postsData = response.data;
      } else if (response.posts && Array.isArray(response.posts)) {
        // Response has posts property with array
        console.log('Response has posts property with array');
        postsData = response.posts;
      } else {
        console.log('Could not extract posts array from response:', response);
      }

      console.log('Processed posts data:', postsData);
      console.log('Posts data length:', postsData.length);
      setPosts(postsData);

      // Calculate stats with safe fallback
      if (Array.isArray(postsData)) {
        const published = postsData.filter(
          post => post.status === 'published'
        ).length;
        const drafts = postsData.filter(post => post.status === 'draft').length;

        setStats(prevStats => ({
          ...prevStats,
          totalPosts: postsData.length,
          publishedPosts: published,
          draftPosts: drafts,
        }));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // Set empty array on error to prevent crashes
      setPosts([]);
      setStats({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
      });
    }
  };

  const loadCommentStats = async () => {
    try {
      console.log('Loading comment stats...'); // Debug log
      const response = await commentService.getComments();
      console.log('Comment stats response:', response); // Debug log

      // Handle different response formats - API returns {comments: [], total, limit, offset}
      let comments = [];
      if (Array.isArray(response)) {
        comments = response;
        console.log('Using response as array');
      } else if (response?.comments && Array.isArray(response.comments)) {
        comments = response.comments;
        console.log('Using response.comments');
      } else if (
        response?.data?.comments &&
        Array.isArray(response.data.comments)
      ) {
        comments = response.data.comments;
        console.log('Using response.data.comments');
      } else if (response?.data && Array.isArray(response.data)) {
        comments = response.data;
        console.log('Using response.data as array');
      }

      console.log(
        'Final comments for stats:',
        comments,
        'Length:',
        comments.length
      );

      const pending = comments.filter(
        comment => comment.status === 'pending'
      ).length;
      const approved = comments.filter(
        comment => comment.status === 'approved'
      ).length;

      console.log('Comment stats calculated:', {
        total: comments.length,
        pending,
        approved,
      });

      setStats(prev => ({
        ...prev,
        totalComments: comments.length,
        pendingComments: pending,
        approvedComments: approved,
      }));
    } catch (error) {
      console.error('Error loading comment stats:', error);
    }
  };

  const handleDeletePost = async id => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsService.deletePost(id);
        loadPosts(); // Reload posts after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MyBlog</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Welcome back, {user?.name || user?.email}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Total Posts
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {stats.totalPosts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Published
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 600, color: 'success.main' }}
                >
                  {stats.publishedPosts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Comments
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 600, color: 'info.main' }}
                >
                  {stats.totalComments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Pending
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 600, color: 'warning.main' }}
                >
                  {stats.pendingComments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Posts Management Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PostsIcon color="primary" />
                <Typography variant="h6">Manage Posts</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/posts/new')}
              >
                New Post
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500 }}
                          >
                            {post.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            {post.excerpt}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={post.status}
                            color={getStatusColor(post.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{formatDate(post.created_at)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            title="View Post"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/admin/posts/${post.id}/edit`)
                            }
                            title="Edit Post"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete Post"
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" sx={{ py: 4 }}>
                          No posts found. Create your first post!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Comments Moderation Section */}
        <CommentsAdmin />

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add post"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => navigate('/admin/posts/new')}
        >
          <AddIcon />
        </Fab>
      </Container>
    </>
  );
};

export default AdminDashboard;
