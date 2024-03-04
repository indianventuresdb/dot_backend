const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

// Cache to store processed images
const imageCache = new Map();

exports.downloadImageController = async (req, res) => {

    const fileName = req.params.fileName;
    const width = parseInt(req.query.width);
    const height = parseInt(req.query.height);

    // Construct the file paths
    const originalFilePath = path.join(__dirname, '../uploads', fileName);
    const optimizedDirectory = path.join(__dirname, '../uploads', 'optimized');
    const optimizedFilePath = path.join(optimizedDirectory, `${fileName}_${width}x${height}.webp`); // Change the file extension to WebP

    try {
        // Check if the file exists
        await fs.access(originalFilePath);

        if (width && height) {
            // If width and height are provided, check for validity
            const originalImage = sharp(originalFilePath);
            const metadata = await originalImage.metadata();
            const originalWidth = metadata.width;
            const originalHeight = metadata.height;

            if (width > originalWidth || height > originalHeight) {
                throw new Error('Requested dimensions are greater than the original image dimensions');
            }

            await fs.mkdir(optimizedDirectory, { recursive: true });

            // Check if the optimized image is in the cache
            if (!imageCache.has(optimizedFilePath)) {
                console.log('Optimizing image...');

                const optimizedImageBuffer = await originalImage
                    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
                    .toFormat('webp', { quality: 100 })
                    .toBuffer();

                // Save to cache
                imageCache.set(optimizedFilePath, {
                    width: originalWidth,
                    height: originalHeight,
                    buffer: optimizedImageBuffer,
                });

                console.log('Image optimized successfully.');
            }

            // Send the optimized image from cache
            res.type('image/webp').send(imageCache.get(optimizedFilePath).buffer);
        } else {
            // If width and height are not provided, send the original file
            res.sendFile(originalFilePath);
        }
    } catch (err) {
        // File not found or other errors
        console.error(err);
        res.status(404).send('File not found');
    }
};
