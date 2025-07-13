import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import PostCard from '../components/blog/PostCard';
import postsService from '../services/posts';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const postsPerPage = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await postsService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;

      if (searchTerm) {
        response = await postsService.searchPosts(
          searchTerm,
          currentPage,
          postsPerPage
        );
      } else {
        response = await postsService.getAllPosts(
          currentPage,
          postsPerPage,
          selectedCategory
        );
      }

      setPosts(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / postsPerPage));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory, searchTerm]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setSelectedCategory('');
  };

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
        <title>Cesar Menegatti</title>
        <meta
          name="description"
          content="Explore our latest blog posts on technology, design, and innovation."
        />
      </Helmet>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Cabeçalho */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Blog
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.5,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            Explore nossos insights mais recentes sobre tecnologia, design e
            inovação
          </Typography>
        </Box>

        {/* Filtros */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, sm: 2 },
            mb: { xs: 3, sm: 4 },
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            alignItems: { md: 'center' },
          }}
        >
          <TextField
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              maxWidth: { md: 400 },
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: { xs: '100%', sm: '100%', md: 200 } }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
              sx={{
                '& .MuiSelect-select': {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category.id} value={category.slug}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Active Filters */}
        {(selectedCategory || searchTerm) && (
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Category: ${
                  categories.find(c => c.slug === selectedCategory)?.name ||
                  selectedCategory
                }`}
                onDelete={() => setSelectedCategory('')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* Posts Grid */}
        {loading ? (
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
        ) : (
          <>
            {posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {searchTerm || selectedCategory
                    ? 'No posts found for your search criteria.'
                    : 'No posts available at the moment.'}
                </Typography>
              </Box>
            ) : (
              <>
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
                    mb: { xs: 4, sm: 5, md: 6 },
                  }}
                >
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Blog;
