import React from 'react';
import { postsService } from '../services/posts';

const TestPosts = () => {
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const testPosts = async () => {
    try {
      console.log('Testing postsService.getAllPosts()...');
      const response = await postsService.getAllPosts();
      console.log('Response:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  React.useEffect(() => {
    testPosts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Posts Service Test</h2>
      {error && (
        <div style={{ color: 'red' }}>
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      )}
      {result && (
        <div>
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TestPosts;
