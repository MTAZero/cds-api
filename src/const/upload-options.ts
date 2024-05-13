import { editFileName, fileFilter } from 'src/utils';
import { diskStorage } from 'multer';

export const uploadFileOption = {
    storage: diskStorage({
        destination: './files',
        filename: editFileName,
    }),
    fileFilter: fileFilter,
};

export const uploadMultipleFileOption = {
    storage: diskStorage({
        destination: './files',
        filename: editFileName,
    }),
    fileFilter: fileFilter,
};