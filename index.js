//Effects
const reverb = new Tone.Reverb({
    decay: 5, // higher = more reverb
    wet: 0.4
})

const pingPong = new Tone.PingPongDelay({
    delayTime: "16n",
    feedback: 0.5,
    wet: 0.2

})

const filter = new Tone.Filter({
    frequency: 2000,  // Hz (lower = darker sound)
    type: 'lowpass'   // 'lowpass', 'highpass', 'bandpass', 'notch'
});

// Initialize synth
const synth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' }, // 'sine', 'square', 'sawtooth', 'triangle'
    envelope: {
        attack: 0.005,
        decay: 0.7,
        sustain: 0,
        release: 1
    }
})
synth.connect(filter)
filter.connect(pingPong)
pingPong.connect(reverb)
reverb.toDestination()



// Default notes
let notes = [];
let index = 0;
let scale = ''

// Set the tempo
Tone.Transport.bpm.value = 90;

// Schedule the melody loop
Tone.Transport.scheduleRepeat(time => {
    repeat(time);
}, '8n');

// Function to play the note
function repeat(time) {
    let note = notes[index % notes.length];
    synth.triggerAttackRelease(note, '8n', time);
    index++;
    if (note === null) {
        document.getElementById('current-note').textContent = 'X';
    } else {
        document.getElementById('current-note').textContent = note;

    }
}

// Start the transport
document.getElementById("start").addEventListener("click", async () => {
    await Tone.start();
    Tone.Transport.start();
});

// Stop the transport
document.getElementById("stop").addEventListener("click", () => {
    Tone.Transport.stop();
    index = 0
});

// Generate new melody with AI
document.getElementById("generate").addEventListener("click", async () => {
    Tone.Transport.stop();
    index = 0
    try {
        const response = await fetch('http://localhost:3000/generate-melody');
        const data = await response.json();
        notes = data.melodyArray.melody;
        index = 0;

        // Update scale display
        document.getElementById('current-scale').textContent = data.melodyArray.scale;
        console.log(data.melodyArray.scale)
        scale = data.melodyArray.scale;

        console.log('New melody generated:', notes);
        Tone.Transport.start();
    } catch (error) {
        console.error('Error generating melody:', error);
    }
});

