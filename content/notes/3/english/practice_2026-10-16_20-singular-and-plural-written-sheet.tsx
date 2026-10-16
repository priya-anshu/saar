    import type { NoteColors } from "@/components/NoteKit";
    import { PracticePage, type PracticeSection } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#0891B2", "#C026D3", "#B45309", "#15803D"],
    dark: ["#67E8F9", "#F0ABFC", "#FCD34D", "#86EFAC"],
    };

    const sections: PracticeSection[] = [
    {
        title: "Make the plural",
        questions: [
        { q: "Write the plural of: (a) cat  (b) pen  (c) book  (d) hen", hint: "Add s to most words.", answer: "(a) cats  (b) pens  (c) books  (d) hens", level: "easy", marks: 4 },
        { q: "Write the plural of these words by adding es: (a) box  (b) bus  (c) dish  (d) watch", hint: "Words that end in x, s, sh or ch take es.", answer: "(a) boxes  (b) buses  (c) dishes  (d) watches", level: "easy", marks: 4 },
        { q: "Write the plural of: (a) child  (b) man  (c) woman", hint: "These words change completely.", answer: "(a) children  (b) men  (c) women", level: "medium", marks: 3 },
        { q: "Write the plural of: (a) foot  (b) tooth  (c) mouse", hint: "These words also change completely.", answer: "(a) feet  (b) teeth  (c) mice", level: "medium", marks: 3 },
        ],
    },
    {
        title: "Singular or plural?",
        questions: [
        { q: "Write S for singular or P for plural: (a) pencil  (b) books  (c) bus  (d) children", hint: "Singular means one. Plural means more than one.", answer: "(a) S  (b) P  (c) S  (d) P", level: "easy", marks: 4 },
        { q: "Write the singular of: (a) dogs  (b) boxes  (c) men  (d) feet", hint: "Singular means just one.", answer: "(a) dog  (b) box  (c) man  (d) foot", level: "medium", marks: 4 },
        {
            q: "Sort these words into Singular and Plural: cat, cups, bag, mice, tooth, boxes",
            answer: "Singular: cat, bag, tooth. Plural: cups, mice, boxes.",
            steps: ["Cat, bag and tooth each mean one.", "Cups, mice and boxes each mean more than one."],
            level: "medium",
            marks: 3,
        },
        ],
    },
    {
        title: "Fill and correct",
        questions: [
        { q: "Choose the right word: This is a ____. (book / books)", answer: "book", level: "easy", marks: 1 },
        { q: "Choose the right word: These are two ____. (box / boxes)", answer: "boxes", level: "easy", marks: 1 },
        { q: "Correct the sentence: I have two foots.", hint: "Foot changes completely in the plural.", answer: "I have two feet.", level: "medium", marks: 1 },
        { q: "Correct the sentence: Three childs are playing in the park.", answer: "Three children are playing in the park.", level: "medium", marks: 2 },
        { q: "Correct the sentence: There are five bus near the school.", hint: "Five means more than one. Bus ends in s.", answer: "There are five buses near the school.", level: "medium", marks: 2 },
        ],
    },
    {
        title: "Write and arrange",
        questions: [
        { q: "Write a sentence using the word “books”.", hint: "Begin with a capital letter and end with a full stop.", answer: "Answers will vary. For example: I have three books in my bag.", level: "medium", marks: 2 },
        { q: "Write a sentence using the word “children”.", answer: "Answers will vary. For example: The children are playing in the garden.", level: "medium", marks: 2 },
        {
            q: "Arrange the words to make a sentence: are / the / cats / sleeping",
            hint: "Begin with The.",
            answer: "The cats are sleeping.",
            steps: ["Start with The.", "Say who: cats.", "Add are, then what they are doing: sleeping."],
            level: "medium",
            marks: 2,
        },
        ],
    },
    ];

    export default function Class3SingularPluralWrittenSheet() {
    return (
        <PracticePage
        title="Singular and Plural: Written Sheet"
        intro="Write your answers in your notebook first. Remember: one is singular and more than one is plural."
        colors={colors}
        sections={sections}
        />
    );
    }