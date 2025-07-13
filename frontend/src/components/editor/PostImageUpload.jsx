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
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
        Featured Image
      </Typography>

      {post.featured_img ? (
        <Card sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            sx={{
              height: 160,
              objectFit: 'cover',
            }}
            image={post.featured_img}
            alt="Featured image preview"
          />
          <Box
            sx={{
              p: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Current featured image
            </Typography>
            <IconButton onClick={handleRemoveImage} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Card>
      ) : null}

      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            startIcon={
              uploading ? <CircularProgress size={16} /> : <UploadIcon />
            }
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            size="small"
            fullWidth
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Or enter image URL"
          value={post.featured_img}
          onChange={e => handleFieldChange('featured_img', e.target.value)}
          size="small"
          helperText="You can upload an image or paste a URL"
        />
      </Stack>
    </Box>
  );
};

export default PostImageUpload;
