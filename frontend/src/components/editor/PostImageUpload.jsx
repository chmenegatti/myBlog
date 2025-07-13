import { useRef } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const PostImageUpload = ({
  post,
  uploading,
  handleFieldChange,
  handleImageUpload,
  handleRemoveImage,
}) => {
  const fileInputRef = useRef(null);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ImageIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Featured Image
        </Typography>
      </Box>

      {post.featured_img ? (
        <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            sx={{
              height: 120,
              objectFit: 'cover',
            }}
            image={post.featured_img}
            alt="Featured image preview"
          />
          <Box
            sx={{
              p: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Current featured image
            </Typography>
            <IconButton
              onClick={handleRemoveImage}
              color="error"
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Card>
      ) : (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            backgroundColor: 'grey.50',
            mb: 2,
          }}
        >
          <ImageIcon sx={{ fontSize: 32, color: 'grey.400', mb: 0.5 }} />
          <Typography variant="caption" color="text.secondary" display="block">
            No image selected
          </Typography>
        </Box>
      )}

      <Stack spacing={1.5}>
        <Button
          variant="contained"
          startIcon={
            uploading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <UploadIcon />
            )
          }
          onClick={() => {
            const input = fileInputRef.current;
            if (input) input.click();
          }}
          disabled={uploading}
          size="medium"
          fullWidth
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>

        <TextField
          fullWidth
          label="Image URL"
          value={post.featured_img || ''}
          onChange={e => handleFieldChange('featured_img', e.target.value)}
          size="small"
          placeholder="https://example.com/image.jpg"
          helperText="Or paste an image URL"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </Stack>
    </Box>
  );
};

export default PostImageUpload;
