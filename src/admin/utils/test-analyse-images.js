require('dotenv').config(); 
// Make sure to install dotenv: npm install dotenv
const { analyseImages } = require('./analyse-images');

async function testAnalyseImages() {
    const imageUrls = [
        "https://www.amarantelondon.com/cdn/shop/files/Spring-Bloom-Fresh-Mothers-Day-Bouquet.jpg",
    ];

    try {
        const result = await analyseImages(imageUrls);
        console.log(result);
        console.log(JSON.parse(result));
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

testAnalyseImages();
