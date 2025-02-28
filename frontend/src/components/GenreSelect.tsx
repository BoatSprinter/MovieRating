import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { FaSearch } from 'react-icons/fa';

interface GenreSelectProps {
    value: string;
    genres: string[];
    genreSearch: string;
    filteredGenres: string[];
    onGenreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGenreSelect: (genre: string) => void;
    isValid?: boolean;
    isInvalid?: boolean;
    feedbackMessage?: string;
}

const GenreSelect: React.FC<GenreSelectProps> = ({
    value,
    genres,
    genreSearch,
    filteredGenres,
    onGenreChange,
    onGenreSelect,
    isValid,
    isInvalid,
    feedbackMessage
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
        <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <div className="position-relative">
                <div className="input-group">
                    <span className="input-group-text" style={{
                        backgroundColor: isDark ? '#212529' : '#f8f9fa',
                        borderColor: isDark ? '#495057' : '#ced4da'
                    }}>
                        <FaSearch color={isDark ? '#adb5bd' : '#6c757d'} />
                    </span>
                    <Form.Control
                        ref={inputRef}
                        type="text"
                        name="genre"
                        value={value}
                        onChange={onGenreChange}
                        required
                        placeholder="Enter genre"
                        autoComplete="off"
                        isValid={isValid}
                        isInvalid={isInvalid}
                        className={isDark ? 'bg-dark text-white' : ''}
                        style={{ borderTopRightRadius: filteredGenres.length ? '0' : undefined, 
                                borderBottomRightRadius: filteredGenres.length ? '0' : undefined }}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown' && filteredGenres.length > 0) {
                                e.preventDefault();
                                const dropdown = document.getElementById('genre-dropdown');
                                const firstItem = dropdown?.querySelector('.genre-item') as HTMLElement;
                                if (firstItem) {
                                    firstItem.focus();
                                }
                            }
                        }}
                    />
                </div>
                <Form.Control.Feedback type="invalid">
                    {feedbackMessage}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid">
                    {feedbackMessage}
                </Form.Control.Feedback>
                {genreSearch && filteredGenres.length > 0 && (
                    <div 
                        id="genre-dropdown"
                        className="position-absolute w-100 shadow-sm" 
                        style={{ 
                            zIndex: 1000, 
                            maxHeight: '300px', 
                            overflowY: 'auto',
                            backgroundColor: isDark ? '#212529' : 'white',
                            color: isDark ? 'white' : 'black',
                            border: `1px solid ${isDark ? '#495057' : '#dee2e6'}`,
                            borderRadius: '0 0 4px 4px',
                            borderTop: 'none'
                        }}
                    >
                        {filteredGenres.map((genre, index) => (
                            <div
                                key={index}
                                className="px-3 py-2 cursor-pointer genre-item d-flex align-items-center"
                                style={{ 
                                    cursor: 'pointer',
                                    backgroundColor: isDark ? '#212529' : 'white'
                                }}
                                onClick={() => onGenreSelect(genre)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = isDark ? '#343a40' : '#f8f9fa';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = isDark ? '#212529' : 'white';
                                }}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onGenreSelect(genre);
                                    } else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (nextSibling) {
                                            nextSibling.focus();
                                        }
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        const prevSibling = e.currentTarget.previousElementSibling as HTMLElement;
                                        if (prevSibling) {
                                            prevSibling.focus();
                                        } else {
                                            inputRef.current?.focus();
                                        }
                                    } else if (e.key === 'Escape') {
                                        inputRef.current?.focus();
                                    }
                                }}
                            >
                                <FaSearch className="me-2" color={isDark ? '#adb5bd' : '#6c757d'} size={14} />
                                {highlightMatch(genre, genreSearch)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Form.Group>
    );
};

// Helper function to highlight the matching part of the text
const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query) return <>{text}</>;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <>{text}</>;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    
    return (
        <>
            {before}<strong>{match}</strong>{after}
        </>
    );
};

export default GenreSelect;
