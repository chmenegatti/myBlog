import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import { postsService } from '../services/posts';
import { formatDate } from '../utils/helpers';

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'all'
  const [categoryStats, setCategoryStats] = useState({});

  const itemsPerPage = 12;
  const postsPerCategoryPreview = 3;

  // Load categories and posts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, postsResponse] = await Promise.all([
          postsService.getCategories(),
          postsService.getAllPosts(1, 100), // Get more posts for better filtering
        ]);

        // Categories API returns array directly, not wrapped in data property
        const categoriesData = Array.isArray(categoriesResponse)
          ? categoriesResponse
          : categoriesResponse.data || [];
        const postsData = postsResponse.data || [];

        setCategories(categoriesData);
        setPosts(postsData);

        // Calculate category statistics
        const stats = {};
        categoriesData?.forEach(category => {
          stats[category.slug] =
            postsData?.filter(post => {
              // Check if post has categories array (new API format)
              if (post.categories && post.categories.length > 0) {
                return post.categories.some(cat => cat.slug === category.slug);
              }
              // Fallback to single category (old format or mock data)
              return post.category?.slug === category.slug;
            }).length || 0;
        });
        setCategoryStats(stats);
      } catch (err) {
        setError('Erro ao carregar categorias e posts');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => {
        // Check if post has categories array (new API format)
        if (post.categories && post.categories.length > 0) {
          return post.categories.some(cat => cat.slug === selectedCategory);
        }
        // Fallback to single category (old format or mock data)
        return post.category?.slug === selectedCategory;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.tags?.some(tag => tag.name.toLowerCase().includes(term))
      );
    }

    // Sort posts
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case 'oldest':
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
    setPage(1); // Reset to first page when filters change
  }, [posts, selectedCategory, searchTerm, sortBy]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (page > 1) params.set('page', page.toString());
    setSearchParams(params);
  }, [selectedCategory, searchTerm, sortBy, page, setSearchParams]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = event => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
    if (newValue === 'overview') {
      setSelectedCategory('');
      setSearchTerm('');
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('newest');
    setViewMode('overview');
  };

  // Get posts for current page
  const getCurrentPagePosts = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // Get posts grouped by category for overview
  const getPostsByCategory = () => {
    const grouped = {};
    categories.forEach(category => {
      const categoryPosts = posts
        .filter(post => {
          // Check if post has categories array (new API format)
          if (post.categories && post.categories.length > 0) {
            return post.categories.some(cat => cat.slug === category.slug);
          }
          // Fallback to single category (old format or mock data)
          return post.category?.slug === category.slug;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, postsPerCategoryPreview);

      if (categoryPosts.length > 0) {
        grouped[category.slug] = {
          category,
          posts: categoryPosts,
          totalPosts: categoryStats[category.slug] || 0,
        };
      }
    });
    return grouped;
  };

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando categorias...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          <CategoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Categorias
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Explore nossos posts organizados por categoria
        </Typography>

        {/* View Mode Tabs */}
        <Tabs
          value={viewMode}
          onChange={handleViewModeChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Visão Geral" value="overview" />
          <Tab label="Todos os Posts" value="all" />
        </Tabs>
      </Box>

      {/* Filters - Only show in 'all' mode */}
      {viewMode === 'all' && (
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <FilterIcon sx={{ mr: 1 }} />
            Filtros
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar posts"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Categoria"
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">Todas as categorias</MenuItem>
                  {categories?.map(category => (
                    <MenuItem key={category.slug} value={category.slug}>
                      {category.name} ({categoryStats[category.slug] || 0})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  label="Ordenar por"
                  onChange={handleSortChange}
                >
                  <MenuItem value="newest">Mais recentes</MenuItem>
                  <MenuItem value="oldest">Mais antigos</MenuItem>
                  <MenuItem value="title">Título (A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
                sx={{ height: '40px' }}
              >
                Limpar Filtros
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Content */}
      {viewMode === 'overview' ? (
        /* Overview Mode - Posts grouped by category */
        <Box>
          {Object.entries(getPostsByCategory()).map(([categorySlug, data]) => (
            <Box key={categorySlug} sx={{ mb: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {data.category.name}
                  <Chip
                    label={`${data.totalPosts} post${data.totalPosts !== 1 ? 's' : ''}`}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Typography>
                <Button
                  component={Link}
                  to={`/categories?category=${categorySlug}`}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Ver todos
                </Button>
              </Box>

              <Grid container spacing={3}>
                {data.posts.map(post => (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <PostCard post={post} />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mt: 4 }} />
            </Box>
          ))}
        </Box>
      ) : (
        /* All Posts Mode - Paginated list */
        <Box>
          {/* Results summary */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Mostrando {getCurrentPagePosts().length} de {filteredPosts.length}{' '}
            post{filteredPosts.length !== 1 ? 's' : ''}
            {selectedCategory && (
              <>
                {' '}
                na categoria{' '}
                <strong>
                  {categories.find(c => c.slug === selectedCategory)?.name}
                </strong>
              </>
            )}
            {searchTerm && (
              <>
                {' '}
                para "<strong>{searchTerm}</strong>"
              </>
            )}
          </Typography>

          {filteredPosts.length === 0 ? (
            <Alert severity="info">
              Nenhum post encontrado com os filtros atuais.
            </Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {getCurrentPagePosts().map(post => (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <PostCard post={post} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Container>
  );
};

// PostCard Component
const PostCard = ({ post }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme => theme.shadows[8],
        },
      }}
    >
      {(post.featured_img || post.image_url || post.featured_image) && (
        <CardMedia
          component="img"
          height="200"
          image={post.featured_img || post.image_url || post.featured_image}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={
              post.categories && post.categories.length > 0
                ? post.categories[0].name
                : post.category?.name || 'Sem categoria'
            }
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {post.excerpt}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarIcon
            sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(post.created_at)}
          </Typography>
        </Box>
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {post.tags.slice(0, 3).map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {post.tags.length > 3 && (
              <Chip
                label={`+${post.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/blog/${post.slug}`}
          size="small"
          endIcon={<ArrowForwardIcon />}
          sx={{ textTransform: 'none' }}
        >
          Ler mais
        </Button>
      </CardActions>
    </Card>
  );
};

export default Categories;
