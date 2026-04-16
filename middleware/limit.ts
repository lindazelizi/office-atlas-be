import rateLimit from 'express-rate-limit';

const failedLoginAttempts = new Map<string, { count: number; resetTime: number }>();

export const loginLimiter = (req: any, res: any, next: any) => {
    const email = req.body.email;
    if (!email) return next();

    const now = Date.now();
    const attempt = failedLoginAttempts.get(email);

    if (attempt && now > attempt.resetTime) {
        failedLoginAttempts.delete(email);
        return next();
    }

    if (attempt && attempt.count >= 5) {
        return res.status(429).json({
            error: 'Too many failed login attempts. Please try again later.'
        });
    }

    next();
};

export const recordFailedLogin = (email: string) => {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const attempt = failedLoginAttempts.get(email);

    if (attempt && now < attempt.resetTime) {
        attempt.count++;
    } else {
        failedLoginAttempts.set(email, { count: 1, resetTime: now + windowMs });
    }
};

export const resetLoginAttempts = (email: string) => {
    failedLoginAttempts.delete(email);
};
