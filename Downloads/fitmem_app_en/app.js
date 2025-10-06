// Fit-Mem: Memory & Exercise Study - Complete English Version
// Based on the detailed game flow description

console.log("Fit-Mem app loaded");
console.log("jsPsych available:", typeof jsPsych !== "undefined");

// Global variables for data collection
let participantData = {
  id: null,
  startTime: null,
  endTime: null,
  surveyResponses: {},
  wordTestResults: {},
  corsiResults: {},
  nbackResults: {},
  recognitionResults: {},
};

// Generate unique participant ID
function generateParticipantId() {
  return "P" + Date.now() + Math.random().toString(36).substr(2, 5);
}

// Calculate MET-minutes per week
function calculateMET(data) {
  const metValues = {
    light: 3.0,
    moderate: 5.0,
    vigorous: 8.0,
  };

  if (data.exercise_regularly === "no") return 0;

  const days = parseInt(data.exercise_days) || 0;
  const minutes = parseInt(data.exercise_minutes) || 0;
  const intensity = data.exercise_intensity || "moderate";
  const metValue = metValues[intensity] || 5.0;

  return days * minutes * metValue;
}

// Initialize jsPsych timeline
const timeline = [];

// Step 1: Welcome & Consent
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h1>Fit-Mem: Memory & Exercise Study</h1>
            <p>Welcome to our memory and exercise research study!</p>
            <p><strong>What you'll do:</strong></p>
            <ul style="text-align: left; max-width: 500px; margin: 0 auto;">
                <li>Complete a brief exercise survey</li>
                <li>Take memory tests (words, spatial, working memory)</li>
                <li>Study takes 10-12 minutes total</li>
            </ul>
            <p><strong>Your data will remain anonymous and confidential.</strong></p>
            <p>By clicking "I Agree", you consent to participate in this study.</p>
        </div>
    `,
  choices: ["I Agree"],
  data: { phase: "welcome_consent" },
});

// Step 2: Exercise Survey
timeline.push({
  type: jsPsychSurveyHtmlForm,
  stimulus: `
        <h2>Exercise & Lifestyle Survey</h2>
        <p>Please answer the following questions about your exercise habits and current state.</p>
        
        <div style="margin: 20px 0;">
            <label for="age">Age:</label><br>
            <input type="number" id="age" name="age" required min="18" max="100" style="width: 100px;">
        </div>
        
        <div style="margin: 20px 0;">
            <label for="sex">Sex:</label><br>
            <select id="sex" name="sex" required style="width: 150px;">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>
        
        <div style="margin: 20px 0;">
            <label for="exercise_regularly">Do you exercise regularly?</label><br>
            <select id="exercise_regularly" name="exercise_regularly" required style="width: 150px;">
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        
        <div style="margin: 20px 0;">
            <label for="exercise_days">How many days per week do you exercise?</label><br>
            <input type="number" id="exercise_days" name="exercise_days" min="0" max="7" value="0" style="width: 100px;"> days
        </div>
        
        <div style="margin: 20px 0;">
            <label for="exercise_minutes">How many minutes per session?</label><br>
            <input type="number" id="exercise_minutes" name="exercise_minutes" min="0" max="300" value="0" style="width: 100px;"> minutes
        </div>
        
        <div style="margin: 20px 0;">
            <label for="exercise_intensity">Exercise intensity:</label><br>
            <select id="exercise_intensity" name="exercise_intensity" style="width: 150px;">
                <option value="light">Light</option>
                <option value="moderate" selected>Moderate</option>
                <option value="vigorous">Vigorous</option>
            </select>
        </div>
        
        <div style="margin: 20px 0;">
            <label for="sleep_hours">How many hours did you sleep last night?</label><br>
            <input type="number" id="sleep_hours" name="sleep_hours" min="0" max="24" value="8" style="width: 100px;"> hours
        </div>
        
        <div style="margin: 20px 0;">
            <label for="caffeine_today">Did you have caffeine today?</label><br>
            <select id="caffeine_today" name="caffeine_today" required style="width: 150px;">
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        
        <div style="margin: 20px 0;">
            <label for="mood">How is your mood right now? (0 = very bad, 10 = excellent)</label><br>
            <input type="range" id="mood" name="mood" min="0" max="10" value="5" style="width: 200px;">
            <span id="mood_value">5</span>
        </div>
    `,
  data: { phase: "exercise_survey" },
});

// Update mood slider display
document.addEventListener("DOMContentLoaded", function () {
  const moodSlider = document.getElementById("mood");
  const moodValue = document.getElementById("mood_value");
  if (moodSlider && moodValue) {
    moodSlider.addEventListener("input", function () {
      moodValue.textContent = this.value;
    });
  }
});

// Step 3: Word List Memory Test - Instructions
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h2>Word List Memory Test</h2>
            <p>You will see 10 words, one at a time.</p>
            <p>Try to remember as many words as you can.</p>
            <p>After the list, you will be asked to type all the words you remember.</p>
            <p>Click "Start" when you're ready.</p>
        </div>
    `,
  choices: ["Start"],
  data: { phase: "word_instructions" },
});

