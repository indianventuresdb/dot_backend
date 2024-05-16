
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");

exports.downloadImageController = async (req, res) => {
  const fileName = req.params.fileName;
  const width = parseInt(req.query.width);
  const height = parseInt(req.query.height);

  // Construct the file paths
  const originalFilePath = path.join(__dirname, "../uploads", fileName);
  const optimizedDirectory = path.join(__dirname, "../uploads", "optimized");
  const optimizedFilePath = path.join(
    optimizedDirectory,
    `${fileName}_${width}x${height}.webp`
  ); // Change the file extension to WebP

  try {
    // Check if the file exists
    await fs.promises.access(originalFilePath);

    if (width && height) {
      // If width and height are provided, check for validity
      const metadata = await Jimp.read(originalFilePath);
      const originalWidth = metadata.bitmap.width;
      const originalHeight = metadata.bitmap.height;

      if (width > originalWidth || height > originalHeight) {
        throw new Error(
          "Requested dimensions are greater than the original image dimensions"
        );
      }

      await fs.promises.mkdir(optimizedDirectory, { recursive: true });

      // Check if the optimized image already exists in the optimized directory
      if (!fs.existsSync(optimizedFilePath)) {
        console.log("Optimizing image...");

        await resizeAndConvertToWebP(originalFilePath, optimizedFilePath, width, height);

        console.log("Image optimized and saved successfully.");
      }

      // Set cache-control headers
      res.set("Cache-Control", `public, max-age=3600, must-revalidate`);

      // Send the optimized image directly from the file system
      res.sendFile(optimizedFilePath);
    } else {
      // If width and height are not provided, send the original file

      // Set cache-control headers for the original file
      res.set("Cache-Control", `public, max-age=3600, must-revalidate`);

      res.sendFile(originalFilePath);
    }
  } catch (err) {
    // File not found or other errors
    console.error(err);
    res.status(404).send("File not found");
  }
};

async function resizeAndConvertToWebP(inputFilePath, outputFilePath, width, height) {
  const image = await Jimp.read(inputFilePath);
  await image.resize(width, height);
  await image.writeAsync(outputFilePath);
}






//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const path = require("path");
// const fs = require("fs");
// const sharp = require("sharp");

// exports.downloadImageController = async (req, res) => {
//   const fileName = req.params.fileName;
//   const width = parseInt(req.query.width);
//   const height = parseInt(req.query.height);

//   // Construct the file paths
//   const originalFilePath = path.join(__dirname, "../uploads", fileName);
//   const optimizedDirectory = path.join(__dirname, "../uploads", "optimized");
//   const optimizedFilePath = path.join(
//     optimizedDirectory,
//     `${fileName}_${width}x${height}.webp`
//   ); // Change the file extension to WebP

//   try {
//     // Check if the file exists
//     await fs.promises.access(originalFilePath);

//     if (width && height) {
//       // If width and height are provided, check for validity
//       const originalImage = sharp(originalFilePath);
//       const metadata = await originalImage.metadata();
//       const originalWidth = metadata.width;
//       const originalHeight = metadata.height;

//       if (width > originalWidth || height > originalHeight) {
//         throw new Error(
//           "Requested dimensions are greater than the original image dimensions"
//         );
//       }

//       await fs.promises.mkdir(optimizedDirectory, { recursive: true });

//       // Check if the optimized image already exists in the optimized directory
//       if (!fs.existsSync(optimizedFilePath)) {
//         console.log("Optimizing image...");

//         await originalImage
//           .resize(width, height, { fit: "inside", withoutEnlargement: true })
//           .toFormat("webp", { quality: 100 })
//           .toFile(optimizedFilePath);

//         console.log("Image optimized and saved successfully.");
//       }

//       // Set cache-control headers
//       res.set("Cache-Control", `public, max-age=3600, must-revalidate`);

//       // Send the optimized image directly from the file system
//       res.sendFile(optimizedFilePath);
//     } else {
//       // If width and height are not provided, send the original file

//       // Set cache-control headers for the original file
//       res.set("Cache-Control", `public, max-age=3600, must-revalidate`);

//       res.sendFile(originalFilePath);
//     }
//   } catch (err) {
//     // File not found or other errors
//     console.error(err);
//     res.status(404).send("File not found");
//   }
// };




// // Cache to store processed images
// const imageCache = new Map();

// exports.downloadImageController = async (req, res) => {
//   console.log(imageCache);

//   const fileName = req.params.fileName;
//   const width = parseInt(req.query.width);
//   const height = parseInt(req.query.height);

//   // Construct the file paths
//   const originalFilePath = path.join(__dirname, "../uploads", fileName);
//   const optimizedDirectory = path.join(__dirname, "../uploads", "optimized");
//   const optimizedFilePath = path.join(
//     optimizedDirectory,
//     `${fileName}_${width}x${height}.webp`
//   ); // Change the file extension to WebP

//   try {
//     // Check if the file exists
//     await fs.access(originalFilePath);

//     if (width && height) {
//       // If width and height are provided, check for validity
//       const originalImage = sharp(originalFilePath);
//       const metadata = await originalImage.metadata();
//       const originalWidth = metadata.width;
//       const originalHeight = metadata.height;

//       if (width > originalWidth || height > originalHeight) {
//         throw new Error(
//           "Requested dimensions are greater than the original image dimensions"
//         );
//       }

//       await fs.mkdir(optimizedDirectory, { recursive: true });

//       // Check if the optimized image is in the cache
//       if (!imageCache.has(optimizedFilePath)) {
//         console.log("Optimizing image...");

//         const optimizedImageBuffer = await originalImage
//           .resize(width, height, { fit: "inside", withoutEnlargement: true })
//           .toFormat("webp", { quality: 100 })
//           .toBuffer();

//         // Save to cache

//         imageCache.set(optimizedFilePath, {
//           width: originalWidth,
//           height: originalHeight,
//           buffer: optimizedImageBuffer,
//         });

//         console.log("Image optimized successfully.");
//       }

//       // Set cache-control headers
//       res.set("Cache-Control", `public, max-age=3600, must-revalidate`);

//       // Send the optimized image from cache
//       res.type("image/webp").send(imageCache.get(optimizedFilePath).buffer);
//     } else {
//       // If width and height are not provided, send the original file

//       // Set cache-control headers for the original file
//       res.set("Cache-Control", `public, max-age=3600, must-revalidate`);

//       res.sendFile(originalFilePath);
//     }
//   } catch (err) {
//     // File not found or other errors
//     console.error(err);
//     res.status(404).send("File not found");
//   }
// };
