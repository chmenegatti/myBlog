import { Box, Typography, Avatar, Paper, Chip, Link } from '@mui/material';
import { formatDate } from '../../utils/helpers';

const CommentItem = ({ comment }) => {
  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending Moderation';
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 2,
        backgroundColor: comment.status === 'rejected' ? 'grey.50' : 'white',
        opacity: comment.status === 'rejected' ? 0.7 : 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: 'primary.main',
            fontSize: '1rem',
          }}
        >
          {comment.name?.charAt(0).toUpperCase()}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.website ? (
                <Link
                  href={comment.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="hover"
                >
                  {comment.name}
                </Link>
              ) : (
                comment.name
              )}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {formatDate(comment.created_at)}
            </Typography>

            {/* Status Badge */}
            <Chip
              label={getStatusText(comment.status)}
              size="small"
              color={getStatusColor(comment.status)}
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </Box>

          {/* Comment Content */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {comment.content}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const CommentList = ({ comments }) => {
  // Filter to show only approved comments to regular users
  const visibleComments = comments.filter(
    comment => comment.status === 'approved'
  );

  if (visibleComments.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {visibleComments.length} Comment
        {visibleComments.length !== 1 ? 's' : ''}
      </Typography>

      {visibleComments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
};

export default CommentList;