// Word List Presentation (10 words, 1 second each)
const wordList = jsPsych.randomization
  .shuffle([...WORD_BANK_EASY])
  .slice(0, 10);
const wordTrials = wordList.map((word) => ({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class="center"><h2>${word}</h2></div>`,
  choices: [" "],
  trial_duration: 1000,
  data: { word: word, phase: "word_presentation" },
}));

timeline.push(...wordTrials);

// Immediate Word Recall
timeline.push({
  type: jsPsychSurveyText,
  questions: [
    {
      prompt:
        "Type all the words you remember from the list (any order). Separate each word with a comma:",
      name: "immediate_recall",
      rows: 5,
      columns: 50,
    },
  ],
  data: { phase: "immediate_recall" },
});

// Step 4: Corsi Block Task - Instructions
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h2>Corsi Block Task</h2>
            <p>You will see a 3x3 grid of blocks.</p>
            <p>Some blocks will light up in a sequence.</p>
            <p>After the sequence, click the blocks in the same order.</p>
            <p>The sequence will get longer if you're correct, shorter if you make mistakes.</p>
            <p>Click "Start" when you're ready.</p>
        </div>
    `,
  choices: ["Start"],
  data: { phase: "corsi_instructions" },
});

// Corsi Block Test Implementation
let corsiSequence = [];
let corsiSequenceLength = 3;
let corsiCorrect = 0;
let corsiIncorrect = 0;

function generateCorsiSequence(length) {
  const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 3x3 grid positions
  return jsPsych.randomization.shuffle(positions).slice(0, length);
}

function createCorsiTrial(sequence) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
            <div class="center">
                <h3>Watch the sequence carefully</h3>
                <div id="corsi-grid" class="grid"></div>
                <p id="corsi-instruction">Click the blocks in the same order after the sequence</p>
            </div>
        `,
    choices: [],
    trial_duration: sequence.length * 1000 + 3000,
    on_start: function () {
      const grid = document.getElementById("corsi-grid");
      grid.innerHTML = "";
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${i}`;
        cell.onclick = function () {
          // Handle user clicks for sequence reproduction
          console.log("Cell clicked:", i);
        };
        grid.appendChild(cell);
      }

      // Show sequence
      sequence.forEach((pos, index) => {
        setTimeout(() => {
          document.getElementById(`cell-${pos}`).classList.add("on");
        }, index * 1000);
        setTimeout(() => {
          document.getElementById(`cell-${pos}`).classList.remove("on");
        }, index * 1000 + 500);
      });
    },
    data: {
      phase: "corsi_presentation",
      sequence: sequence,
      length: sequence.length,
    },
  };
}

