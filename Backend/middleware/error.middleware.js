const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = { ...err };
    error.message = err.message;

    // Validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = {
            statusCode: 400,
            message
        };
    }

    // Duplicate key error
    if (err.code === '23505') {
        error = {
            statusCode: 400,
            message: 'Duplicate field value entered'
        };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = {
            statusCode: 401,
            message: 'Invalid token'
        };
    }

    if (err.name === 'TokenExpiredError') {
        error = {
            statusCode: 401,
            message: 'Token expired'
        };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
