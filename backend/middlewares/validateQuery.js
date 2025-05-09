const validateQuery = (req, res, next) => {
    if (req.path === '/' && req.method === 'GET') {
        return next(); // Skip validation for the index route
    }

    const allowedQueryParams = ['macroarea', 'category', 'q'];
    const queryKeys = Object.keys(req.query);

    // Check for invalid query parameters
    const invalidParams = queryKeys.filter(key => !allowedQueryParams.includes(key));
    if (invalidParams.length > 0) {
        return res.status(400).json({ error: `Invalid query parameter(s): ${invalidParams.join(', ')}` });
    }

    // Sanitize and validate search queries
    if (req.query.q) {
        // Convert to string and trim whitespace
        req.query.q = String(req.query.q).trim();

        // Block potentially harmful searches
        const blockedPatterns = [';', '--', '/*', '*/', 'DROP', 'DELETE', 'UPDATE', 'INSERT'];
        const hasBlockedPattern = blockedPatterns.some(pattern =>
            req.query.q.toUpperCase().includes(pattern)
        );

        if (hasBlockedPattern) {
            return res.status(400).json({
                success: false,
                message: 'Invalid search query'
            });
        }
    }

    next();
};

module.exports = validateQuery;