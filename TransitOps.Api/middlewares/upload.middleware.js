import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';

export const makeUploader = (destinationFolder) => {
    const uploadPath = path.join(process.cwd(), env.UPLOAD_DIR, destinationFolder);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
        }
    };

    return multer({ 
        storage, 
        fileFilter,
        limits: { fileSize: env.MAX_FILE_SIZE }
    });
};
