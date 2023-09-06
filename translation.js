const apiKey = 'YOUR_API_KEY'; // Replace with your Google Cloud API key

const detectLanguageButton = document.getElementById('detect-language-button');
const translateButton = document.getElementById('translate-button');
const outputFormatSelect = document.getElementById('output-format');
const downloadButton = document.getElementById('download-button');
const inputText = document.getElementById('input-text');
const targetLanguage = document.getElementById('target-language');
const output = document.getElementById('output');

let detectedLanguage = '';

// Detect the language of the input text
detectLanguageButton.addEventListener('click', () => {
    const text = inputText.value;
    if (!text) {
        alert('Please enter text.');
        return;
    }

    fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
        }),
    })
    .then(response => response.json())
    .then(data => {
        detectedLanguage = data.data.detections[0][0].language;
        alert(`Detected language: ${detectedLanguage}`);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Translate the input text
translateButton.addEventListener('click', () => {
    const text = inputText.value;
    if (!text) {
        alert('Please enter text.');
        return;
    }

    const target = targetLanguage.value;

    fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            target: target,
        }),
    })
    .then(response => response.json())
    .then(data => {
        const translation = data.data.translations[0].translatedText;
        output.textContent = translation;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Handle download based on selected format
downloadButton.addEventListener('click', () => {
    const format = outputFormatSelect.value;
    const translation = output.textContent;

    if (format === 'text') {
        // Display as text
        alert(translation);
    } else if (format === 'speech') {
        // Convert text to speech and play
        fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    text: translation,
                },
                voice: {
                    languageCode: detectedLanguage,
                    name: 'en-US-Wavenet-D',
                },
                audioConfig: {
                    audioEncoding: 'LINEAR16',
                },
            }),
        })
        .then(response => response.json())
        .then(data => {
            const audioData = data.audioContent;
            const audioBlob = new Blob([audioData], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
