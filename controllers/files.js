const Jimp = require('jimp');
const path = require("path");
const fs = require("fs").promises;

exports.downloadImageController = async (req, res) => {
    const fileName = req.params.fileName;
    const width = parseInt(req.query.width);
    const height = parseInt(req.query.height);

    // Construct the file paths
    const originalFilePath = path.join(__dirname, '../uploads', fileName);
    const optimizedDirectory = path.join(__dirname, '../uploads', 'optimized');
    const optimizedFilePath = path.join(optimizedDirectory, `${fileName}_${width}x${height}.png`); // Change the file extension to PNG

    try {
        // Check if the file exists
        await fs.access(originalFilePath);

        // Get the original image dimensions
        const originalImage = await Jimp.read(originalFilePath);

        if (width && height) {
            // If width and height are provided, check for validity
            const originalWidth = originalImage.bitmap.width;
            const originalHeight = originalImage.bitmap.height;

            if (width > originalWidth || height > originalHeight) {
                throw new Error('Requested dimensions are greater than the original image dimensions');
            }

            await fs.mkdir(optimizedDirectory, { recursive: true });

            const optimizedFileExists = await fs.access(optimizedFilePath).then(() => true).catch(() => false);

            if (!optimizedFileExists) {
                console.log('Optimizing image...');
                const image = await originalImage.clone();

                await image
                    .resize(width, height)
                    .writeAsync(optimizedFilePath);

                console.log('Image optimized successfully.');
            }

            res.sendFile(optimizedFilePath);
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
