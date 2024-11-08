let recognition;
let isRecording = false;
let isPaused = false;
let savedPassword = localStorage.getItem('password');
let savedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || {};

function requestMicrophonePermission() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = handleVoiceResult;
        document.getElementById('setup-credentials').style.display = 'block';
    } else {
        alert('Speech Recognition API is not supported in this browser.');
    }
}

function saveCredentials() {
    const password = document.getElementById('password').value;
    if (password.length === 4) {
        localStorage.setItem('password', password);
        alert('Credentials saved! Fingerprint enabled.');
        showLogin();
    } else {
        alert('Password must be 4 digits');
    }
}

function showLogin() {
    document.getElementById('setup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

function authenticate() {
    const enteredPassword = document.getElementById('login-password').value;
    if (enteredPassword === localStorage.getItem('password')) {
        enterMenu();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function enterMenu() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('menu-section').style.display = 'block';
}

function openTodayDiary() {
    document.getElementById('menu-section').style.display = 'none';
    document.getElementById('today-diary').style.display = 'block';
}

function saveDiary() {
    const text = document.getElementById('diary-text').value;
    const today = new Date().toLocaleDateString();
    savedEntries[today] = (savedEntries[today] || '') + text + '\n';
    localStorage.setItem('diaryEntries', JSON.stringify(savedEntries));
    alert('Diary entry saved!');
    document.getElementById('diary-text').value = '';
}

function openPastDiary() {
    document.getElementById('menu-section').style.display = 'none';
    document.getElementById('past-diary').style.display = 'block';
    const pastEntriesDiv = document.getElementById('past-entries');
    pastEntriesDiv.innerHTML = '';

    for (const [date, entry] of Object.entries(savedEntries)) {
        const entryDiv = document.createElement('div');
        entryDiv.innerHTML = `<h4>${date}</h4><p>${entry}</p>`;
        pastEntriesDiv.appendChild(entryDiv);
    }
}

function goToMenu() {
    document.getElementById('today-diary').style.display = 'none';
    document.getElementById('past-diary').style.display = 'none';
    document.getElementById('menu-section').style.display = 'block';
}

function handleVoiceResult(event) {
    const text = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
    document.getElementById('diary-text').value = text;
}

function startVoiceTyping() {
    recognition.start();
    isRecording = true;
    isPaused = false;
    updateVoiceControls();
}

function pauseResumeVoiceTyping() {
    if (isRecording && !isPaused) {
        recognition.stop();
        isPaused = true;
    } else if (isRecording && isPaused) {
        recognition.start();
        isPaused = false;
    }
    updateVoiceControls();
}

function stopVoiceTyping() {
    recognition.stop();
    isRecording = false;
    isPaused = false;
    updateVoiceControls();
}

function updateVoiceControls() {
    document.getElementById('start-voice-btn').style.display = isRecording ? 'none' : 'inline';
    document.getElementById('pause-resume-btn').style.display = isRecording ? 'inline' : 'none';
    document.getElementById('stop-voice-btn').style.display = isRecording ? 'inline' : 'none';
    document.getElementById('pause-resume-btn').innerText = isPaused ? 'Resume' : 'Pause';
}
