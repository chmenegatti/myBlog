import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  TextField,
  Button,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  ArrowUpward,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { newsletterService } from '../../services';

const Footer = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleSubscribe = async e => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    try {
      await newsletterService.subscribe(email);
      setSubscriptionMessage('Successfully subscribed!');
      setEmail('');
    } catch {
      setSubscriptionMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    Blog: [
      { label: 'All Posts', path: '/blog' },
      { label: 'Categories', path: '/categories' },
      { label: 'Archives', path: '/archives' },
    ],
    Company: [
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
    ],
    Resources: [
      { label: 'RSS Feed', path: '/rss.xml' },
      { label: 'Sitemap', path: '/sitemap.xml' },
      { label: 'Subscribe', path: '#newsletter' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand & Description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
              }}
            >
              MyBlog
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              A modern blog focused on technology, design, and innovation.
              Sharing insights and stories that matter.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
                aria-label="GitHub"
              >
                <GitHub />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
                aria-label="Email"
              >
                <Email />
              </IconButton>
            </Box>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={6} md={2} key={category}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {links.map(link => (
                  <Link
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Subscribe to our newsletter
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Get the latest posts and updates delivered directly to your inbox.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                size="small"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isSubscribing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isSubscribing}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {subscriptionMessage && (
                <Typography
                  variant="caption"
                  sx={{
                    color: subscriptionMessage.includes('Success')
                      ? 'success.main'
                      : 'error.main',
                  }}
                >
                  {subscriptionMessage}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            © {new Date().getFullYear()} MyBlog. All rights reserved.
          </Typography>
          <IconButton
            onClick={scrollToTop}
            size="small"
            sx={{
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
            aria-label="Scroll to top"
          >
            <ArrowUpward />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
