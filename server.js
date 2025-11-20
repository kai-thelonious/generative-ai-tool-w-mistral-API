require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const prompt = 'Generate a random melody as an array of 32 notes in random scale (e.g., ["C4", "E4", "G4", ...]). Only respond with the JSON array. ' +
    'PLease use more of lower octaves. Perhaps apply occasional rest notes ' +
    'rest notes are simply null value in the array ' +
    'less rest notes ' +
    `Start at the root note of the random scale always ` +
    'very important that every new generated melody has a new scale and root note' +
    'Please apply way more randomness to notes + ' +
    'The intitial example of an array just shows the syntax we need to use, disregard the notes and give me random notes each time that are in a musical scale which you select. ' +
    'Null values are not in quotes ' +
    'When generating a new melody u can utilize all notes as the root key'

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

app.get('/generate-melody', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.mistral.ai/v1/chat/completions',
            {
                model: 'mistral-small', // or another model like mistral-small
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


/*
//hardcoded melody for testing
app.get('/generate-melody', async (req, res) => {
    // Hardcoded response for testing
    const testMelody = ["C2", "E4", "G4", "A4", "B4", "C5", "D5", "E5"];
    res.json({ melody: testMelody });
});
*/


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
