import {
  Box,
  TextField,
  Chip,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  IconButton,
  InputAdornment,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const TagSelector = ({ selectedTags = [], onTagsChange }) => {
  const [allTags, setAllTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        console.log('TagSelector - Fetching tags from /public/tags');
        const response = await api.get('/public/tags');
        console.log('TagSelector - Response:', response);
        const tags = response.data || [];
        console.log('TagSelector - Tags loaded:', tags.length, 'tags');
        setAllTags(tags);
        setFilteredTags(tags);
      } catch (error) {
        console.error('Error loading tags:', error);
        setAllTags([]);
        setFilteredTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Filter tags based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = allTags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(allTags);
    }
  }, [searchTerm, allTags]);

  // Handle tag selection
  const handleTagToggle = tag => {
    const isSelected = selectedTags.includes(tag.name);
    let newSelectedTags;

    if (isSelected) {
      newSelectedTags = selectedTags.filter(t => t !== tag.name);
    } else {
      newSelectedTags = [...selectedTags, tag.name];
    }

    onTagsChange(newSelectedTags);
  };

  // Handle input click to expand/collapse
  const handleInputClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box>
      {/* Input field with chips */}
      <TextField
        fullWidth
        size="small"
        placeholder={selectedTags.length > 0 ? '' : 'Click to select tags'}
        value=""
        onClick={handleInputClick}
        InputProps={{
          readOnly: true,
          style: { cursor: 'pointer' },
          startAdornment:
            selectedTags.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mr: 1 }}>
                {selectedTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    color="primary"
                    onDelete={() => handleTagToggle({ name: tag })}
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            ) : null,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleInputClick}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        helperText={`${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} selected`}
      />

      {/* Collapsible tag list */}
      <Collapse in={isExpanded}>
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            maxHeight: 300,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Search field */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Tags list */}
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : filteredTags.length > 0 ? (
              <List dense>
                {filteredTags.map(tag => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <ListItem key={tag.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleTagToggle(tag)}
                        dense
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Checkbox
                            edge="start"
                            checked={isSelected}
                            size="small"
                            color="primary"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <TagIcon
                                sx={{ fontSize: 16, color: 'text.secondary' }}
                              />
                              <Typography variant="body2">
                                {tag.name}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'No tags found' : 'No tags available'}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer with summary */}
          <Box
            sx={{
              p: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {filteredTags.length} tag
              {filteredTags.length !== 1 ? 's' : ''} available
            </Typography>
            <Typography variant="caption" color="primary">
              {selectedTags.length} selected
            </Typography>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default TagSelector;
