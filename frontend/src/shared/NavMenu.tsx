import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavMenu: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      className="mb-4 shadow"
      style={{ width: '100%' }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          onClick={() => setExpanded(false)}
          style={{ color: 'white' }}
        >
          Movie Ranking
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={() => setExpanded(false)}
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/movies" 
              onClick={() => setExpanded(false)}
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Movies
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/movies/create" 
              onClick={() => setExpanded(false)}
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Add Movie
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              onClick={() => setExpanded(false)}
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
