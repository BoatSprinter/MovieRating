import React from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { UpdateMovieForm } from '../interfaces/movie';

interface UpdateMovieModalProps {
    show: boolean;
    updateForm: UpdateMovieForm | null;
    updateError: string;
    onHide: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onFormChange: (updates: Partial<UpdateMovieForm>) => void;
}

const UpdateMovieModal: React.FC<UpdateMovieModalProps> = ({
    show,
    updateForm,
    updateError,
    onHide,
    onSubmit,
    onFormChange,
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Movie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {updateError && <Alert variant="danger">{updateError}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={updateForm?.title || ''}
                            onChange={e => onFormChange({ title: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Genre</Form.Label>
                        <Form.Control
                            type="text"
                            value={updateForm?.genre || ''}
                            onChange={e => onFormChange({ genre: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Release Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={updateForm?.releaseDate || ''}
                            onChange={e => onFormChange({ releaseDate: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={updateForm?.description || ''}
                            onChange={e => onFormChange({ description: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Image (optional)</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={e => onFormChange({
                                image: (e.target as HTMLInputElement).files?.[0] || null
                            })}
                            accept="image/*"
                        />
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Movie
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateMovieModal; 