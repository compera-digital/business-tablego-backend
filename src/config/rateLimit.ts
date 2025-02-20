import rateLimit from 'express-rate-limit';

export const rateLimits = {
  // Auth limits
  login: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: { 
      success: false, 
      status: 429, 
      message: 'Too many login attempts, please try again later.' 
    }
  }),

  register: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, 
    message: { 
      success: false, 
      status: 429, 
      message: 'Too many registration attempts, please try again later.' 
    }
  }),

  verifyCode: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: { 
      success: false, 
      status: 429, 
      message: 'Too many verification attempts, please try again later.' 
    }
  }),

  resendCode: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: { 
      success: false, 
      status: 429, 
      message: 'Too many resend attempts, please try again later.' 
    }
  }),

  forgotPassword: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: { 
      success: false, 
      status: 429, 
      message: 'Too many password reset attempts, please try again later.' 
    }
  }),

  changePassword: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: { 
      success: false, 
      status: 429, 
      message: 'Too many password change attempts, please try again later.' 
    }
  }),

  resetPassword: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: { 
      success: false, 
      status: 429,  
      message: 'Too many password reset attempts, please try again later.' 
    }
  }),

  verifyResetToken: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: { 
      success: false, 
      status: 429, 
      message: 'Too many password reset token verification attempts, please try again later.' 
    }
  })
}; 
