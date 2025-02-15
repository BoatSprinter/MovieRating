export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateImage = (file: File): ImageValidationResult => {
    if (file.size > 5000000) {
        return {
            isValid: false,
            error: 'Image size should be less than 5MB'
        };
    }
    
    if (!file.type.match('image.*')) {
        return {
            isValid: false,
            error: 'Please select an image file'
        };
    }

    return { isValid: true };
};

export const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to create image preview'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}; 