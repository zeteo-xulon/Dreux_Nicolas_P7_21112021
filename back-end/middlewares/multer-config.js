const multer = require('multer');
const maxFileSize = 2200000;

/** All the different file extension accepted and transcripted if necessary */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

/**
 * The storage configuration
 * destination: Here its possible to modify in witch folder will be stored the file(s)
 * filename: Will take the file and change the name for a custom and unique one, and transcript the mime type
 * @param {Object} req - The request from the front
 * @param {Object} file - The file the front send in the request
 * @param {Function} callback - The callback function used for anything relative to a function need
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

/**
 * Export multer, using the option used :
 * {storage}: The storage constant with diskStorage selectionned, images folder, and customization of the filename
 * {limits}: The limits give the maximum size of the file accepted, is a {Number} stocked in the variable maxFileSize
 * single for only one file at a time, and the name of the attribute accepted in the request ('image')
 */
module.exports = multer({ storage: storage, limits: { fileSize: maxFileSize } }).single('image');