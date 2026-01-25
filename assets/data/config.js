// ==============================================
// GITHUB CONFIGURATION
// ==============================================

const GITHUB_CONFIG = {
    owner: 'bridge4er-startup',
    repo: 'bridge4er',
    branch: 'main'
};

// Field configuration
const FIELD_CONFIG = {
    civil: {
        name: "Civil Engineering",
        icon: "fa-building",
        color: "#1a5f7a",
        subjects: ["Structure", "Geotech", "Hydropower", "Highway", "Surveying", "Concrete", "Steel"],
        folderPrefix: "Civil Engineering/",
        subjectiveSets: ["Set A", "Set B", "Set C", "Set D"],
        mcqSets: ["Set A", "Set B", "Set C", "Set D"]
    },
    mechanical: {
        name: "Mechanical Engineering",
        icon: "fa-cogs",
        color: "#e74c3c",
        subjects: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer", "Machine Design", "Manufacturing"],
        folderPrefix: "Mechanical Engineering/",
        subjectiveSets: ["Set A", "Set B", "Set C", "Set D"],
        mcqSets: ["Set A", "Set B", "Set C", "Set D"]
    },
    electrical: {
        name: "Electrical Engineering",
        icon: "fa-bolt",
        color: "#f39c12",
        subjects: ["Circuit Theory", "Power Systems", "Control Systems", "Electrical Machines", "Power Electronics"],
        folderPrefix: "Electrical Engineering/",
        subjectiveSets: ["Set A", "Set B", "Set C", "Set D"],
        mcqSets: ["Set A", "Set B", "Set C", "Set D"]
    },
    electronics: {
        name: "Electronics Engineering",
        icon: "fa-microchip",
        color: "#9b59b6",
        subjects: ["Analog Electronics", "Digital Electronics", "VLSI Design", "Communication Systems", "Embedded Systems"],
        folderPrefix: "Electronics Engineering/",
        subjectiveSets: ["Set A", "Set B", "Set C", "Set D"],
        mcqSets: ["Set A", "Set B", "Set C", "Set D"]
    },
    computer: {
        name: "Computer Engineering",
        icon: "fa-laptop-code",
        color: "#3498db",
        subjects: ["Programming", "Data Structures", "Algorithms", "Database Systems", "Computer Networks"],
        folderPrefix: "Computer Engineering/",
        subjectiveSets: ["Set A", "Set B", "Set C", "Set D"],
        mcqSets: ["Set A", "Set B", "Set C", "Set D"]
    }
};

// In config.js, make sure you have this structure:
const EXAM_CONFIG = {
    subjective: {
        folder: "Take Exam/Subjective Exam/",
        freeSets: 2,
        price: 100,
        timer: 3 * 60 * 60 // 3 hours in seconds
    },
    mcq: {
        folder: "Take Exam/Multiple Choice Exam/",
        freeSets: 2,
        price: 50,
        timer: 30 * 60 // 30 minutes in seconds
    }
};

FIELD_CONFIG.civil.subjectiveSets = ["Set A", "Set B", "Set C", "Set D"];
FIELD_CONFIG.civil.mcqSets = ["Set A", "Set B", "Set C", "Set D"];

FIELD_CONFIG.mechanical.subjectiveSets = ["Set A", "Set B", "Set C", "Set D"];
FIELD_CONFIG.mechanical.mcqSets = ["Set A", "Set B", "Set C", "Set D"];

FIELD_CONFIG.electrical.subjectiveSets = ["Set A", "Set B", "Set C", "Set D"];
FIELD_CONFIG.electrical.mcqSets = ["Set A", "Set B", "Set C", "Set D"];

FIELD_CONFIG.electronics.subjectiveSets = ["Set A", "Set B", "Set C", "Set D"];
FIELD_CONFIG.electronics.mcqSets = ["Set A", "Set B", "Set C", "Set D"];

FIELD_CONFIG.computer.subjectiveSets = ["Set A", "Set B", "Set C", "Set D"];
FIELD_CONFIG.computer.mcqSets = ["Set A", "Set B", "Set C", "Set D"];



export { GITHUB_CONFIG, FIELD_CONFIG, EXAM_CONFIG };

// ==============================================
// END OF CONFIGURATION
// ==============================================
