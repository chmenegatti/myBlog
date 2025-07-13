import {
  Box,
  Stack,
  Button,
  LinearProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PostActionBar = ({ loading, handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <>
      <Divider />
      <Box
        sx={{
          p: 3,
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {loading && (
          <LinearProgress
            sx={{
              mb: 2,
              borderRadius: 1,
              height: 4,
            }}
          />
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="Auto-save enabled"
              size="small"
              color="success"
              variant="outlined"
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin')}
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              startIcon={<SaveIcon />}
              color="secondary"
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSubmit('published')}
              disabled={loading}
              startIcon={<PublishIcon />}
              size="large"
              sx={{
                minWidth: 120,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
              }}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default PostActionBar;
