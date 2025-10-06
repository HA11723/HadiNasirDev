# Fit-Mem: Memory & Exercise Study

A web-based memory and exercise assessment game designed to study the relationship between physical activity and cognitive performance.

## 🎮 What is Fit-Mem?

Fit-Mem is a comprehensive memory and exercise study that includes:

- **Lifestyle Survey** - Demographics and exercise habits with automatic MET calculation
- **Word List Memory Test** - Immediate and delayed verbal memory
- **Corsi Block Task** - Visuospatial working memory
- **2-Back Task** - Working memory with 40 trials
- **Recognition Test** - Memory discrimination (old/new words)

## 🚀 How to Use

### **Option 1: Direct File (Recommended)**

1. Download `simple_fitmem.html`
2. Double-click to open in your browser
3. Complete the study (10-12 minutes)
4. CSV files download automatically

### **Option 2: GitHub Pages**

1. Go to your repository settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch" → "main"
4. Your study will be available at: `https://YOUR_USERNAME.github.io/fitmem-study/simple_fitmem.html`

## 📊 Data Collection

The study automatically generates 4 CSV files:

- **Participants.csv** - Demographics and exercise data
- **Words.csv** - Word memory results
- **NBack.csv** - 2-Back task results
- **Corsi.csv** - Spatial memory results

## 🔬 Research Applications

This tool is designed for:

- Memory and exercise research
- Cognitive assessment studies
- Educational psychology research
- Health and fitness studies

## 🛠️ Technical Details

- **No external dependencies** - Pure HTML/CSS/JavaScript
- **Works offline** - No internet connection required
- **Cross-platform** - Works on any modern browser
- **Mobile-friendly** - Responsive design

## 📋 Study Flow

1. **Welcome & Consent** - Study introduction and consent
2. **Exercise Survey** - Demographics, exercise habits, lifestyle factors
3. **Word List Memory** - 10 words presented, immediate recall
4. **Corsi Block Task** - Spatial sequence memory
5. **2-Back Task** - Working memory with letters
6. **Delayed Recall** - Surprise recall of original words
7. **Recognition Test** - Old/new word discrimination
8. **Data Export** - Automatic CSV download

## 🎯 Features

- **Automatic MET calculation** based on exercise intensity
- **Adaptive difficulty** in memory tasks
- **Comprehensive data collection** for research analysis
- **User-friendly interface** with clear instructions
- **Anonymous data collection** for privacy

## 📈 Data Analysis

The exported CSV files can be analyzed using:

- R (recommended for statistical analysis)
- Python (pandas, scipy)
- Excel/Google Sheets
- SPSS or other statistical software

## 🔧 Customization

To modify the study:

- Edit word lists in the JavaScript section
- Adjust timing in the `setTimeout` functions
- Modify survey questions in the HTML form
- Change CSV export format in the `downloadData()` function

## 📄 License

This project is open source and available for research and educational purposes.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the study.

## 📞 Support

For questions or issues, please open an issue in this repository.
