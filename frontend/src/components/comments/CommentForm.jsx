import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';

const CommentForm = ({ onSubmit, submitting, sx }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Comment is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Comment must be at least 10 characters long';
    }

    // Website validation (optional)
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        'Please enter a valid URL (including http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    const result = await onSubmit(formData);

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        website: '',
        content: '',
      });
      setSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={sx}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Leave a Comment
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your comment has been submitted successfully! It will be visible after
          moderation.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item size={12} sm={6}>
          <TextField
            fullWidth
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={submitting}
            size="small"
          />
        </Grid>

        <Grid item size={12} sm={6}>
          <TextField
            fullWidth
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={submitting}
            size="small"
          />
        </Grid>

        <Grid item size={12} sm={6}>
          <TextField
            fullWidth
            label="Website (optional)"
            name="website"
            value={formData.website}
            onChange={handleChange}
            error={!!errors.website}
            helperText={errors.website || 'Include http:// or https://'}
            disabled={submitting}
            size="small"
          />
        </Grid>

        <Grid item size={12} sm={6}>
          <TextField
            fullWidth
            label="Comment *"
            name="content"
            multiline
            rows={4}
            value={formData.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content || 'Share your thoughts...'}
            disabled={submitting}
            placeholder="What are your thoughts on this post?"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
              disabled={submitting}
              sx={{
                minWidth: 120,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {submitting ? 'Submitting...' : 'Post Comment'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          * Required fields. Your email will not be published. Comments are
          moderated and will appear after approval.
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentForm;
