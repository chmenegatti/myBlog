import {
  Box,
  Typography,
  Stack,
  Chip,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';

const PostStatsHeader = ({
  isEdit,
  wordCount,
  readingTime,
  lastSaved,
  autoSave,
  setAutoSave,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {isEdit ? 'Edit Post' : 'Create New Post'}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Chip
            icon={<ArticleIcon />}
            label={`${wordCount} words`}
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<ScheduleIcon />}
            label={`${readingTime} min read`}
            variant="outlined"
            size="small"
          />
          {lastSaved && (
            <Chip
              label={`Saved ${lastSaved.toLocaleTimeString()}`}
              color="success"
              variant="outlined"
              size="small"
            />
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={autoSave}
              onChange={e => setAutoSave(e.target.checked)}
              size="small"
            />
          }
          label="Auto-save"
        />

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          size="small"
        >
          <Tab icon={<EditIcon />} label="Edit" />
          <Tab icon={<VisibilityIcon />} label="Preview" />
        </Tabs>
      </Box>
    </Paper>
  );
};

export default PostStatsHeader;
