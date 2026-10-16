    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#7C3AED", "#0F766E", "#BE123C", "#B45309"],
    dark: ["#C4B5FD", "#5EEAD4", "#FDA4AF", "#FCD34D"],
    };

    const questions: QuizQuestion[] = [
    { q: "What happens to the y in “baby” when we make the plural?", options: ["The y stays and we add s", "The y changes to ies", "The y is removed and we add es", "Nothing changes"], answer: 1, explain: "When a consonant comes before y, the y changes to ies. Baby becomes babies." },
    { q: "What is the plural of “puppy”?", options: ["puppys", "puppyes", "puppies", "puppyies"], answer: 2, explain: "Puppy has a consonant (p) before y, so y changes to ies: puppies." },
    { q: "What is the plural of “city”?", options: ["cities", "citys", "cityes", "cityies"], answer: 0, explain: "City has a consonant (t) before y, so y changes to ies: cities." },
    { q: "What is the plural of “story”?", options: ["storys", "storyes", "stories", "storyies"], answer: 2, explain: "Story has a consonant (r) before y, so y changes to ies: stories." },
    { q: "What is the plural of “lady”?", options: ["ladys", "ladies", "ladyes", "ladyies"], answer: 1, explain: "Lady has a consonant (d) before y, so y changes to ies: ladies." },
    { q: "What is the plural of “monkey”?", options: ["monkies", "monkeies", "monkeys", "monkeyes"], answer: 2, explain: "A vowel (e) comes before y, so we just add s: monkeys." },
    { q: "What is the plural of “day”?", options: ["daies", "days", "dayes", "dayies"], answer: 1, explain: "A vowel (a) comes before y, so we just add s: days." },
    { q: "Which plural is spelt wrongly?", options: ["toys", "keys", "ladies", "flys"], answer: 3, explain: "Fly has a consonant before y, so the plural is flies, not flys." },
    { q: "Odd one out: babies, cities, boys, stories", options: ["babies", "cities", "boys", "stories"], answer: 2, explain: "Babies, cities and stories change y to ies. Boys has a vowel before y, so it only adds s." },
    { q: "What is the plural of “leaf”?", options: ["leafs", "leafes", "leaves", "leavs"], answer: 2, explain: "Many words ending in f change f to ves. Leaf becomes leaves." },
    { q: "What is the plural of “knife”?", options: ["knifes", "knives", "knifs", "knifees"], answer: 1, explain: "Words ending in fe often change to ves. Knife becomes knives." },
    { q: "What is the plural of “wolf”?", options: ["wolfs", "wolfes", "wolvs", "wolves"], answer: 3, explain: "Wolf changes f to ves: wolves." },
    { q: "What is the plural of “shelf”?", options: ["shelves", "shelfs", "shelfes", "shelvs"], answer: 0, explain: "Shelf changes f to ves: shelves." },
    { q: "What is the plural of “potato”?", options: ["potatos", "potatoies", "potatoes", "potatoe"], answer: 2, explain: "Potato adds es: potatoes." },
    { q: "What is the plural of “tomato”?", options: ["tomatos", "tomatoes", "tomatoies", "tomatoe"], answer: 1, explain: "Tomato adds es: tomatoes." },
    { q: "True or false: The plural of “baby” is “babys”.", options: ["True", "False"], answer: 1, explain: "A consonant comes before y, so y changes to ies. The plural is babies." },
    { q: "True or false: The plural of “wife” is “wives”.", options: ["True", "False"], answer: 0, explain: "Wife changes fe to ves: wives." },
    { q: "Fill in the blank: Two ____ are sleeping in the cradle.", options: ["babys", "babies", "babyes", "baby"], answer: 1, explain: "Two means more than one, so we use the plural: babies." },
    { q: "Which sentence is correct?", options: ["The thiefs ran away.", "The thiefes ran away.", "The thieves ran away.", "The thievs ran away."], answer: 2, explain: "Thief changes f to ves: thieves." },
    { q: "What is the singular of “leaves”?", options: ["leave", "leaf", "leafe", "leav"], answer: 1, explain: "Leaves changes back to leaf when there is only one." },
    ];

    export default function Class4SingularPluralSet1() {
    return (
        <QuizPage
        title="Singular and Plural: Quiz Set 1"
        intro="Twenty questions on plural rules: y to ies, f to ves and words ending in o. Look at the last letters carefully."
        colors={colors}
        questions={questions}
        />
    );
    }