import { Box, Stack, Button, LinearProgress } from '@mui/material';
import { Save as SaveIcon, Preview as PreviewIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PostActionBar = ({ loading, handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 3,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>{loading && <LinearProgress sx={{ width: 200, mr: 2 }} />}</Box>

        <Stack direction="row" spacing={2}>
          <Button variant="text" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            startIcon={<SaveIcon />}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit('published')}
            disabled={loading}
            startIcon={<PreviewIcon />}
            size="large"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PostActionBar;
