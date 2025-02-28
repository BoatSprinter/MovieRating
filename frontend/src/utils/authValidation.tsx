export interface ValidationState {
    isValid: boolean;
    message: string;
    requirements?: { met: boolean; text: string }[];
}

export const validateUsername = (username: string): ValidationState => {
    const requirements = [
        { met: username.length >= 5 && username.length <= 20, text: 'Between 5 and 20 characters' },
        { met: /^[a-zA-Z0-9_-]+$/.test(username), text: 'Only letters, numbers, underscores and hyphens' }
    ];

    const unmetRequirements = requirements.filter(req => !req.met);

    return {
        isValid: unmetRequirements.length === 0,
        message: 'Username requirements:',
        requirements
    };
};

export const validatePassword = (password: string): ValidationState => {
    const requirements = [
        { met: password.length >= 6, text: 'At least 6 characters' },
        { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
        { met: /[a-z]/.test(password), text: 'One lowercase letter' },
        { met: /[0-9]/.test(password), text: 'One number' },
        { met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), text: 'One special character (!@#$%^&*()_+-=[]{};\'"\\|,.<>/?)' }
    ];

    const unmetRequirements = requirements.filter(req => !req.met);
    
    if (!password) {
        return { 
            isValid: false, 
            message: 'Password requirements:',
            requirements
        };
    }

    return {
        isValid: unmetRequirements.length === 0,
        message: 'Password requirements:',
        requirements
    };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationState => {
    if (!confirmPassword) {
        return { isValid: false, message: 'Please confirm your password' };
    }
    if (password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match' };
    }
    return { isValid: true, message: '' };
}; 