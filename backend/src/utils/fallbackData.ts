
import { Question, TestType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const fallbackQuestionsMap: Record<string, Partial<Question>[]> = {
    "SAT_MATH": [
        { questionText: "If 3x + 12 = 24, what is the value of x - 4?", options: ["0", "4", "8", "12"], correctAnswerIndex: 0, explanation: "3x + 12 = 24 => 3x = 12 => x = 4. Therefore, x - 4 = 4 - 4 = 0.", topic: "Algebra", difficulty: "easy" },
        { questionText: "A line in the xy-plane passes through the origin and has a slope of 1/7. Which of the following points lies on the line?", options: ["(0, 7)", "(1, 7)", "(7, 1)", "(14, 2)"], correctAnswerIndex: 2, explanation: "The equation of the line is y = (1/7)x. If x=7, y=1. So (7,1) lies on the line.", topic: "Heart of Algebra", difficulty: "medium" },
        { questionText: "If f(x) = (x-2)^2 + 3, what is the minimum value of the function?", options: ["-2", "2", "3", "0"], correctAnswerIndex: 2, explanation: "The vertex form y = a(x-h)^2 + k shows the minimum at k when a > 0. Here k=3.", topic: "Passport to Advanced Math", difficulty: "medium" },
        { questionText: "What is the value of 5! / 3!?", options: ["20", "120", "60", "10"], correctAnswerIndex: 0, explanation: "5! = 120, 3! = 6. 120/6 = 20.", topic: "Arithmetic", difficulty: "easy" },
        { questionText: "If a triangle has sides 3, 4, and x, which of the following could be the value of x?", options: ["1", "5", "7", "8"], correctAnswerIndex: 1, explanation: "By the triangle inequality, 3+4 > x, so x < 7. Also 3+x > 4, so x > 1. 5 is the only option.", topic: "Geometry", difficulty: "medium" },
        { questionText: "Solve for x: 2(x + 5) - 3 = 11.", options: ["2", "7", "4", "1"], correctAnswerIndex: 0, explanation: "2x + 10 - 3 = 11 => 2x + 7 = 11 => 2x = 4 => x = 2.", topic: "Algebra", difficulty: "easy" },
        { questionText: "What is the slope of the line passing through (2, 3) and (5, 9)?", options: ["2", "3", "6", "1.5"], correctAnswerIndex: 0, explanation: "Slope = (9-3)/(5-2) = 6/3 = 2.", topic: "Coordinate Geometry", difficulty: "easy" },
        { questionText: "If 2^x = 32, what is x?", options: ["4", "5", "6", "16"], correctAnswerIndex: 1, explanation: "2^5 = 32, so x = 5.", topic: "Exponents", difficulty: "easy" },
        { questionText: "Find the median of the set {3, 1, 4, 1, 5}.", options: ["1", "3", "4", "2.8"], correctAnswerIndex: 1, explanation: "Sorted set: {1, 1, 3, 4, 5}. The middle value is 3.", topic: "Statistics", difficulty: "medium" },
        { questionText: "What is the area of a square with a perimeter of 20?", options: ["20", "25", "400", "16"], correctAnswerIndex: 1, explanation: "Side = 20/4 = 5. Area = 5^2 = 25.", topic: "Geometry", difficulty: "easy" }
    ],
    "SAT_RW": [
        { questionText: "Which choice completes the text with the most logical and precise word or phrase?\n\nAlthough the team's performance was initially ____, they managed to secure a victory in the final minutes of the game.", options: ["exemplary", "lackluster", "consistent", "predictable"], correctAnswerIndex: 1, explanation: "'Lackluster' provides the necessary contrast to the eventual victory.", topic: "Vocabulary", difficulty: "medium" },
        { questionText: "Which of the following sentences uses punctuation correctly?", options: ["The recipe calls for: flour, sugar, and eggs.", "The recipe calls for flour, sugar, and eggs.", "The recipe calls for; flour, sugar, and eggs.", "The recipe calls for, flour, sugar, and eggs."], correctAnswerIndex: 1, explanation: "No punctuation is needed between the verb 'for' and the list.", topic: "Standard English Conventions", difficulty: "easy" },
        { questionText: "The biologist argued that the new species was ____ to the island, meaning it was found nowhere else.", options: ["indigenous", "endemic", "migratory", "introduced"], correctAnswerIndex: 1, explanation: "Endemic refers to a species native and restricted to a certain place.", topic: "Contextual Vocabulary", difficulty: "medium" },
        { questionText: "Which word is a synonym for 'ephemeral'?", options: ["Lasting", "Short-lived", "Infinite", "Ancient"], correctAnswerIndex: 1, explanation: "Ephemeral means lasting for a very short time.", topic: "Vocabulary", difficulty: "medium" },
        { questionText: "Identify the error in the following sentence: 'Neither the players nor the coach were happy.'", options: ["No error", "coach were", "players nor", "with the"], correctAnswerIndex: 1, explanation: "Verb should agree with 'coach' (singular), so 'was happy'.", topic: "Grammar", difficulty: "hard" },
        { questionText: "Which choice best uses a semicolon?", options: ["I like cake; because it is sweet.", "I like cake; it is sweet.", "I like; cake and cookies.", "I like cake; sweet and tasty."], correctAnswerIndex: 1, explanation: "A semicolon connects two independent clauses.", topic: "Punctuation", difficulty: "medium" },
        { questionText: "What does the word 'benevolent' mean?", options: ["Cruel", "Kind", "Strong", "Wealthy"], correctAnswerIndex: 1, explanation: "Benevolent means well-meaning and kindly.", topic: "Vocabulary", difficulty: "easy" },
        { questionText: "Choose the correct possessive: 'The ____ toys were scattered.'", options: ["childrens'", "childrens", "children's", "child's"], correctAnswerIndex: 2, explanation: "'Children' is already plural; the possessive is formed by adding 's.", topic: "Grammar", difficulty: "medium" },
        { questionText: "Which sentence is written in the passive voice?", options: ["The cat chased the mouse.", "The mouse was chased by the cat.", "The cat is chasing the mouse.", "The cat will chase the mouse."], correctAnswerIndex: 1, explanation: "In passive voice, the subject ('mouse') receives the action.", topic: "Grammar", difficulty: "medium" },
        { questionText: "What is the main purpose of a thesis statement?", options: ["To introduce the author", "To provide a summary of the conclusion", "To state the main argument of the essay", "To list the references used"], correctAnswerIndex: 2, explanation: "A thesis statement clarifies the central claim or argument.", topic: "Writing Skills", difficulty: "easy" }
    ],
    "ACT_MATH": [
        { questionText: "In the standard (x,y) coordinate plane, what is the slope of the line 4x + 7y = 12?", options: ["4/7", "-4/7", "7/4", "-7/4"], correctAnswerIndex: 1, explanation: "Rewrite as y = (-4/7)x + 12/7. Slope is -4/7.", topic: "Coordinate Geometry", difficulty: "medium" },
        { questionText: "If log(x) = 2, what is x?", options: ["10", "100", "2", "20"], correctAnswerIndex: 1, explanation: "10^2 = 100.", topic: "Algebra", difficulty: "easy" },
        { questionText: "What is the area of a circle with a radius of 5?", options: ["10π", "25π", "5π", "100π"], correctAnswerIndex: 1, explanation: "Area = πr^2 = 25π.", topic: "Geometry", difficulty: "easy" },
        { questionText: "If sin(θ) = 3/5, what is cos(θ) for an acute angle?", options: ["3/4", "4/5", "1/2", "5/3"], correctAnswerIndex: 1, explanation: "cos^2 = 1 - sin^2 = 1 - 9/25 = 16/25. cos = 4/5.", topic: "Trigonometry", difficulty: "medium" },
        { questionText: "Solve for x: 3(x - 4) = 15.", options: ["9", "7", "5", "11"], correctAnswerIndex: 0, explanation: "3x - 12 = 15 => 3x = 27 => x = 9.", topic: "Algebra", difficulty: "easy" },
        { questionText: "What is the average of 10, 20, and 60?", options: ["30", "45", "35", "25"], correctAnswerIndex: 0, explanation: "(10+20+60)/3 = 90/3 = 30.", topic: "Statistics", difficulty: "easy" },
        { questionText: "If x + y = 10 and x - y = 2, what is x?", options: ["4", "6", "8", "5"], correctAnswerIndex: 1, explanation: "Adding equations: 2x = 12 => x = 6.", topic: "Algebra", difficulty: "medium" },
        { questionText: "Solve for x: x^2 - 9 = 0.", options: ["3 only", "-3 only", "3 and -3", "0"], correctAnswerIndex: 2, explanation: "x^2 = 9 => x = ±3.", topic: "Algebra", difficulty: "easy" },
        { questionText: "How many degrees are in a hexagon?", options: ["360", "540", "720", "1080"], correctAnswerIndex: 2, explanation: "(6-2)*180 = 720.", topic: "Geometry", difficulty: "medium" },
        { questionText: "What is 20% of 150?", options: ["15", "30", "20", "45"], correctAnswerIndex: 1, explanation: "0.20 * 150 = 30.", topic: "Arithmetic", difficulty: "easy" }
    ],
    "ACT_ENGLISH": [
        { questionText: "Choose the correct option: 'The group of students ____ going on a field trip tomorrow.'", options: ["is", "are", "was", "were"], correctAnswerIndex: 0, explanation: "'The group' is singular.", topic: "Subject-Verb Agreement", difficulty: "easy" },
        { questionText: "Which is most concise? 'The reason why he was late was because of the traffic'", options: ["He was late because of the traffic.", "The reason he was late was the traffic.", "Traffic made him late.", "He was late due to the fact that there was traffic."], correctAnswerIndex: 2, explanation: "'Traffic made him late' is most direct.", topic: "Style", difficulty: "medium" },
        { questionText: "Select the correct punctuation: 'I have three hobbies; running, swimming, and reading.'", options: ["hobbies: running", "hobbies running", "hobbies; running", "hobbies—running"], correctAnswerIndex: 0, explanation: "Colon introduces the list.", topic: "Punctuation", difficulty: "easy" },
        { questionText: "Select the correct word: 'The team won ____ first game.'", options: ["its", "it's", "their", "they're"], correctAnswerIndex: 0, explanation: "'Its' indicates possession for the team.", topic: "Pronouns", difficulty: "easy" },
        { questionText: "Change to singular: 'Every student in the class brought their own book.'", options: ["No change", "his or her own", "they're own", "one's own"], correctAnswerIndex: 1, explanation: "'Every student' is singular.", topic: "Agreement", difficulty: "medium" },
        { questionText: "Identify the conjunction: 'I wanted to go, but I was too tired.'", options: ["wanted", "but", "too", "tired"], correctAnswerIndex: 1, explanation: "'But' is a coordinating conjunction.", topic: "Grammar", difficulty: "easy" },
        { questionText: "Which word is an adjective? 'The quick brown fox jumps over the lazy dog.'", options: ["quick", "jumps", "fox", "over"], correctAnswerIndex: 0, explanation: "'Quick' describes the fox.", topic: "Parts of Speech", difficulty: "easy" },
        { questionText: "Choose the correct form: 'She has ____ to the store already.'", options: ["went", "gone", "goed", "going"], correctAnswerIndex: 1, explanation: "'Gone' is the past participle used with 'has'.", topic: "Verbs", difficulty: "medium" },
        { questionText: "Avoid wordiness: 'At this point in time, we are ready.'", options: ["Now", "Currently", "At this moment", "All of the above"], correctAnswerIndex: 3, explanation: "All are better than the phrase 'at this point in time'.", topic: "Style", difficulty: "medium" },
        { questionText: "Whose vs Who's: '____ going to the party?'", options: ["Whose", "Who's", "Whos", "Who is"], correctAnswerIndex: 1, explanation: "'Who's' is the contraction of 'who is'.", topic: "Grammar", difficulty: "easy" }
    ],
    "ACT_SCIENCE": [
        { questionText: "What is the purpose of a control group?", options: ["Baseline for comparison", "Ensure significance", "Increase sample size", "Prove hypothesis"], correctAnswerIndex: 0, explanation: "Used for comparison.", topic: "Experimental Design", difficulty: "medium" },
        { questionText: "Light intensity is varied to measure growth. What is the independent variable?", options: ["Height", "Intensity", "Water", "Type"], correctAnswerIndex: 1, explanation: "The manipulated variable.", topic: "Experiments", difficulty: "easy" },
        { questionText: "Which cell part produces energy?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correctAnswerIndex: 2, explanation: "Mitochondria create ATP.", topic: "Biology", difficulty: "easy" },
        { questionText: "Boiling point of water at sea level?", options: ["0°C", "100°C", "50°C", "212°F"], correctAnswerIndex: 1, explanation: "100°C.", topic: "Physics", difficulty: "easy" },
        { questionText: "Hypothesis A: CO2 warms. Hypothesis B: CO2 cools. Warming observed. Support?", options: ["Hypothesis A", "Hypothesis B", "Both", "Neither"], correctAnswerIndex: 0, explanation: "Observation matches A.", topic: "Conflict Analysis", difficulty: "medium" },
        { questionText: "What is the pH of a neutral solution?", options: ["0", "7", "14", "1"], correctAnswerIndex: 1, explanation: "pH 7 is neutral.", topic: "Chemistry", difficulty: "easy" },
        { questionText: "Which is a chemical change?", options: ["Ice melting", "Water boiling", "Paper burning", "Glass breaking"], correctAnswerIndex: 2, explanation: "Burning creates new substances.", topic: "Chemistry", difficulty: "medium" },
        { questionText: "What does an anemometer measure?", options: ["Pressure", "Humidity", "Wind speed", "Rainfall"], correctAnswerIndex: 2, explanation: "Measures wind speed.", topic: "Earth Science", difficulty: "medium" },
        { questionText: "In the periodic table, what is the atomic number?", options: ["Protons", "Neutrons", "Electrons", "Mass"], correctAnswerIndex: 0, explanation: "Atomic number = number of protons.", topic: "Chemistry", difficulty: "easy" },
        { questionText: "Which planet is largest?", options: ["Mars", "Earth", "Jupiter", "Venus"], correctAnswerIndex: 2, explanation: "Jupiter is the largest planet.", topic: "Astronomy", difficulty: "easy" }
    ],
    "AP_BIOLOGY": [
        { questionText: "Function of mitochondria?", options: ["Protein", "Waste", "ATP", "Genes"], correctAnswerIndex: 2, explanation: "Energy production.", topic: "Biology", difficulty: "medium" },
        { questionText: "Role of DNA polymerase?", options: ["Unzip", "Add nucleotides", "Splicing", "Translate"], correctAnswerIndex: 1, explanation: "Builds DNA strands.", topic: "Molecular Bio", difficulty: "hard" },
        { questionText: "Blood sugar hormone?", options: ["Adrenaline", "Insulin", "Estrogen", "Thyroxine"], correctAnswerIndex: 1, explanation: "Insulin lowers sugar.", topic: "Physiology", difficulty: "medium" },
        { questionText: "Sunlight to energy process?", options: ["Respiration", "Fermentation", "Photosynthesis", "Digestion"], correctAnswerIndex: 2, explanation: "Photosynthesis.", topic: "Plant Bio", difficulty: "easy" },
        { questionText: "Which of the following describes the secondary structure of a protein?", options: ["Amino acid sequence", "Alpha helices and beta sheets", "Overall 3D shape", "Interaction between subunits"], correctAnswerIndex: 1, explanation: "Secondary structure involves hydrogen bonding into helices and sheets.", topic: "Biochemistry", difficulty: "medium" }
    ],
    "AP_USH": [
        { questionText: "19th Amendment granted?", options: ["Black vote", "Women vote", "Arms", "Abolition"], correctAnswerIndex: 1, explanation: "Women's suffrage.", topic: "History", difficulty: "medium" },
        { questionText: "Author of Declaration?", options: ["Washington", "Franklin", "Jefferson", "Adams"], correctAnswerIndex: 2, explanation: "Thomas Jefferson.", topic: "Revolution", difficulty: "easy" },
        { questionText: "Main cause of Civil War?", options: ["Slavery", "Tax", "Gold", "Prohibition"], correctAnswerIndex: 0, explanation: "Slavery and states' rights.", topic: "Civil War", difficulty: "easy" },
        { questionText: "What was the purpose of the Monroe Doctrine?", options: ["End slavery", "Prevent European interference in the Americas", "Annex Texas", "Open trade with China"], correctAnswerIndex: 1, explanation: "It declared the Western Hemisphere off-limits to further European colonization.", topic: "Foreign Policy", difficulty: "medium" }
    ],
    "AP_CALC": [
        { questionText: "f(x) = x^3 - 5x + 2, f'(2)?", options: ["12", "7", "3", "0"], correctAnswerIndex: 1, explanation: "f'(x) = 3x^2 - 5.", topic: "Calculus", difficulty: "medium" },
        { questionText: "Integral of 2x dx?", options: ["x^2 + C", "x + C", "2 + C", "x^3 + C"], correctAnswerIndex: 0, explanation: "∫2x dx = x^2 + C.", topic: "Integration", difficulty: "easy" },
        { questionText: "Derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "tan(x)", "sin(x)"], correctAnswerIndex: 0, explanation: "d/dx[sin] = cos.", topic: "Differentiation", difficulty: "easy" },
        { questionText: "The limit of (1/x) as x approaches infinity is?", options: ["1", "0", "Infinity", "Undefined"], correctAnswerIndex: 1, explanation: "As x grows, 1/x approaches zero.", topic: "Limits", difficulty: "easy" }
    ],
    "AP_CHEM": [
        { questionText: "What is the molar mass of H2O?", options: ["10 g/mol", "18 g/mol", "16 g/mol", "2 g/mol"], correctAnswerIndex: 1, explanation: "H=1, O=16. (2*1) + 16 = 18.", topic: "Stoichiometry", difficulty: "easy" },
        { questionText: "Which bond involves the sharing of electron pairs?", options: ["Ionic", "Covalent", "Hydrogen", "Metallic"], correctAnswerIndex: 1, explanation: "Covalent bonds share electrons.", topic: "Bonding", difficulty: "easy" },
        { questionText: "A solution with a pH of 3 is?", options: ["Weakly basic", "Strongly acidic", "Neutral", "Weakly acidic"], correctAnswerIndex: 1, explanation: "pH 0-6 is acidic, 3 is standard acidic.", topic: "Acids and Bases", difficulty: "medium" }
    ],
    "AP_PHYSICS": [
        { questionText: "Force equals mass times ____?", options: ["Velocity", "Acceleration", "Gravity", "Time"], correctAnswerIndex: 1, explanation: "F = ma.", topic: "Mechanics", difficulty: "easy" },
        { questionText: "What is the unit of electrical resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], correctAnswerIndex: 2, explanation: "Resistance is measured in Ohms (Ω).", topic: "Electricity", difficulty: "easy" },
        { questionText: "The acceleration due to gravity on Earth is approximately?", options: ["5 m/s²", "9.8 m/s²", "12 m/s²", "0 m/s²"], correctAnswerIndex: 1, explanation: "g ≈ 9.8 m/s².", topic: "Mechanics", difficulty: "easy" }
    ],
    "AP_PSYCH": [
        { questionText: "Who is known as the father of psychoanalysis?", options: ["B.F. Skinner", "Sigmund Freud", "Ivan Pavlov", "Carl Rogers"], correctAnswerIndex: 1, explanation: "Freud developed psychoanalytic theory.", topic: "History of Psychology", difficulty: "easy" },
        { questionText: "The 'fight or flight' response is triggered by which system?", options: ["Parasympathetic", "Sympathetic", "Somatic", "Central"], correctAnswerIndex: 1, explanation: "The sympathetic nervous system prepares the body for stress.", topic: "Biological Bases", difficulty: "medium" }
    ],
    "AP_WORLD": [
        { questionText: "The Silk Road primarily connected which two regions?", options: ["Europe and Africa", "China and the Mediterranean", "Americas and Europe", "India and Japan"], correctAnswerIndex: 1, explanation: "It was a major trade route between the East and West.", topic: "Trade Routes", difficulty: "easy" },
        { questionText: "The Industrial Revolution first began in which country?", options: ["USA", "France", "Great Britain", "Germany"], correctAnswerIndex: 2, explanation: "It started in Britain in the late 1700s.", topic: "Modern Era", difficulty: "easy" }
    ],
    "AP_LIT": [
        { questionText: "A poem with 14 lines and a specific rhyme scheme is called a ____?", options: ["Ode", "Sonnet", "Haiku", "Epic"], correctAnswerIndex: 1, explanation: "A sonnet has 14 lines, typically in iambic pentameter.", topic: "Poetry", difficulty: "easy" },
        { questionText: "Which literary device involves a comparison using 'like' or 'as'?", options: ["Metaphor", "Simile", "Personification", "Alliteration"], correctAnswerIndex: 1, explanation: "A simile uses comparison words.", topic: "Literary Devices", difficulty: "easy" }
    ],
    "DEFAULT": [
        { questionText: "Capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswerIndex: 2, explanation: "Paris.", topic: "Knowledge", difficulty: "easy" },
        { questionText: "Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswerIndex: 1, explanation: "Mars.", topic: "Science", difficulty: "easy" }
    ]
};

export const generateRobustFallback = (testType: TestType, numQuestions: number): Question[] => {
    const typeStr = testType.toString().toUpperCase();
    let pool: Partial<Question>[] = [];

    if (typeStr.includes("SAT")) {
        if (typeStr.includes("MATH") || typeStr.includes("ALGEBRA") || typeStr.includes("GEOMETRY")) {
            pool = fallbackQuestionsMap["SAT_MATH"];
        } else if (typeStr.includes("DIAGNOSTIC") || typeStr.includes("RW") || typeStr.includes("READING") || typeStr.includes("WRITING")) {
            pool = fallbackQuestionsMap["SAT_RW"];
        } else {
            pool = fallbackQuestionsMap["SAT_MATH"];
        }
    } else if (typeStr.includes("ACT")) {
        if (typeStr.includes("MATH")) {
            pool = fallbackQuestionsMap["ACT_MATH"];
        } else if (typeStr.includes("ENGLISH") || typeStr.includes("WRITING") || typeStr.includes("READING")) {
            pool = fallbackQuestionsMap["ACT_ENGLISH"];
        } else if (typeStr.includes("SCIENCE") || typeStr.includes("DIAGNOSTIC")) {
            pool = fallbackQuestionsMap["ACT_SCIENCE"];
        } else {
            pool = fallbackQuestionsMap["ACT_MATH"];
        }
    } else if (typeStr.includes("AP")) {
        if (typeStr.includes("BIOLOGY")) pool = fallbackQuestionsMap["AP_BIOLOGY"];
        else if (typeStr.includes("CHEM")) pool = fallbackQuestionsMap["AP_CHEM"];
        else if (typeStr.includes("PHYSICS")) pool = fallbackQuestionsMap["AP_PHYSICS"];
        else if (typeStr.includes("PSYCH")) pool = fallbackQuestionsMap["AP_PSYCH"];
        else if (typeStr.includes("WORLD")) pool = fallbackQuestionsMap["AP_WORLD"];
        else if (typeStr.includes("USH") || typeStr.includes("HISTORY")) pool = fallbackQuestionsMap["AP_USH"];
        else if (typeStr.includes("CALC")) pool = fallbackQuestionsMap["AP_CALC"];
        else if (typeStr.includes("LIT") || typeStr.includes("ENGLISH")) pool = fallbackQuestionsMap["AP_LIT"];
        else pool = fallbackQuestionsMap["AP_BIOLOGY"];
    } else {
        pool = fallbackQuestionsMap["DEFAULT"];
    }

    if (!pool || pool.length === 0) pool = fallbackQuestionsMap["DEFAULT"];

    const results: Question[] = [];
    for (let i = 0; i < numQuestions; i++) {
        const template = pool[i % pool.length];
        results.push({
            _id: uuidv4(),
            questionText: template.questionText || "Placeholder Question",
            options: template.options as string[] || ["A", "B", "C", "D"],
            correctAnswerIndex: template.correctAnswerIndex ?? 0,
            explanation: template.explanation || "No explanation.",
            topic: template.topic || "General",
            difficulty: template.difficulty as any || "medium"
        });
    }
    return results;
};
