import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';

export const makeUploader = (destinationFolder, allowPdf = false) => {
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
        let allowedExt = /jpeg|jpg|png|webp/;
        let allowedMime = /image\/(jpeg|jpg|png|webp)/;

        if (allowPdf) {
            allowedExt = /jpeg|jpg|png|webp|pdf/;
            allowedMime = /image\/(jpeg|jpg|png|webp)|application\/pdf/;
        }

        const extname = allowedExt.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedMime.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error(allowPdf ? 'Only images (jpeg, jpg, png, webp) and PDF files are allowed' : 'Only images (jpeg, jpg, png, webp) are allowed'));
        }
    };

    return multer({ 
        storage, 
        fileFilter,
        limits: { fileSize: env.MAX_FILE_SIZE }
    });
};
