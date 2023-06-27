import path from "path";
import fs from "fs";

const __dirname = path.dirname(import.meta.url);

export const downloadImageController = async (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join( '../uploads', fileName);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
};