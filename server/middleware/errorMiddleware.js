export function asyncHandler(handler) { return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next); }
export function errorMiddleware(error, req, res, next) { console.error('[API]', error); if (res.headersSent) return next(error); res.status(error.status || 500).json({ message: error.expose ? error.message : 'Something went wrong. Please try again.' }); }
