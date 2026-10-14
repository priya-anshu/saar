    import type { NoteColors } from "@/components/NoteKit";
    import { QuizPage, type QuizQuestion } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    const questions: QuizQuestion[] = [
    {
        q: "Which statement best describes matter?",
        options: [
        "Anything that can be seen with the eyes",
        "Anything that has mass and occupies space",
        "Anything that produces light or sound",
        "Anything that can be touched",
        ],
        answer: 1,
        explain: "Matter must have mass and take up space (volume). Seeing or touching something is not the test.",
    },
    {
        q: "Which of these is NOT matter?",
        options: ["Air", "Water vapour", "Light", "Wood"],
        answer: 2,
        explain: "Light and sound have no mass and do not occupy space the way physical substances do.",
    },
    {
        q: "Which formula gives the density of a substance?",
        options: ["ρ = m ÷ V", "ρ = V ÷ m", "ρ = m × V", "ρ = m − V"],
        answer: 0,
        explain: "Density = mass ÷ volume. It tells you how tightly packed the particles are.",
    },
    {
        q: "A block of wood has a mass of 350 g and a volume of 500 cm³. What is its density?",
        options: ["0.7 g/cm³", "1.43 g/cm³", "150 g/cm³", "175,000 g/cm³"],
        answer: 0,
        explain: "Density = 350 g ÷ 500 cm³ = 0.7 g/cm³.",
    },
    {
        q: "In which state do the particles only vibrate around fixed positions?",
        options: ["Liquid", "Gas", "Gas and liquid", "Solid"],
        answer: 3,
        explain: "Solid particles are packed tightly and can only vibrate in place, so a solid keeps its shape and volume.",
    },
    {
        q: "Why can a gas be compressed easily?",
        options: [
        "Gas particles are very heavy",
        "There are large spaces between gas particles",
        "Gas particles do not move",
        "Gas particles attract each other very strongly",
        ],
        answer: 1,
        explain: "Gas particles are far apart, so they can be pushed closer together. Solid particles have almost no space left.",
    },
    {
        q: "Wet clothes drying in the sun is an example of:",
        options: ["Condensation", "Sublimation", "Freezing", "Evaporation"],
        answer: 3,
        explain: "Liquid water changes to water vapour at the surface. That change is evaporation.",
    },
    {
        q: "During a change of state, which of these stays the same?",
        options: [
        "The arrangement of the particles",
        "The speed of the particles",
        "The identity of the particles",
        "The attraction between particles",
        ],
        answer: 2,
        explain: "Ice, water and steam are all made of the same water particles. Only their arrangement and motion change.",
    },
    {
        q: "Which of these is NOT one of the four core ideas of the particle model?",
        options: [
        "Particles disappear when the state changes",
        "Matter is made of particles",
        "Particles are always moving",
        "Particles attract one another",
        ],
        answer: 0,
        explain: "The four ideas are: matter is made of particles, particles move, there are spaces between them, and they attract each other. Particles never disappear.",
    },
    {
        q: "Why does sugar seem to disappear when it is stirred into water?",
        options: [
        "Sugar particles are destroyed",
        "Sugar particles spread out between the water particles",
        "Sugar turns into water particles",
        "Sugar particles stop existing",
        ],
        answer: 1,
        explain: "The sugar particles are still there. They are just too small and spread out to see.",
    },
    {
        q: "Perfume sprayed in one corner can be smelled across the whole room because of:",
        options: [
        "Condensation of the air",
        "Diffusion of moving gas particles",
        "Melting of the perfume",
        "Compression of the air",
        ],
        answer: 1,
        explain: "Gas particles move freely in every direction and spread until they mix through the air. This is called diffusion.",
    },
    {
        q: "A steel ball and a foam ball are the same size, but the steel ball is much heavier. What does this tell us?",
        options: [
        "Foam is not matter",
        "Steel has fewer particles",
        "Foam particles attract more strongly",
        "Steel particles are packed more closely",
        ],
        answer: 3,
        explain: "Steel has a higher density: more mass in the same volume, because its particles are packed closer together.",
    },
    ];

    export default function WhatIsMatterQuiz() {
    return (
        <QuizPage
        title="What Is Matter? Quiz"
        intro="Twelve questions on matter, density, the states of matter and the particle model. Try the timer once you feel confident."
        colors={colors}
        questions={questions}
        />
    );
    }