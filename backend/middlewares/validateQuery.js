const validateQuery = (req, res, next) => {
    if (req.path === '/' && req.method === 'GET') {
        return next(); // Skip validation for the index route
    }

    const allowedQueryParams = ['macroarea', 'category'];
    const queryKeys = Object.keys(req.query);

    // Check for invalid query parameters
    const invalidParams = queryKeys.filter(key => !allowedQueryParams.includes(key));
    if (invalidParams.length > 0) {
        return res.status(400).json({ error: `Invalid query parameter(s): ${invalidParams.join(', ')}` });
    }

    next();
};

module.exports = validateQuery;