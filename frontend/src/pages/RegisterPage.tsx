import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import AuthForm from '../components/AuthForm.tsx';
import { validateUsername, validatePassword, validateConfirmPassword } from '../utils/authValidation.tsx';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [validationState, setValidationState] = useState({
        username: { isValid: false, message: '' },
        password: { isValid: false, message: '' },
        confirmPassword: { isValid: false, message: '' }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if all validations pass
        if (!validationState.username.isValid || 
            !validationState.password.isValid || 
            !validationState.confirmPassword.isValid) {
            setError('Please fix all validation errors before submitting');
            return;
        }

        try {
            await register({
                username,
                password,
                confirmPassword
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.');
        }
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        setValidationState(prev => ({
            ...prev,
            username: validateUsername(value)
        }));
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setValidationState(prev => ({
            ...prev,
            password: validatePassword(value),
            confirmPassword: validateConfirmPassword(value, confirmPassword)
        }));
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setValidationState(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(password, value)
        }));
    };

    return (
        <AuthForm
            title="Register"
            error={error}
            onSubmit={handleSubmit}
            username={username}
            password={password}
            confirmPassword={confirmPassword}
            onUsernameChange={handleUsernameChange}
            onPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
            validationState={validationState}
            submitButtonText="Register"
        />
    );
};

export default RegisterPage;