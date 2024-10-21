const OpenAI = require('openai');

async function analyseImages(imageUrls) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
            { 
                role: "system", 
                content: "You are an expert florist and marketer. You are given a list of images of bouquets. You will analyse the images and provide a JSON object with the image analysis with the following format: { title: string, short_description: string, description: string, keywords: string[] , colours: string[], flowers: string[] }. The short_description should be SEO-optimised and 50 words max., but still include a poetic description of the bouquet. The description should be SEO-optimised and 90 words max., but still include a poetic description of the bouquet. All your responses should be in Russian. The title of the bouquet should be poetic and descriptive of the bouquet. The keywords should be 5-7 SEO-optimised keywords related to the bouquet. The colours should be the main colours of the bouquet in a string array. The flowers should be the main flowers of the bouquet in a string array, in the singular form. Include flower names in the description." 
            }, 
            { 
                role: "user", 
                content: [
                    { type: "text", text: "Analyze these bouquet images:" },
                    ...imageUrls.map(url => ({ type: "image_url", image_url: { url } }))
                ]
            }
        ],
        max_tokens: 500
    });

    return response.choices[0].message.content;
}

export default analyseImages;
