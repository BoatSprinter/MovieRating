import React from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';

interface AuthFormProps {
    title: string;
    error?: string;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    username: string;
    password: string;
    confirmPassword?: string;
    onUsernameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange?: (value: string) => void;
    submitButtonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
    title,
    error,
    onSubmit,
    username,
    password,
    confirmPassword,
    onUsernameChange,
    onPasswordChange,
    onConfirmPasswordChange,
    submitButtonText
}) => {
    return (
        <Container className="mt-5">
            <h2>{title}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => onUsernameChange(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        required
                    />
                </Form.Group>
                {onConfirmPasswordChange && (
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => onConfirmPasswordChange(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}
                <Button type="submit">{submitButtonText}</Button>
            </Form>
        </Container>
    );
};

export default AuthForm; 