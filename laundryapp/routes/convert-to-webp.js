const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directory where your input images are stored
const inputDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'converted');

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    files.forEach(file => {
        const inputImagePath = path.join(inputDir, file);
        const outputImagePath = path.join(outputDir, `${path.parse(file).name}.webp`);

        sharp(inputImagePath)
            .webp({ quality: 80 }) 
            .toFile(outputImagePath)
            .then(() => {
                console.log(`Image ${file} successfully converted to WebP format`);
            })
            .catch(err => {
                console.error('Error converting image:', err);
            });
    });
});
