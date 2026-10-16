    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#0891B2", "#C026D3", "#B45309", "#15803D"],
    dark: ["#67E8F9", "#F0ABFC", "#FCD34D", "#86EFAC"],
    };

    const questions: QuizQuestion[] = [
    { q: "What is the plural of “child”?", options: ["childs", "children", "childes", "childrens"], answer: 1, explain: "Some words change completely in the plural. Child becomes children." },
    { q: "What is the plural of “man”?", options: ["mans", "manes", "men", "mens"], answer: 2, explain: "Man becomes men. The letter a changes to e." },
    { q: "What is the plural of “woman”?", options: ["womans", "women", "womens", "womanes"], answer: 1, explain: "Woman becomes women. It is the same change as man and men." },
    { q: "What is the plural of “foot”?", options: ["foots", "feets", "feet", "footes"], answer: 2, explain: "Foot becomes feet. We say one foot, two feet." },
    { q: "What is the plural of “tooth”?", options: ["teeth", "tooths", "toothes", "teeths"], answer: 0, explain: "Tooth becomes teeth. We say one tooth, two teeth." },
    { q: "What is the plural of “mouse”?", options: ["mouses", "mices", "mouse", "mice"], answer: 3, explain: "Mouse becomes mice. We say one mouse, two mice." },
    { q: "Odd one out: children, men, women, boy", options: ["children", "men", "women", "boy"], answer: 3, explain: "Children, men and women are plural. Boy is singular." },
    { q: "Which one is correct?", options: ["two childs", "two children", "two childrens", "two child"], answer: 1, explain: "Two means more than one, so we need the plural: two children." },
    { q: "Which sentence is correct?", options: ["I have two foots.", "I have two feet.", "I have two feets.", "I have two foot."], answer: 1, explain: "The plural of foot is feet." },
    { q: "Fill in the blank: The ____ are playing in the park.", options: ["child", "childs", "children", "childes"], answer: 2, explain: "Are shows that there is more than one, so we use children." },
    { q: "Fill in the blank: Two ____ are sitting on the bench.", options: ["man", "men", "mans", "mens"], answer: 1, explain: "Two means more than one, so we use men." },
    { q: "Which word is singular?", options: ["mice", "feet", "tooth", "men"], answer: 2, explain: "Tooth means one tooth. Mice, feet and men all mean more than one." },
    { q: "True or false: The plural of “tooth” is “tooths”.", options: ["True", "False"], answer: 1, explain: "Tooth is a special word. Its plural is teeth." },
    { q: "What is the plural of “glass”?", options: ["glasss", "glasses", "glassies", "glass"], answer: 1, explain: "Glass ends in s, so we add es to get glasses." },
    { q: "What is the plural of “brush”?", options: ["brushs", "brushies", "brush", "brushes"], answer: 3, explain: "Brush ends in sh, so we add es to get brushes." },
    ];

    export default function Class3SingularPluralSet2() {
    return (
        <QuizPage
        title="Singular and Plural: Quiz Set 2"
        intro="Fifteen more questions. Some words change completely in the plural, like child and children."
        colors={colors}
        questions={questions}
        seconds={45}
        />
    );
    }