import {
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { postsService } from '../../services/posts';
import TagSelector from './TagSelector';

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
        // Fallback categories
        //  if API fails
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
    console.log(
      'PostSettings - post.tags:',
      post.tags,
      'type:',
      typeof post.tags
    );

    if (post.tags) {
      let parsedTags = [];

      if (typeof post.tags === 'string') {
        // If tags is a string, split by comma
        parsedTags = post.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      } else if (Array.isArray(post.tags)) {
        // If tags is already an array, process each element safely
        parsedTags = post.tags
          .filter(tag => tag != null) // Remove null/undefined
          .map(tag => {
            // Handle different tag formats (string, object with name property, etc.)
            if (typeof tag === 'string') {
              return tag.trim();
            } else if (tag && typeof tag === 'object' && tag.name) {
              return tag.name.trim();
            }
            return String(tag).trim(); // Convert to string as fallback
          })
          .filter(tag => tag.length > 0);
      }

      console.log('PostSettings - parsed tags:', parsedTags);
      setTags(parsedTags);
    } else {
      setTags([]);
    }
  }, [post.tags]);

  // Handle category change
  const handleCategoryChange = event => {
    handleFieldChange('category', event.target.value);
  };

  // Handle tags change for TagSelector component
  const handleTagsChange = newTags => {
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

        <TagSelector selectedTags={tags} onTagsChange={handleTagsChange} />
      </Stack>
    </Box>
  );
};

export default PostSettings;
