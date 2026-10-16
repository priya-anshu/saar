    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#E11D48", "#0F766E", "#B45309", "#4338CA"],
    dark: ["#FB7185", "#5EEAD4", "#FCD34D", "#A5B4FC"],
    };

    const questions: QuizQuestion[] = [
    { q: "What is a noun?", options: ["An action word", "A naming word", "A describing word", "A joining word"], answer: 1, explain: "A noun is a naming word. It names a person, place, animal or thing." },
    { q: "Which word is a noun?", options: ["jump", "soft", "table", "sing"], answer: 2, explain: "A table is a thing, so table is a noun. Jump and sing are action words." },
    { q: "Which word names a person?", options: ["teacher", "chair", "river", "apple"], answer: 0, explain: "A teacher is a person, so teacher is a noun." },
    { q: "Which word names a place?", options: ["doctor", "pencil", "school", "tiger"], answer: 2, explain: "We go to a school to learn. A school is a place." },
    { q: "Which word names an animal?", options: ["mango", "bus", "garden", "elephant"], answer: 3, explain: "An elephant is an animal. A mango and a bus are things, and a garden is a place." },
    { q: "Which word names a thing?", options: ["mother", "book", "park", "lion"], answer: 1, explain: "A book is a thing we can touch and read." },
    { q: "Odd one out: cat, dog, cow, chair", options: ["cat", "dog", "cow", "chair"], answer: 3, explain: "Cat, dog and cow are animals. A chair is a thing." },
    { q: "Odd one out: mother, father, teacher, kitchen", options: ["kitchen", "mother", "father", "teacher"], answer: 0, explain: "Mother, father and teacher are people. A kitchen is a place." },
    { q: "Odd one out: park, school, market, banana", options: ["park", "school", "banana", "market"], answer: 2, explain: "Park, school and market are places. A banana is a thing." },
    { q: "Fill in the blank: The ____ is barking.", options: ["happy", "dog", "run", "blue"], answer: 1, explain: "A dog barks. Dog is a noun, so it fits the blank." },
    { q: "Fill in the blank: I drink ____ every morning.", options: ["milk", "jump", "red", "sing"], answer: 0, explain: "Milk is a thing we drink. It is a noun." },
    { q: "In the sentence “Riya has a red ball.” which word names a thing?", options: ["Riya", "has", "red", "ball"], answer: 3, explain: "A ball is a thing. Riya is the name of a person." },
    { q: "In the sentence “The cat sleeps on the mat.” which word names an animal?", options: ["sleeps", "cat", "on", "mat"], answer: 1, explain: "A cat is an animal. A mat is a thing." },
    { q: "True or false: Nouns are naming words.", options: ["True", "False"], answer: 0, explain: "Nouns name people, places, animals and things." },
    { q: "True or false: “Sing” is a noun.", options: ["True", "False"], answer: 1, explain: "Sing tells us what someone does. It is an action word, not a naming word." },
    { q: "Which group has only nouns?", options: ["run, jump, sit", "big, small, red", "boy, girl, pen", "and, but, or"], answer: 2, explain: "Boy, girl and pen all name a person or a thing." },
    { q: "Which word is the name of a girl?", options: ["Rohan", "Aman", "Kabir", "Meera"], answer: 3, explain: "Meera is a girl’s name. Names of people are nouns." },
    { q: "We buy fruits and vegetables at the ____.", options: ["river", "market", "hospital", "pencil"], answer: 1, explain: "A market is a place where we buy things." },
    { q: "How many nouns are in this sentence? “The boy kicked the ball.”", options: ["1", "2", "3", "4"], answer: 1, explain: "The nouns are boy and ball. Kicked is an action word." },
    { q: "Which sentence has a noun that names an animal?", options: ["She runs fast.", "We sing a song.", "The tiger is big.", "It is a sunny day."], answer: 2, explain: "Tiger is an animal. The other sentences do not name an animal." },
    ];

    export default function Class3NounsSet1() {
    return (
        <QuizPage
        title="Nouns: Quiz Set 1"
        intro="Twenty easy questions on naming words. Pick an answer, then read why it is right."
        colors={colors}
        questions={questions}
        seconds={45}
        />
    );
    }