    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#7C3AED", "#0F766E", "#BE123C", "#B45309"],
    dark: ["#C4B5FD", "#5EEAD4", "#FDA4AF", "#FCD34D"],
    };

    const questions: QuizQuestion[] = [
    { q: "What is the plural of “sheep”?", options: ["sheeps", "sheep", "sheepes", "sheepies"], answer: 1, explain: "Sheep stays the same in the plural. One sheep, two sheep." },
    { q: "What is the plural of “fish”?", options: ["fishs", "fishies", "fish", "fishees"], answer: 2, explain: "Fish stays the same in the plural. One fish, ten fish." },
    { q: "What is the plural of “deer”?", options: ["deers", "deer", "deeres", "deeries"], answer: 1, explain: "Deer stays the same in the plural. One deer, five deer." },
    { q: "Which word is the same in singular and plural?", options: ["cat", "sheep", "dog", "hen"], answer: 1, explain: "Sheep does not change. Cat, dog and hen add s." },
    { q: "Odd one out: sheep, deer, fish, goose", options: ["sheep", "deer", "fish", "goose"], answer: 3, explain: "Sheep, deer and fish stay the same in the plural. Goose changes to geese." },
    { q: "What is the plural of “goose”?", options: ["gooses", "geeses", "geese", "goosies"], answer: 2, explain: "Goose becomes geese, just like foot becomes feet." },
    { q: "What is the plural of “ox”?", options: ["oxes", "oxen", "oxs", "oxies"], answer: 1, explain: "Ox becomes oxen. It is a special plural." },
    { q: "Which word is always plural?", options: ["scissors", "pencil", "table", "chair"], answer: 0, explain: "We always say scissors, even for one pair. We never say one scissor." },
    { q: "Which sentence is correct?", options: ["My jeans is new.", "My jeans are new.", "My jean are new.", "My jeanses are new."], answer: 1, explain: "Jeans is always plural, so we use are." },
    { q: "Which sentence is correct?", options: ["I saw three sheeps.", "I saw three sheepes.", "I saw three sheep.", "I saw three sheepies."], answer: 2, explain: "The plural of sheep is sheep." },
    { q: "Fill in the blank: Ten ____ are swimming in the pond.", options: ["fishs", "fish", "fishies", "fishees"], answer: 1, explain: "Fish stays the same in the plural, so we say ten fish." },
    { q: "True or false: The plural of “tooth” is “teeth”.", options: ["True", "False"], answer: 0, explain: "Tooth changes completely: one tooth, two teeth." },
    { q: "Which word in this sentence is wrong? “The two mans are tall.”", options: ["The", "two", "mans", "tall"], answer: 2, explain: "The plural of man is men. The sentence should be: The two men are tall." },
    { q: "Which pair is correct (singular – plural)?", options: ["mouse – mouses", "foot – feet", "child – childs", "woman – womans"], answer: 1, explain: "Foot – feet is correct. The others should be mouse – mice, child – children and woman – women." },
    { q: "Odd one out: scissors, trousers, jeans, shirt", options: ["scissors", "trousers", "jeans", "shirt"], answer: 3, explain: "Scissors, trousers and jeans are always plural. A shirt is singular." },
    ];

    export default function Class4SingularPluralSet2() {
    return (
        <QuizPage
        title="Singular and Plural: Quiz Set 2"
        intro="Fifteen trickier questions on words that stay the same, words that change completely and words that are always plural."
        colors={colors}
        questions={questions}
        />
    );
    }