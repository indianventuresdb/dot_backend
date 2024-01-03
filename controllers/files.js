const path = require("path");
const Fs = require("fs");
// const fs = require("fs").promises;
// const sharp = require("sharp");


exports.downloadImageController = async (req, res) => {
    const fileName = req.params.fileName;

    // Construct the file path
    const filePath = path.join(__dirname, '../uploads', fileName);

    try {
        // Check if the file exists
        await Fs.promises.access(filePath);

        // Stream the file as a response
        res.sendFile(filePath);
    } catch (err) {
        // File not found
        res.status(404).send('File not found');
    }
};


// Use fs.promises for consistent promise-based API

// exports.imageOptimizer = async (req, res) => {
//     const fileName = req.params.fileName;
//     const width = parseInt(req.query.width) || 300; // Default width is 300
//     const height = parseInt(req.query.height) || 300; // Default height is 300

//     // Construct the file paths
//     const originalFilePath = path.join(__dirname, '../uploads', fileName);
//     const optimizedDirectory = path.join(__dirname, '../uploads', 'optimized');
//     const optimizedFilePath = path.join(optimizedDirectory, `${fileName}_${width}x${height}.jpg`);

//     console.log("original : ", originalFilePath);
//     console.log("optimized : ", optimizedFilePath);

//     try {

//         await fs.access(originalFilePath);

//         await fs.mkdir(optimizedDirectory, { recursive: true });


//         const optimizedFileExists = await fs.access(optimizedFilePath).then(() => true).catch(() => false);

//         if (!optimizedFileExists) {

//             await sharp(originalFilePath)
//                 .resize({ width, height })
//                 .toFile(optimizedFilePath);
//         }


//         res.sendFile(optimizedFilePath);
//     } catch (err) {

//         console.log(err);
//         res.status(404).send('File not found');
//     }
// };
