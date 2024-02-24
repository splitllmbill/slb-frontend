// api/proxy.js

const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const backendUrl = 'http://3.108.51.96:8000'; // Replace with your backend URL
    
    try {
        const response = await fetch(backendUrl + req.url, {
            method: req.method,
            headers: {
                ...req.headers,
                // Add any additional headers if needed
            },
            // Add any additional options if needed
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy error' });
    }
};
