import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { commentService } from '../../services/comment';

const CommentsAdmin = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    type: 'success',
    message: '',
  });

  const showAlert = useCallback((type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(
      () => setAlert({ show: false, type: 'success', message: '' }),
      5000
    );
  }, []);
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading comments...'); // Debug log
      const response = await commentService.getComments();
      console.log('Raw response:', response); // Debug log

      // Extract comments array from response
      let commentsData = [];

      // Check if response has comments property (API format: {comments: [], total, limit, offset})
      if (response?.comments && Array.isArray(response.comments)) {
        commentsData = response.comments;
        console.log('Using response.comments');
      }
      // Check if response is directly an array
      else if (Array.isArray(response)) {
        commentsData = response;
        console.log('Using response as array');
      }
      // Check if response has data property with comments
      else if (
        response?.data?.comments &&
        Array.isArray(response.data.comments)
      ) {
        commentsData = response.data.comments;
        console.log('Using response.data.comments');
      }
      // Check if response.data is directly an array
      else if (response?.data && Array.isArray(response.data)) {
        commentsData = response.data;
        console.log('Using response.data as array');
      }

      console.log(
        'Final comments data:',
        commentsData,
        'Length:',
        commentsData.length
      ); // Debug log
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      showAlert('error', 'Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleApprove = async commentId => {
    try {
      setActionLoading(commentId);
      await commentService.approveComment(commentId);
      showAlert('success', 'Comment approved successfully');
      loadComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      showAlert('error', 'Failed to approve comment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async commentId => {
    try {
      setActionLoading(commentId);
      await commentService.rejectComment(commentId);
      showAlert('success', 'Comment rejected successfully');
      loadComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      showAlert('error', 'Failed to reject comment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async commentId => {
    if (
      window.confirm(
        'Are you sure you want to delete this comment? This action cannot be undone.'
      )
    ) {
      try {
        setActionLoading(commentId);
        await commentService.deleteComment(commentId);
        showAlert('success', 'Comment deleted successfully');
        loadComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        showAlert('error', 'Failed to delete comment');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleViewComment = comment => {
    setSelectedComment(comment);
    setDialogOpen(true);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAvatarInitials = name => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
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
              <MessageIcon color="primary" />
              <Typography variant="h6">Comment Moderation</Typography>
            </Box>
            <Button variant="outlined" onClick={loadComments}>
              Refresh
            </Button>
          </Box>

          {alert.show && (
            <Alert severity={alert.type} sx={{ mb: 3 }}>
              {alert.message}
            </Alert>
          )}

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Author</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Post</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <TableRow key={comment.id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'primary.main',
                            }}
                          >
                            {getAvatarInitials(comment.name)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {comment.name}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <EmailIcon
                                sx={{ fontSize: 12, color: 'text.secondary' }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {comment.email}
                              </Typography>
                            </Box>
                            {comment.website && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <WebsiteIcon
                                  sx={{
                                    fontSize: 12,
                                    color: 'text.secondary',
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {comment.website}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {comment.content}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {comment.post?.title || 'Unknown Post'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={comment.status}
                          color={getStatusColor(comment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(comment.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewComment(comment)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>

                          {comment.status === 'pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleApprove(comment.id)}
                                  disabled={actionLoading === comment.id}
                                >
                                  {actionLoading === comment.id ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <ApproveIcon />
                                  )}
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleReject(comment.id)}
                                  disabled={actionLoading === comment.id}
                                >
                                  {actionLoading === comment.id ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <RejectIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(comment.id)}
                              disabled={actionLoading === comment.id}
                            >
                              {actionLoading === comment.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" sx={{ py: 4 }}>
                        No comments found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Comment Details</DialogTitle>
        <DialogContent>
          {selectedComment && (
            <Box sx={{ pt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                  {getAvatarInitials(selectedComment.name)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedComment.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedComment.email}
                  </Typography>
                  {selectedComment.website && (
                    <Typography variant="body2" color="text.secondary">
                      Website: {selectedComment.website}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={selectedComment.status}
                    color={getStatusColor(selectedComment.status)}
                  />
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {selectedComment.content}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Posted on: {formatDate(selectedComment.created_at)}
              </Typography>

              {selectedComment.post && (
                <Typography variant="body2" color="text.secondary">
                  Post: {selectedComment.post.title}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedComment?.status === 'pending' && (
            <>
              <Button
                onClick={() => {
                  handleApprove(selectedComment.id);
                  setDialogOpen(false);
                }}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  handleReject(selectedComment.id);
                  setDialogOpen(false);
                }}
                color="error"
                variant="outlined"
              >
                Reject
              </Button>
            </>
          )}
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommentsAdmin;
