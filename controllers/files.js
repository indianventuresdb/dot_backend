const path = require("path");
const fs = require("fs");


exports.downloadImageController = async (req, res) => {
    const fileName = req.params.fileName;

    // Construct the file path
    const filePath = path.join(__dirname, '../uploads', fileName);

    try {
        // Check if the file exists
        await fs.promises.access(filePath);

        // Stream the file as a response
        res.sendFile(filePath);
    } catch (err) {
        // File not found
        res.status(404).send('File not found');
    }
};
