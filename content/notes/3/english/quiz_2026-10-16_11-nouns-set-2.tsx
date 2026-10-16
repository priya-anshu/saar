    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#E11D48", "#0F766E", "#B45309", "#4338CA"],
    dark: ["#FB7185", "#5EEAD4", "#FCD34D", "#A5B4FC"],
    };

    const questions: QuizQuestion[] = [
    { q: "Which word is NOT a noun?", options: ["bird", "sing", "tree", "pond"], answer: 1, explain: "Sing is an action word. Bird, tree and pond are all names of things." },
    { q: "Odd one out: apple, mango, banana, spoon", options: ["apple", "mango", "banana", "spoon"], answer: 3, explain: "Apple, mango and banana are fruits. A spoon is not a fruit." },
    { q: "Odd one out: sparrow, parrot, crow, rabbit", options: ["rabbit", "sparrow", "parrot", "crow"], answer: 0, explain: "Sparrow, parrot and crow are birds. A rabbit is not a bird." },
    { q: "Odd one out: doctor, nurse, pilot, hospital", options: ["doctor", "nurse", "hospital", "pilot"], answer: 2, explain: "Doctor, nurse and pilot are people. A hospital is a place." },
    { q: "Fill in the blank: My ____ teaches us English.", options: ["teacher", "table", "garden", "pencil"], answer: 0, explain: "A teacher is a person who teaches us." },
    { q: "Fill in the blank: We play cricket in the ____.", options: ["spoon", "pillow", "ground", "fish"], answer: 2, explain: "A ground is a place where we play." },
    { q: "In the sentence “The farmer works in the field.” which word names a person?", options: ["farmer", "works", "in", "field"], answer: 0, explain: "A farmer is a person. A field is a place." },
    { q: "In the sentence “The children are playing in the park.” which word names a place?", options: ["children", "playing", "are", "park"], answer: 3, explain: "A park is a place. Children are people." },
    { q: "How many nouns are in this sentence? “Mother bought apples and bananas.”", options: ["2", "3", "4", "5"], answer: 1, explain: "Mother, apples and bananas are nouns. Bought is an action word." },
    { q: "True or false: A noun can be the name of a place.", options: ["True", "False"], answer: 0, explain: "Park, school and market are all nouns that name places." },
    { q: "True or false: All nouns are the names of people.", options: ["True", "False"], answer: 1, explain: "Nouns can name people, places, animals and things." },
    { q: "Which word names a thing we wear?", options: ["spoon", "chair", "shirt", "pencil"], answer: 2, explain: "We wear a shirt. A spoon, a chair and a pencil are things we use." },
    { q: "Which name is written correctly?", options: ["riya", "Riya", "rIya", "riYA"], answer: 1, explain: "The name of a person begins with a capital letter, so it is Riya." },
    { q: "A ____ gives us milk.", options: ["hen", "ant", "fish", "cow"], answer: 3, explain: "A cow is an animal that gives us milk." },
    { q: "Which group has only people?", options: ["table, chair, bed", "cat, dog, cow", "baby, uncle, aunt", "park, school, shop"], answer: 2, explain: "Baby, uncle and aunt are all people." },
    ];

    export default function Class3NounsSet2() {
    return (
        <QuizPage
        title="Nouns: Quiz Set 2"
        intro="Fifteen more questions. This time look for the odd one out and find nouns inside sentences."
        colors={colors}
        questions={questions}
        seconds={45}
        />
    );
    }