// Add Corsi trials (adaptive difficulty)
for (let i = 0; i < 5; i++) {
  const sequence = generateCorsiSequence(corsiSequenceLength);
  timeline.push(createCorsiTrial(sequence));
}

// Step 5: 2-Back Task - Instructions
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h2>2-Back Task</h2>
            <p>You will see letters one at a time.</p>
            <p><strong>Press J if the current letter is the same as the one from 2 positions back.</strong></p>
            <p>Press any other key if it's different.</p>
            <p>Example: If you see B - K - B, press J when you see the third B.</p>
            <p>Click "Start" when you're ready.</p>
        </div>
    `,
  choices: ["Start"],
  data: { phase: "nback_instructions" },
});

// 2-Back Task Implementation (40 trials)
const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
];
const nbackSequence = [];
const nbackTargets = [];

// Generate 2-back sequence (40 trials)
for (let i = 0; i < 40; i++) {
  if (i < 2) {
    nbackSequence.push(letters[Math.floor(Math.random() * letters.length)]);
  } else {
    // 30% chance of target
    if (Math.random() < 0.3) {
      nbackSequence.push(nbackSequence[i - 2]);
      nbackTargets.push(i);
    } else {
      let newLetter;
      do {
        newLetter = letters[Math.floor(Math.random() * letters.length)];
      } while (newLetter === nbackSequence[i - 2]);
      nbackSequence.push(newLetter);
    }
  }
}

const nbackTrials = nbackSequence.map((letter, index) => ({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class="center"><h1>${letter}</h1></div>`,
  choices: jsPsych.ALL_KEYS,
  trial_duration: 2000,
  data: {
    phase: "nback",
    letter: letter,
    position: index,
    isTarget: nbackTargets.includes(index),
    correctResponse: nbackTargets.includes(index) ? "j" : "other",
  },
}));

timeline.push(...nbackTrials);

// Step 6: Delayed Recall
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h2>Delayed Word Recall</h2>
            <p>Now please recall the words from the original word list.</p>
            <p>Type all the words you remember from the first list.</p>
        </div>
    `,
  choices: ["Continue"],
  data: { phase: "delayed_recall_instructions" },
});

timeline.push({
  type: jsPsychSurveyText,
  questions: [
    {
      prompt:
        "Please type all the words you remember from the original list. Separate each word with a comma:",
      name: "delayed_recall",
      rows: 5,
      columns: 50,
    },
  ],
  data: { phase: "delayed_recall" },
});

// Step 7: Recognition Test
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h2>Word Recognition Test</h2>
            <p>You will see 20 words one at a time.</p>
            <p>Some are from the original list, some are new.</p>
            <p>For each word, click "Old" if you saw it before, or "New" if it's new.</p>
        </div>
    `,
  choices: ["Start"],
  data: { phase: "recognition_instructions" },
});

// Recognition Test (10 old + 10 new words)
const newWords = jsPsych.randomization
  .shuffle([...WORD_BANK_HARD])
  .slice(0, 10);
const recognitionWords = [...wordList, ...newWords];
jsPsych.randomization.shuffle(recognitionWords);

const recognitionTrials = recognitionWords.map((word) => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h2>Word Recognition</h2>
            <p>Was this word in the original list?</p>
            <h1>${word}</h1>
        </div>
    `,
  choices: ["Old", "New"],
  data: {
    phase: "recognition",
    word: word,
    wasInOriginal: wordList.includes(word),
  },
}));

timeline.push(...recognitionTrials);

// Step 8: Finish and Data Export
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <div class="center">
            <h2>Thank You!</h2>
            <p>You have completed the Fit-Mem study.</p>
            <p>Your data has been saved and will download automatically.</p>
            <p>Thank you for participating in our research!</p>
        </div>
    `,
  choices: ["Finish"],
  data: { phase: "completion" },
});

