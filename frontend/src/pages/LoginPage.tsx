import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import AuthForm from '../components/AuthForm.tsx';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        }
    };

    return (
        <AuthForm
            title="Login"
            error={error}
            onSubmit={handleSubmit}
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            submitButtonText="Login"
        />
    );
};

export default LoginPage;