import { Box, Typography, Divider } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';

const PostContentEditor = ({ post, handleFieldChange, activeTab }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AutoAwesomeIcon />
        Content Editor
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <MDEditor
          value={post.content}
          onChange={value => handleFieldChange('content', value || '')}
          height={600}
          preview={activeTab === 0 ? 'edit' : 'preview'}
          data-color-mode="light"
          visibleDragBar={false}
        />
      </Box>
    </Box>
  );
};

export default PostContentEditor;
