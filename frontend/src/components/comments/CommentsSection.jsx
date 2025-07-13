import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { commentService } from '../../services/comment';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Função para buscar comentários do post
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await commentService.getCommentsByPost(postId);
      setComments(response.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, fetchComments]);

  // Função para adicionar novo comentário
  const handleCommentSubmit = async commentData => {
    try {
      setSubmitting(true);
      setError(null);

      await commentService.createComment({
        ...commentData,
        post_id: postId,
      });

      // Recarregar comentários após enviar
      await fetchComments();

      return { success: true };
    } catch (err) {
      console.error('Error creating comment:', err);
      const errorMessage =
        err.response?.data?.error || 'Failed to submit comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Comments
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Comments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Formulário de comentário */}
      <CommentForm
        onSubmit={handleCommentSubmit}
        submitting={submitting}
        sx={{ mb: 4 }}
      />

      <Divider sx={{ my: 4 }} />

      {/* Lista de comentários */}
      <CommentList comments={comments} />

      {comments.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            No comments yet. Be the first to share your thoughts!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommentsSection;
