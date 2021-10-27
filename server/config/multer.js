const multer = require("multer");
const path = require('path');

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 10000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})


module.exports = upload;
