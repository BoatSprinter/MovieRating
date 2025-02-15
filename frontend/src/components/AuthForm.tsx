import React from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';

interface ValidationState {
    isValid: boolean;
    message: string;
    requirements?: { met: boolean; text: string }[];
}

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
    validationState?: {
        username: ValidationState;
        password: ValidationState;
        confirmPassword?: ValidationState;
    };
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
    submitButtonText,
    validationState
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
                        isValid={validationState?.username.isValid}
                        isInvalid={username !== '' && !validationState?.username.isValid}
                    />
                    <div className="mt-1">
                        {validationState?.username.requirements?.map((req, index) => (
                            <div key={index} style={{ 
                                color: username === '' ? '#666' : (req.met ? '#198754' : '#dc3545')
                            }}>
                                • {req.text} {req.met ? '✓' : ''}
                            </div>
                        ))}
                    </div>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        required
                        isValid={validationState?.password.isValid}
                        isInvalid={password !== '' && !validationState?.password.isValid}
                    />
                    <div className="mt-1">
                        {validationState?.password.requirements?.map((req, index) => (
                            <div key={index} style={{ 
                                color: password === '' ? '#666' : (req.met ? '#198754' : '#dc3545')
                            }}>
                                • {req.text} {req.met ? '✓' : ''}
                            </div>
                        ))}
                    </div>
                </Form.Group>
                {onConfirmPasswordChange && (
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => onConfirmPasswordChange(e.target.value)}
                            required
                            isValid={validationState?.confirmPassword?.isValid}
                            isInvalid={confirmPassword !== '' && !validationState?.confirmPassword?.isValid}
                        />
                        <div className="mt-1">
                            <div style={{ 
                                color: confirmPassword === '' ? '#666' : 
                                       (validationState?.confirmPassword?.isValid ? '#198754' : '#dc3545')
                            }}>
                                • Passwords must match {validationState?.confirmPassword?.isValid ? '✓' : ''}
                            </div>
                        </div>
                    </Form.Group>
                )}
                <Button type="submit">{submitButtonText}</Button>
            </Form>
        </Container>
    );
};

export default AuthForm; 