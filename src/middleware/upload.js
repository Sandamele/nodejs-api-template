const multer = require("multer");
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// Setup Multer for memory storage
const storage = multer.memoryStorage();

// Initialize Multer
const uploadMulter = multer({ storage });

/**
 * Middleware to upload files to Cloudinary.
 * 
 * @param {Object} req - The request object containing the files to be uploaded.
 * @param {Object} res - The response object used to send a response.
 * @param {Function} next - The next middleware function in the stack.
 * 
 * @returns {void} - This function does not return anything. It either attaches URLs to the request or sends an error response.
 * 
 * @throws {Error} - Throws an error if any file upload or Cloudinary operation fails.
 * 
 * @example
 * app.post("/upload", uploadMulter.array("files"), uploadToCloudinaryMiddleware, (req, res) => {
 *     const uploadedFiles = req.body.cloudinaryUrls;
 *     // Do something with the uploaded files URLs
 * });
 */
const uploadToCloudinaryMiddleware = async (req, res, next) => {
    try {
        const files = req.files;

        // Check if no files are provided
        if (!files || files.length === 0) {
            return res.status(400).json({ error: { msg: "No files provided" } });
        }

        const cloudinaryUrls = [];
        
        // Iterate over each file and upload to Cloudinary
        for (const file of files) {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto', // Auto detects the file type (image, video, etc.)
                    folder: process.env.CLOUDINARY_FOLDER, // Folder in Cloudinary to store the files
                },
                (err, result) => {
                    if (err) {
                        console.error('Cloudinary upload error:', err);
                        return res.status(400).json({ error: err });
                    }
                    if (!result) {
                        console.error('Cloudinary upload error: Result is undefined');
                        return res.status(400).json({ error: { msg: "Cloudinary upload result is undefined" } });
                    }

                    // Push the result URL to the array
                    cloudinaryUrls.push(result.secure_url);

                    // Once all files are processed, attach URLs to the request body
                    if (cloudinaryUrls.length === files.length) {
                        req.body.cloudinaryUrls = cloudinaryUrls;
                        next();
                    }
                }
            );
            
            // Start the upload stream
            uploadStream.end(file.buffer);
        }
    } catch (error) {
        console.error('Error in uploadToCloudinary middleware:', error);
        return res.status(500).json({ error });
    }
};

module.exports = { uploadMulter, uploadToCloudinaryMiddleware };
