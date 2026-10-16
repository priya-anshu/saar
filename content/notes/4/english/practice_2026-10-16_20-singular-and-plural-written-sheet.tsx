    import type { NoteColors } from "@/components/NoteKit";
    import { PracticePage, type PracticeSection } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#7C3AED", "#0F766E", "#BE123C", "#B45309"],
    dark: ["#C4B5FD", "#5EEAD4", "#FDA4AF", "#FCD34D"],
    };

    const sections: PracticeSection[] = [
    {
        title: "Make the plural",
        questions: [
        { q: "Write the plural of: (a) baby  (b) city  (c) story  (d) lady", hint: "A consonant comes before y. Change y to ies.", answer: "(a) babies  (b) cities  (c) stories  (d) ladies", level: "medium", marks: 4 },
        { q: "Write the plural of: (a) boy  (b) key  (c) monkey  (d) day", hint: "A vowel comes before y. Just add s.", answer: "(a) boys  (b) keys  (c) monkeys  (d) days", level: "medium", marks: 4 },
        { q: "Write the plural of: (a) leaf  (b) knife  (c) wolf  (d) shelf", hint: "Change f or fe to ves.", answer: "(a) leaves  (b) knives  (c) wolves  (d) shelves", level: "medium", marks: 4 },
        { q: "Write the plural of: (a) potato  (b) tomato  (c) bus  (d) dish", hint: "All four words take es.", answer: "(a) potatoes  (b) tomatoes  (c) buses  (d) dishes", level: "medium", marks: 4 },
        { q: "Write the plural of: (a) child  (b) woman  (c) tooth  (d) mouse", hint: "These words change completely.", answer: "(a) children  (b) women  (c) teeth  (d) mice", level: "medium", marks: 4 },
        ],
    },
    {
        title: "Same word or always plural",
        questions: [
        {
            q: "Write the plural of: (a) sheep  (b) fish  (c) deer",
            hint: "These words do not change.",
            answer: "(a) sheep  (b) fish  (c) deer",
            steps: ["Sheep, fish and deer have the same form in singular and plural.", "We say one sheep, two sheep."],
            level: "medium",
            marks: 3,
        },
        { q: "Write two things that are always plural.", hint: "Think of things we wear or things with two parts.", answer: "Answers will vary. For example: scissors, trousers, jeans, shorts.", level: "medium", marks: 2 },
        ],
    },
    {
        title: "Spot and correct",
        questions: [
        { q: "Write the singular of: (a) babies  (b) leaves  (c) men  (d) geese", hint: "Change each word back to one.", answer: "(a) baby  (b) leaf  (c) man  (d) goose", level: "medium", marks: 4 },
        { q: "Correct the sentence: The babys are sleeping.", answer: "The babies are sleeping.", steps: ["Baby has a consonant before y.", "Change y to ies to get babies."], level: "medium", marks: 1 },
        { q: "Correct the sentence: I saw two wolfs in the zoo.", answer: "I saw two wolves in the zoo.", level: "medium", marks: 1 },
        { q: "Correct the sentence: There are five sheeps in the field.", hint: "Sheep does not change in the plural.", answer: "There are five sheep in the field.", level: "medium", marks: 1 },
        {
            q: "Correct the sentence: The childs ate three tomatos.",
            hint: "There are two mistakes.",
            answer: "The children ate three tomatoes.",
            steps: ["Child becomes children.", "Tomato adds es to become tomatoes."],
            level: "hard",
            marks: 2,
        },
        ],
    },
    {
        title: "Write and arrange",
        questions: [
        { q: "Make the sentence plural: The baby is crying.", hint: "Change baby, and change is to are.", answer: "The babies are crying.", level: "hard", marks: 2 },
        { q: "Make the sentence plural: This is a leaf.", hint: "Change This to These, is to are, and leaf to leaves.", answer: "These are leaves.", level: "hard", marks: 2 },
        {
            q: "Arrange the words to make a sentence: are / geese / the / swimming / pond / in",
            hint: "Start with The.",
            answer: "The geese are swimming in the pond.",
            level: "hard",
            marks: 2,
        },
        ],
    },
    ];

    export default function Class4SingularPluralWrittenSheet() {
    return (
        <PracticePage
        title="Singular and Plural: Written Sheet"
        intro="Write your answers in your notebook first. Check the last letters of each word before you change it."
        colors={colors}
        sections={sections}
        />
    );
    }