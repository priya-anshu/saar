    import type { NoteColors } from "@/components/NoteKit";
    import { PracticePage, type PracticeSection } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#E11D48", "#0F766E", "#B45309", "#4338CA"],
    dark: ["#FB7185", "#5EEAD4", "#FCD34D", "#A5B4FC"],
    };

    const sections: PracticeSection[] = [
    {
        title: "Name it",
        questions: [
        { q: "Write any two nouns that name people.", hint: "Think of the people in your family and school.", answer: "Answers will vary. For example: mother, teacher.", level: "easy", marks: 2 },
        { q: "Write any two nouns that name places.", hint: "Where do you go to learn, play or shop?", answer: "Answers will vary. For example: school, park.", level: "easy", marks: 2 },
        { q: "Write any two nouns that name animals.", hint: "Think of pets and farm animals.", answer: "Answers will vary. For example: cow, dog.", level: "easy", marks: 2 },
        { q: "Write any two nouns for things in your school bag.", answer: "Answers will vary. For example: book, pencil.", level: "easy", marks: 2 },
        {
            q: "Sort these nouns into four groups: People, Places, Animals, Things. Nouns: doctor, zoo, cow, bag, park, farmer, cat, pen",
            hint: "Ask yourself: is it a person, a place, an animal or a thing?",
            answer: "People: doctor, farmer. Places: zoo, park. Animals: cow, cat. Things: bag, pen.",
            level: "medium",
            marks: 4,
        },
        ],
    },
    {
        title: "Find the nouns",
        questions: [
        {
            q: "Write the two nouns in this sentence: The girl fed the puppy.",
            answer: "girl, puppy",
            steps: ["Fed is an action word, not a noun.", "Girl names a person.", "Puppy names an animal."],
            level: "easy",
            marks: 2,
        },
        {
            q: "Write the three nouns in this sentence: Mohan reads a book in the library.",
            answer: "Mohan, book, library",
            steps: ["Mohan names a person.", "Book names a thing.", "Library names a place."],
            level: "medium",
            marks: 3,
        },
        { q: "Write the two nouns in this sentence: My father drives a car.", answer: "father, car", level: "easy", marks: 2 },
        {
            q: "Which noun in this sentence names a place? We went to the zoo with our teacher.",
            hint: "A teacher is a person. Which word is a place?",
            answer: "zoo",
            level: "easy",
            marks: 1,
        },
        ],
    },
    {
        title: "Fill, write and arrange",
        questions: [
        { q: "Fill in the blank with a noun: The ____ lays eggs.", hint: "It is a bird on a farm.", answer: "hen", level: "easy", marks: 1 },
        { q: "Fill in the blank with a noun: We read a ____ in class.", answer: "book. Other nouns that fit also count, for example: story.", level: "easy", marks: 1 },
        { q: "Write a sentence using the noun “garden”.", hint: "Start with a capital letter and end with a full stop.", answer: "Answers will vary. For example: The garden is full of flowers.", level: "medium", marks: 2 },
        { q: "Write a sentence using the noun “elephant”.", answer: "Answers will vary. For example: The elephant is very big.", level: "medium", marks: 2 },
        {
            q: "Arrange the words to make a sentence: plays / Meera / park / in / the",
            hint: "Begin with the name of the person.",
            answer: "Meera plays in the park.",
            steps: ["Start with the person: Meera.", "Add the action: plays.", "Finish with the place: in the park."],
            level: "medium",
            marks: 2,
        },
        { q: "Arrange the words to make a sentence: cat / the / milk / drinks", answer: "The cat drinks milk.", level: "medium", marks: 2 },
        ],
    },
    ];

    export default function Class3NounsWrittenSheet() {
    return (
        <PracticePage
        title="Nouns: Written Sheet"
        intro="Write your answers in your notebook first. Use the hint if you are stuck, then check your answer."
        colors={colors}
        sections={sections}
        />
    );
    }