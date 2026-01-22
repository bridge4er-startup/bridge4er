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
        subjectiveSets: []
    },
    mechanical: {
        name: "Mechanical Engineering",
        icon: "fa-cogs",
        color: "#e74c3c",
        subjects: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer", "Machine Design", "Manufacturing"],
        folderPrefix: "Mechanical Engineering/",
        subjectiveSets: []
    },
    electrical: {
        name: "Electrical Engineering",
        icon: "fa-bolt",
        color: "#f39c12",
        subjects: ["Circuit Theory", "Power Systems", "Control Systems", "Electrical Machines", "Power Electronics"],
        folderPrefix: "Electrical Engineering/",
        subjectiveSets: []
    },
    electronics: {
        name: "Electronics Engineering",
        icon: "fa-microchip",
        color: "#9b59b6",
        subjects: ["Analog Electronics", "Digital Electronics", "VLSI Design", "Communication Systems", "Embedded Systems"],
        folderPrefix: "Electronics Engineering/",
        subjectiveSets: []
    },
    computer: {
        name: "Computer Engineering",
        icon: "fa-laptop-code",
        color: "#3498db",
        subjects: ["Programming", "Data Structures", "Algorithms", "Database Systems", "Computer Networks"],
        folderPrefix: "Computer Engineering/",
        subjectiveSets: []
    }
};
