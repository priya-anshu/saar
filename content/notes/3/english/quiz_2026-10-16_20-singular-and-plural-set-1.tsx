    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#0891B2", "#C026D3", "#B45309", "#15803D"],
    dark: ["#67E8F9", "#F0ABFC", "#FCD34D", "#86EFAC"],
    };

    const questions: QuizQuestion[] = [
    { q: "What does singular mean?", options: ["One", "More than one", "Two only", "Nothing"], answer: 0, explain: "Singular means one person, animal, place or thing, like one cat." },
    { q: "What does plural mean?", options: ["Only one", "More than one", "Nothing", "Half"], answer: 1, explain: "Plural means more than one, like two cats or ten cats." },
    { q: "Which word is plural?", options: ["cat", "dogs", "book", "pen"], answer: 1, explain: "Dogs means more than one dog. The other words each mean only one." },
    { q: "Which word is singular?", options: ["books", "pens", "bag", "cups"], answer: 2, explain: "A bag means one bag. Books, pens and cups mean more than one." },
    { q: "What is the plural of “cat”?", options: ["cats", "cates", "cat", "catt"], answer: 0, explain: "We add s to most words to make them plural, so cat becomes cats." },
    { q: "What is the plural of “book”?", options: ["bookes", "book", "bokes", "books"], answer: 3, explain: "Add s to book to get books." },
    { q: "What is the plural of “chair”?", options: ["chaires", "chairs", "chair", "chairss"], answer: 1, explain: "Add s to chair to get chairs." },
    { q: "What is the plural of “bus”?", options: ["buss", "buses", "bus", "busies"], answer: 1, explain: "Words that end in s take es in the plural, so bus becomes buses." },
    { q: "What is the plural of “box”?", options: ["boxs", "boxies", "boxes", "box"], answer: 2, explain: "Words that end in x take es in the plural, so box becomes boxes." },
    { q: "What is the plural of “dish”?", options: ["dishs", "dishes", "dishies", "dish"], answer: 1, explain: "Words that end in sh take es in the plural, so dish becomes dishes." },
    { q: "What is the plural of “watch”?", options: ["watchs", "watchies", "watch", "watches"], answer: 3, explain: "Words that end in ch take es in the plural, so watch becomes watches." },
    { q: "Odd one out: cup, plate, spoon, books", options: ["cup", "plate", "spoon", "books"], answer: 3, explain: "Cup, plate and spoon are singular. Books is plural." },
    { q: "Odd one out: cats, dogs, hens, cow", options: ["cats", "dogs", "hens", "cow"], answer: 3, explain: "Cats, dogs and hens are plural. Cow is singular." },
    { q: "Fill in the blank: There are five ____ on the tree.", options: ["bird", "birds", "birdes", "birdy"], answer: 1, explain: "Five means more than one, so we need the plural: birds." },
    { q: "Fill in the blank: This is a red ____.", options: ["ball", "balls", "ballses", "ballies"], answer: 0, explain: "A and this show that there is only one, so we use the singular: ball." },
    { q: "Fill in the blank: These are my ____.", options: ["pencil", "pencile", "pencils", "pencilies"], answer: 2, explain: "These means more than one, so we use the plural: pencils." },
    { q: "True or false: Plural means more than one.", options: ["True", "False"], answer: 0, explain: "Plural means more than one, like two apples." },
    { q: "True or false: We add s to most words to make them plural.", options: ["True", "False"], answer: 0, explain: "Most words just add s, like pen and pens." },
    { q: "True or false: The plural of “box” is “boxs”.", options: ["True", "False"], answer: 1, explain: "Box ends in x, so we add es. The plural is boxes." },
    { q: "Which word needs es to make its plural?", options: ["cat", "dog", "fox", "pen"], answer: 2, explain: "Fox ends in x, so it becomes foxes. Cat, dog and pen just add s." },
    ];

    export default function Class3SingularPluralSet1() {
    return (
        <QuizPage
        title="Singular and Plural: Quiz Set 1"
        intro="Twenty easy questions on one and many. Learn when to add s and when to add es."
        colors={colors}
        questions={questions}
        seconds={45}
        />
    );
    }