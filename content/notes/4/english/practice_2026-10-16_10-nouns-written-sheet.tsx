    import type { NoteColors } from "@/components/NoteKit";
    import { PracticePage, type PracticeSection } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#0F766E", "#BE123C", "#B45309", "#4338CA"],
    dark: ["#5EEAD4", "#FDA4AF", "#FCD34D", "#A5B4FC"],
    };

    const sections: PracticeSection[] = [
    {
        title: "Common or proper?",
        questions: [
        {
            q: "Write C for a common noun or P for a proper noun: (a) girl  (b) Riya  (c) river  (d) Ganga",
            hint: "A proper noun is a special name and starts with a capital letter.",
            answer: "(a) C  (b) P  (c) C  (d) P",
            level: "medium",
            marks: 4,
        },
        {
            q: "Write a proper noun for each common noun: (a) city  (b) day  (c) river",
            hint: "Think of one particular city, one particular day and one particular river.",
            answer: "Answers will vary. For example: (a) Jaipur  (b) Monday  (c) Yamuna",
            level: "medium",
            marks: 3,
        },
        {
            q: "Write a common noun for each proper noun: (a) Tommy (a pet dog)  (b) Mumbai  (c) Diwali",
            answer: "(a) dog (or pet)  (b) city  (c) festival",
            level: "medium",
            marks: 3,
        },
        {
            q: "Sort these nouns into common nouns and proper nouns: mango, Kabir, school, Chennai, doctor, Sunday",
            answer: "Common nouns: mango, school, doctor. Proper nouns: Kabir, Chennai, Sunday.",
            level: "medium",
            marks: 3,
        },
        ],
    },
    {
        title: "Spot and correct",
        questions: [
        {
            q: "Rewrite with the correct capital letters: my friend rohan lives in pune.",
            hint: "Look for the special names.",
            answer: "My friend Rohan lives in Pune.",
            steps: ["Start the sentence with a capital letter: My.", "Rohan is a name, so it needs a capital letter.", "Pune is the name of a city, so it needs a capital letter.", "Friend stays small because it is a common noun."],
            level: "medium",
            marks: 2,
        },
        {
            q: "Rewrite correctly: we go to school on monday and tuesday.",
            hint: "Days of the week are proper nouns.",
            answer: "We go to school on Monday and Tuesday.",
            level: "medium",
            marks: 2,
        },
        {
            q: "Rewrite correctly: last sunday, anita visited the taj mahal in agra.",
            answer: "Last Sunday, Anita visited the Taj Mahal in Agra.",
            steps: ["Last gets a capital letter because it begins the sentence.", "Sunday is the name of a day.", "Anita is a person’s name.", "Taj Mahal and Agra are names of places."],
            level: "hard",
            marks: 3,
        },
        {
            q: "Find and fix the mistakes: The Dog is sleeping in the Garden.",
            hint: "Only special names get capital letters in the middle of a sentence.",
            answer: "The dog is sleeping in the garden.",
            steps: ["Dog is a common noun, so it should be dog.", "Garden is a common noun, so it should be garden."],
            level: "medium",
            marks: 2,
        },
        ],
    },
    {
        title: "Find the nouns",
        questions: [
        {
            q: "Write all the nouns in this sentence: Rohan gave a pencil to his sister.",
            hint: "Look for the names of people and things.",
            answer: "Rohan, pencil, sister",
            level: "medium",
            marks: 3,
        },
        {
            q: "Write the proper nouns in this sentence: Meera and Neha visited Jaipur in December.",
            answer: "Meera, Neha, Jaipur, December",
            steps: ["Meera and Neha are names of girls.", "Jaipur is the name of a city.", "December is the name of a month."],
            level: "hard",
            marks: 4,
        },
        {
            q: "Write the common nouns in this sentence: The farmer sells vegetables in the market.",
            answer: "farmer, vegetables, market",
            level: "medium",
            marks: 3,
        },
        ],
    },
    {
        title: "Write and arrange",
        questions: [
        {
            q: "Write a sentence that has one common noun and one proper noun.",
            answer: "Answers will vary. For example: The girl is called Anika. (girl is the common noun and Anika is the proper noun)",
            level: "medium",
            marks: 2,
        },
        {
            q: "Write three proper nouns that name places in India.",
            hint: "Think of cities, states or famous buildings.",
            answer: "Answers will vary. For example: Delhi, Jaipur, Kerala. Each one must start with a capital letter.",
            level: "medium",
            marks: 3,
        },
        {
            q: "Arrange the words to make a sentence: Pune / lives / in / Kabir",
            hint: "Start with the name of the person.",
            answer: "Kabir lives in Pune.",
            level: "medium",
            marks: 2,
        },
        {
            q: "Arrange the words to make a sentence: every / we / winter / Agra / visit",
            answer: "We visit Agra every winter.",
            steps: ["Start with who: We.", "Add the action: visit.", "Add the place: Agra.", "End with when: every winter."],
            level: "hard",
            marks: 2,
        },
        ],
    },
    ];

    export default function Class4NounsWrittenSheet() {
    return (
        <PracticePage
        title="Nouns: Written Sheet"
        intro="Write your answers in your notebook first. Pay close attention to capital letters, then check your answers."
        colors={colors}
        sections={sections}
        />
    );
    }