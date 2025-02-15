import React from 'react';
import { Form } from 'react-bootstrap';

interface GenreSelectProps {
    value: string;
    genres: string[];
    genreSearch: string;
    filteredGenres: string[];
    onGenreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGenreSelect: (genre: string) => void;
}

const GenreSelect: React.FC<GenreSelectProps> = ({
    value,
    genres,
    genreSearch,
    filteredGenres,
    onGenreChange,
    onGenreSelect
}) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <div className="position-relative">
                <Form.Control
                    type="text"
                    name="genre"
                    value={value.toLowerCase().trim()}
                    onChange={onGenreChange}
                    required
                    placeholder="Enter genre"
                    autoComplete="off"
                />
                {genreSearch && filteredGenres.length > 0 && (
                    <div className="position-absolute w-100 mt-1 shadow-sm" style={{ 
                        zIndex: 1000, 
                        maxHeight: '200px', 
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px'
                    }}>
                        {filteredGenres.map((genre, index) => (
                            <div
                                key={index}
                                className="px-3 py-2 cursor-pointer hover-bg-light"
                                style={{ cursor: 'pointer' }}
                                onClick={() => onGenreSelect(genre.toLowerCase().trim())}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                {genre.toLowerCase().trim()}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Form.Group>
    );
};

export default GenreSelect;
