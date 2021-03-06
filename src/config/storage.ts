import path from 'path';
import crypto from 'crypto';

import multer, { StorageEngine } from 'multer';

const tmpFolder = path.join(__dirname, '../../tmp');
const publicFolder = path.join(__dirname, '../../public');

interface IStorageConfig {
  driver: 'disk' | 's3';

  tmpFolder: string;
  publicFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  publicFolder,
  uploadsFolder: path.resolve(publicFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: process.env.AWS_BUCKET,
    },
  },
} as IStorageConfig;
