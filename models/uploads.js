var mongoose = require('mongoose');

var UploadSchema = new mongoose.Schema({
    fileName: String,
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', UploadSchema);