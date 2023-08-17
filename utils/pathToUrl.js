exports.pathToUrl = (path) => {
    const newPath = path.replace("\\", "/");

    return `${process.env.FILE_PATH}/${newPath}`;
};
