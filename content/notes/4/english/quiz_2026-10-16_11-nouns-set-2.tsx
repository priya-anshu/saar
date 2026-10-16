    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#0F766E", "#BE123C", "#B45309", "#4338CA"],
    dark: ["#5EEAD4", "#FDA4AF", "#FCD34D", "#A5B4FC"],
    };

    const questions: QuizQuestion[] = [
    { q: "Which sentence is written correctly?", options: ["We go to school on monday.", "We go to School on Monday.", "We go to school on Monday.", "we go to school on monday."], answer: 2, explain: "Monday is the name of a day, so it needs a capital letter. School is a common noun, so it stays small." },
    { q: "Which sentence is written correctly?", options: ["My Cousin Rohan lives in Pune.", "My cousin rohan lives in pune.", "my cousin Rohan lives in Pune.", "My cousin Rohan lives in Pune."], answer: 3, explain: "The sentence starts with a capital letter, and Rohan and Pune are special names. Cousin is a common noun, so it stays small." },
    { q: "Our teacher read a story to Aman. Which two words are common nouns?", options: ["teacher, story", "Aman, teacher", "story, Aman", "read, story"], answer: 0, explain: "Teacher and story are general names. Aman is the special name of a boy." },
    { q: "How many nouns are in this sentence? “Sita put the books on the table.”", options: ["2", "3", "4", "5"], answer: 1, explain: "Sita, books and table are nouns. Put is an action word." },
    { q: "Which word is a proper noun? “Every Saturday, we visit our grandmother.”", options: ["Every", "visit", "grandmother", "Saturday"], answer: 3, explain: "Saturday is the name of a day. Grandmother is a common noun." },
    { q: "Odd one out: Sheru, Moti, Bruno, dog", options: ["dog", "Sheru", "Moti", "Bruno"], answer: 0, explain: "Sheru, Moti and Bruno are names of particular dogs. Dog is a common noun." },
    { q: "Odd one out: Aman, bag, book, pen", options: ["Aman", "bag", "book", "pen"], answer: 0, explain: "Bag, book and pen are common nouns. Aman is a proper noun." },
    { q: "Which of these is a proper noun?", options: ["country", "continent", "state", "India"], answer: 3, explain: "India is the special name of one country. Country, continent and state are common nouns." },
    { q: "Which common noun fits the proper noun “Mount Everest”?", options: ["river", "ocean", "mountain", "city"], answer: 2, explain: "Mount Everest is the special name of a particular mountain." },
    { q: "Which proper noun fits the common noun “festival”?", options: ["Diwali", "Delhi", "Monday", "Ganga"], answer: 0, explain: "Diwali is the name of a particular festival. Delhi is a city, Monday is a day and Ganga is a river." },
    { q: "We live on the planet ____.", options: ["Sun", "sky", "Earth", "moon"], answer: 2, explain: "Earth is the special name of our planet, so it begins with a capital letter." },
    { q: "True or false: Names of days and months begin with capital letters.", options: ["True", "False"], answer: 0, explain: "Monday and March are proper nouns, so they start with capital letters." },
    { q: "True or false: Dog is a proper noun because it names an animal.", options: ["True", "False"], answer: 1, explain: "Dog is a general name for any dog, so it is a common noun. A name like Bruno would be a proper noun." },
    { q: "Which sentence has one proper noun and one common noun?", options: ["The boy kicked the ball.", "Delhi and Mumbai are cities.", "Priya bought a pencil.", "Aman and Rohan play."], answer: 2, explain: "In “Priya bought a pencil.” Priya is a proper noun and pencil is a common noun." },
    { q: "Which of these should begin with a capital letter in the middle of a sentence?", options: ["pencil", "tuesday", "garden", "school"], answer: 1, explain: "Tuesday is the name of a day, so it is a proper noun and needs a capital letter. The other words are common nouns." },
    ];

    export default function Class4NounsSet2() {
    return (
        <QuizPage
        title="Nouns: Quiz Set 2"
        intro="Fifteen trickier questions. Spot the mistakes, find the odd one out and match common nouns to proper nouns."
        colors={colors}
        questions={questions}
        />
    );
    }