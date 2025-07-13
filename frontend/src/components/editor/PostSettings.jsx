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
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  Edit as EditIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { postsService } from '../../services/posts';

const PostSettings = ({ post, handleFieldChange }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [tags, setTags] = useState([]);

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await postsService.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback categories if API fails
        setCategories([
          { id: 1, name: 'Programming' },
          { id: 2, name: 'Tutorial' },
          { id: 3, name: 'Technology' },
          { id: 4, name: 'Web Development' },
          { id: 5, name: 'Backend' },
          { id: 6, name: 'Frontend' },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Parse tags from string to array when post.tags changes
  useEffect(() => {
    if (post.tags) {
      const parsedTags = post.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      setTags(parsedTags);
    } else {
      setTags([]);
    }
  }, [post.tags]);

  // Handle category change
  const handleCategoryChange = event => {
    handleFieldChange('category', event.target.value);
  };

  // Handle tags change (convert array back to comma-separated string)
  const handleTagsChange = (event, newTags) => {
    setTags(newTags);
    handleFieldChange('tags', newTags.join(', '));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EditIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Post Settings
        </Typography>
      </Box>

      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={post.status}
            onChange={e => handleFieldChange('status', e.target.value)}
            label="Status"
          >
            <MenuItem value="draft">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="Draft"
                  size="small"
                  color="warning"
                  sx={{ minWidth: 60, fontSize: '0.75rem' }}
                />
              </Box>
            </MenuItem>
            <MenuItem value="published">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="Published"
                  size="small"
                  color="success"
                  sx={{ minWidth: 60, fontSize: '0.75rem' }}
                />
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CategoryIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: 'text.secondary' }}
          >
            Organization
          </Typography>
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={post.category || ''}
            onChange={handleCategoryChange}
            label="Category"
            disabled={loadingCategories}
          >
            <MenuItem value="">
              <em>Select a category</em>
            </MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TagIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: 'text.secondary' }}
          >
            Tags
          </Typography>
        </Box>

        <Autocomplete
          multiple
          freeSolo
          value={tags}
          onChange={handleTagsChange}
          options={[]} // Empty options since we want free text input
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                color="primary"
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
                sx={{
                  fontSize: '0.75rem',
                  '& .MuiChip-deleteIcon': {
                    fontSize: '16px',
                  },
                }}
              />
            ))
          }
          renderInput={params => (
            <TextField
              {...params}
              size="small"
              placeholder="Type tags and press Enter"
              helperText="Press Enter to add tags"
            />
          )}
          sx={{
            '& .MuiAutocomplete-tag': {
              margin: '2px',
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default PostSettings;
