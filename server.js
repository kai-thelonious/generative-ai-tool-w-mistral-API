require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const prompt = `
                Generate a random melody as a JSON object with the following format:
{
  "melody": ["C4", "E4", "G4", null, "C5", "E5", "G5", null],
  "scale": "C major",
  "bpm": 120
}
Only respond with the JSON object. Do not include any additional text or Markdown formatting.
Pick between minor or major scales.
Pick new root notes each time. The root note can be any of the 12 notes. Be very random with this.
16 notes per generation.
`

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

app.get('/generate-melody', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.mistral.ai/v1/chat/completions',
            {
                model: 'ministral-8b-latest', // or another model like mistral-small
                temperature: 1,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract and clean the response
        const melodyContent = response.data.choices[0].message.content;
        console.log('Raw Mistral Response:', melodyContent); // Debugging
        const jsonString = melodyContent.replace(/```json\n|\n```/g, '').trim();
        const melodyArray = JSON.parse(jsonString);

        res.json({ melodyArray });
    } catch (error) {
        console.error('Error calling Mistral API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate melody' });
    }
});





app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});



/*
//hardcoded melody for testing
app.get('/generate-melody', async (req, res) => {
    // Hardcoded response for testing
    const testMelody = ["C2", "E4", "G4", "A4", "B4", "C5", "D5", "E5"];
    res.json({ melody: testMelody });
});
*/
