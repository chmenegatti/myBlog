import { TextField, Stack, Box } from '@mui/material';

const PostBasicFields = ({ post, handleFieldChange }) => {
  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Title"
        value={post.title}
        onChange={e => handleFieldChange('title', e.target.value)}
        required
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '1.25rem',
            fontWeight: 500,
          },
        }}
      />

      <TextField
        fullWidth
        label="Slug"
        value={post.slug}
        onChange={e => handleFieldChange('slug', e.target.value)}
        required
        helperText="URL-friendly version (auto-generated from title, but you can edit it)"
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, color: 'text.secondary' }}>/blog/</Box>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Excerpt"
        value={post.excerpt}
        onChange={e => handleFieldChange('excerpt', e.target.value)}
        multiline
        rows={3}
        helperText="Brief description of the post"
      />
    </Stack>
  );
};

export default PostBasicFields;
