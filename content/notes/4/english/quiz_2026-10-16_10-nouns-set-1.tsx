    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#0F766E", "#BE123C", "#B45309", "#4338CA"],
    dark: ["#5EEAD4", "#FDA4AF", "#FCD34D", "#A5B4FC"],
    };

    const questions: QuizQuestion[] = [
    { q: "What is a common noun?", options: ["The general name of any person, place, animal or thing", "The special name of one particular person or place", "A word that tells what someone does", "A word that describes a noun"], answer: 0, explain: "A common noun is a general name, such as girl, city or dog." },
    { q: "What is a proper noun?", options: ["A word that tells what someone does", "The special name of one particular person, place or thing", "The general name of any thing", "A word that joins two sentences"], answer: 1, explain: "A proper noun is a special name, such as Riya, Jaipur or Diwali. It always begins with a capital letter." },
    { q: "Which of these is a proper noun?", options: ["city", "river", "Jaipur", "school"], answer: 2, explain: "Jaipur is the special name of one city. City, river and school are common nouns." },
    { q: "Which of these is a common noun?", options: ["Ganga", "Sunday", "Riya", "girl"], answer: 3, explain: "Girl is a general name. Ganga, Sunday and Riya are special names." },
    { q: "Which sentence is written correctly?", options: ["my friend lives in mumbai.", "My friend lives in Mumbai.", "My Friend lives in mumbai.", "my Friend lives in Mumbai."], answer: 1, explain: "A sentence begins with a capital letter, and Mumbai is a special name so it needs one too. Friend is a common noun, so it stays small." },
    { q: "Odd one out: Mumbai, Kolkata, Chennai, city", options: ["city", "Mumbai", "Kolkata", "Chennai"], answer: 0, explain: "Mumbai, Kolkata and Chennai are proper nouns. City is a common noun." },
    { q: "Odd one out: Monday, Friday, Sunday, week", options: ["Monday", "Friday", "week", "Sunday"], answer: 2, explain: "Monday, Friday and Sunday are names of particular days, so they are proper nouns. Week is a common noun." },
    { q: "Which word is a proper noun? “The boy is called Aarav.”", options: ["boy", "called", "is", "Aarav"], answer: 3, explain: "Aarav is the special name of one boy. Boy is a common noun." },
    { q: "How many proper nouns are in this sentence? “Pooja lives in Lucknow.”", options: ["1", "2", "3", "4"], answer: 1, explain: "Pooja is a person’s name and Lucknow is a city’s name. Both are proper nouns." },
    { q: "Which word is a common noun? “Kabir ate a mango.”", options: ["Kabir", "ate", "mango", "a"], answer: 2, explain: "Mango is a general name. Kabir is a proper noun, and ate is an action word." },
    { q: "Which group has only proper nouns?", options: ["Delhi, city, town", "Ganga, Yamuna, Godavari", "river, lake, pond", "boy, Rohan, girl"], answer: 1, explain: "Ganga, Yamuna and Godavari are names of particular rivers. Every word in the other groups includes a common noun." },
    { q: "Which sentence uses capital letters correctly?", options: ["We play with colours on holi.", "we play with colours on Holi.", "We Play with colours on Holi.", "We play with colours on Holi."], answer: 3, explain: "The sentence begins with a capital letter, and Holi is the name of a festival. Play is a common word, so it stays small." },
    { q: "Which of these is a common noun?", options: ["festival", "Diwali", "Eid", "Christmas"], answer: 0, explain: "Festival is the general name. Diwali, Eid and Christmas are special names of particular festivals." },
    { q: "Which one is the special name of a pet dog?", options: ["puppy", "pet", "dog", "Bruno"], answer: 3, explain: "Bruno is a name given to one particular dog, so it is a proper noun. Puppy, pet and dog are common nouns." },
    { q: "Which words are proper nouns? “We visited the Red Fort in Delhi.”", options: ["visited, in", "We, the", "Red Fort, Delhi", "Red, in"], answer: 2, explain: "Red Fort and Delhi are special names of places, so they are proper nouns." },
    { q: "True or false: Proper nouns always begin with a capital letter.", options: ["True", "False"], answer: 0, explain: "A special name always starts with a capital letter, even in the middle of a sentence." },
    { q: "True or false: “Girl” is a proper noun.", options: ["True", "False"], answer: 1, explain: "Girl is a general name for any girl, so it is a common noun." },
    { q: "True or false: Mountain is a common noun, but Himalayas is a proper noun.", options: ["True", "False"], answer: 0, explain: "Mountain is a general name. Himalayas is the special name of one particular mountain range." },
    { q: "____ is the capital of India.", options: ["city", "capital", "New Delhi", "town"], answer: 2, explain: "New Delhi is the special name of the capital city, so both words begin with a capital letter." },
    { q: "Which sentence has only common nouns?", options: ["Riya ate an apple.", "Riya went to Delhi.", "Amit saw Sheru.", "The boy ate an apple."], answer: 3, explain: "In “The boy ate an apple.” boy and apple are common nouns. The other sentences have names such as Riya, Delhi, Amit and Sheru." },
    ];

    export default function Class4NounsSet1() {
    return (
        <QuizPage
        title="Nouns: Quiz Set 1"
        intro="Twenty questions on common and proper nouns. Look carefully at which words need a capital letter."
        colors={colors}
        questions={questions}
        />
    );
    }