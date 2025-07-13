import {
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
} from '@mui/material';

const PostSettings = ({ post, handleFieldChange }) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Post Settings
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          value={post.status}
          onChange={e => handleFieldChange('status', e.target.value)}
          label="Status"
        >
          <MenuItem value="draft">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                }}
              />
              Draft
            </Box>
          </MenuItem>
          <MenuItem value="published">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                }}
              />
              Published
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Category"
        value={post.category}
        onChange={e => handleFieldChange('category', e.target.value)}
      />

      <TextField
        fullWidth
        label="Tags"
        value={post.tags}
        onChange={e => handleFieldChange('tags', e.target.value)}
        helperText="Comma-separated tags"
      />
    </Stack>
  );
};

export default PostSettings;
