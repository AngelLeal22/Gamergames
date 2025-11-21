const logoutRouter = require('express').Router();


logoutRouter.get('/', async (request, response) => {
    // Always attempt to clear the accessToken cookie on logout.
    // Don't require reading request.cookies (cookie-parser may not be installed).
    response.clearCookie('accessToken', {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'Lax'
    });

    return response.sendStatus(204);
});

module.exports = logoutRouter;