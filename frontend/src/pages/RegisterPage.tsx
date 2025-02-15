import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import AuthForm from '../components/AuthForm.tsx';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(username, password, confirmPassword);
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.');
        }
    };

    return (
        <AuthForm
            title="Register"
            error={error}
            onSubmit={handleSubmit}
            username={username}
            password={password}
            confirmPassword={confirmPassword}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            submitButtonText="Register"
        />
    );
};

export default RegisterPage;