// pages/api/proxy.js

export default async function handler(req, res) {
    const { url } = req.query;
  
    // Ensure the URL query parameter is provided
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
  
    try {
      // Fetch the page HTML from the provided URL
      const response = await fetch(url);
  
      // Check if the response is ok (status 200)
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch the requested URL' });
      }
  
      // Convert the response to text (HTML)
      const html = await response.text();
  
      // Send the HTML content back to the client
      res.status(200).json({ html });
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error('Error fetching the URL:', error);
      res.status(500).json({ error: 'Failed to fetch the URL' });
    }
  }
  