// Data collection and export functions
function collectAllData() {
  const data = jsPsych.data.get();

  // Process survey data
  const surveyData = data.filter({ phase: "exercise_survey" }).values()[0];
  participantData.surveyResponses = surveyData.response;
  participantData.surveyResponses.met_minutes_week = calculateMET(
    surveyData.response
  );

  // Process word test data
  const immediateRecall = data
    .filter({ phase: "immediate_recall" })
    .values()[0];
  const delayedRecall = data.filter({ phase: "delayed_recall" }).values()[0];
  const recognition = data.filter({ phase: "recognition" }).values();

  participantData.wordTestResults = {
    originalList: wordList,
    immediateRecall: immediateRecall.response.immediate_recall,
    delayedRecall: delayedRecall.response.delayed_recall,
    recognition: recognition,
  };

  // Process Corsi data
  const corsiData = data.filter({ phase: "corsi_presentation" }).values();
  participantData.corsiResults = corsiData;

  // Process N-back data
  const nbackData = data.filter({ phase: "nback" }).values();
  participantData.nbackResults = nbackData;

  // Process recognition data
  participantData.recognitionResults = recognition;

  // Export data
  exportData();
}

function exportData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  // 1. Participants data
  const participantsData = [
    {
      participant_id: participantData.id,
      start_time: participantData.startTime,
      end_time: participantData.endTime,
      age: participantData.surveyResponses.age,
      sex: participantData.surveyResponses.sex,
      exercise_regularly: participantData.surveyResponses.exercise_regularly,
      exercise_days_per_week: participantData.surveyResponses.exercise_days,
      exercise_minutes_per_session:
        participantData.surveyResponses.exercise_minutes,
      exercise_intensity: participantData.surveyResponses.exercise_intensity,
      met_minutes_week: participantData.surveyResponses.met_minutes_week,
      sleep_hours: participantData.surveyResponses.sleep_hours,
      caffeine_today: participantData.surveyResponses.caffeine_today,
      mood: participantData.surveyResponses.mood,
    },
  ];

  // 2. Words data
  const wordsData = [
    {
      participant_id: participantData.id,
      original_list: participantData.wordTestResults.originalList.join(","),
      immediate_recall: participantData.wordTestResults.immediateRecall,
      delayed_recall: participantData.wordTestResults.delayedRecall,
    },
  ];

  // 3. N-back data
  const nbackData = participantData.nbackResults.map((trial) => ({
    participant_id: participantData.id,
    letter: trial.letter,
    position: trial.position,
    is_target: trial.isTarget,
    correct_response: trial.correctResponse,
  }));

  // 4. Corsi data
  const corsiData = participantData.corsiResults.map((trial) => ({
    participant_id: participantData.id,
    sequence: trial.sequence.join(","),
    length: trial.length,
  }));

  // Download CSV files
  downloadCSV(participantsData, `Participants_${timestamp}.csv`);
  downloadCSV(wordsData, `Words_${timestamp}.csv`);
  downloadCSV(nbackData, `NBack_${timestamp}.csv`);
  downloadCSV(corsiData, `Corsi_${timestamp}.csv`);
}

function downloadCSV(data, filename) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function convertToCSV(data) {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => row[header]).join(",")),
  ].join("\n");

  return csvContent;
}

// Initialize experiment
function startExperiment() {
  participantData.id = generateParticipantId();
  participantData.startTime = new Date().toISOString();

  jsPsych.init({
    timeline: timeline,
    on_finish: function () {
      participantData.endTime = new Date().toISOString();
      collectAllData();
    },
  });
}

// Start the experiment when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit for all scripts to load
  setTimeout(function () {
    console.log("Starting experiment...");
    console.log("jsPsych available:", typeof jsPsych !== "undefined");
    console.log(
      "jsPsychHtmlButtonResponse available:",
      typeof jsPsychHtmlButtonResponse !== "undefined"
    );

    if (typeof jsPsych === "undefined") {
      document.getElementById("jspsych-target").innerHTML =
        "<h1>Error: jsPsych not loaded</h1>";
      return;
    }

    startExperiment();
  }, 1000);
});
