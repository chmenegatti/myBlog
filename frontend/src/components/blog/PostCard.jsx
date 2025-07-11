import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  formatDate,
  formatReadingTime,
  getImageUrl,
} from '../../utils/helpers';

const PostCard = ({ post, featured = false }) => {
  const theme = useTheme();

  if (!post) return null;

  const cardHeight = featured ? 400 : 320;
  const imageHeight = featured ? 200 : 160;

  return (
    <Card
      component={Link}
      to={`/blog/${post.slug}`}
      sx={{
        height: cardHeight,
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        cursor: 'pointer',
      }}
    >
      <CardMedia
        component="img"
        height={imageHeight}
        image={getImageUrl(post.featured_image)}
        alt={post.title}
        sx={{
          objectFit: 'cover',
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: featured ? 3 : 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          {post.category && (
            <Chip
              label={post.category.name}
              size="small"
              sx={{
                mb: 1,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        <Typography
          variant={featured ? 'h5' : 'h6'}
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: 'text.primary',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
          }}
        >
          {post.excerpt}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={getImageUrl(post.author?.avatar)}
              alt={post.author?.name}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {post.author?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatDate(post.created_at)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatReadingTime(post.reading_time)}
            </Typography>
          </Box>
        </Box>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
            {post.tags.slice(0, featured ? 4 : 3).map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  color: 'text.secondary',
                  borderColor: 'divider',
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
