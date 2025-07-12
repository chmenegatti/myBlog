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
import { formatDate, getImageUrl } from '../../utils/helpers';

const PostCard = ({ post, featured = false }) => {
  const theme = useTheme();

  if (!post) return null;

  return (
    <Card
      component={Link}
      to={`/blog/${post.slug}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        cursor: 'pointer',
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: featured ? 200 : 160,
          objectFit: 'cover',
        }}
        image={getImageUrl(post.featured_img)}
        alt={post.title}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        {/* Category */}
        {post.category && (
          <Chip
            label={post.category.name}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mb: 1.5,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 500,
            }}
          />
        )}

        {/* Title */}
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
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.title}
        </Typography>

        {/* Excerpt */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
          }}
        >
          {post.excerpt}
        </Typography>

        {/* Author and Date */}
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
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              {post.author?.name}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            {formatDate(post.created_at)}
          </Typography>
        </Box>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
            {post.tags.slice(0, 3).map(tag => (
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
