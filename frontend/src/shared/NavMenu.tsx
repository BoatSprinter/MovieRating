import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { FaSun, FaMoon } from 'react-icons/fa';

const NavMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const isAuthenticated = !!user;
    const username = user?.username || '';
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Navbar expand="lg" variant={theme === 'dark' ? 'dark' : 'light'} className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Movie Rating App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMenu} />
                <Navbar.Collapse id="basic-navbar-nav" className={isMenuOpen ? 'show' : ''}>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
                        {isAuthenticated && (
                            <>
                              <Nav.Link as={Link} to="/movies/create">Add Movie</Nav.Link>
                              <Nav.Link as={Link} to="/movies/details">My Movies</Nav.Link>
                            </>
                            
                        )}
                    </Nav>
                    <Nav>
                        <Button 
                            variant="link" 
                            className="theme-toggle-btn me-3" 
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <FaMoon color="#0d6efd" /> : <FaSun color="#ffc107" />}
                        </Button>
                        
                        {isAuthenticated ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Hello, {username}
                                </Navbar.Text>
                                <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavMenu;