    import type { NoteColors } from "@/components/NoteKit";
    import { PracticePage, type PracticeSection } from "@/components/QuizKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    const sections: PracticeSection[] = [
    {
        title: "Recall and calculate",
        questions: [
        {
            q: "Define matter and give three examples that are not listed in the notes.",
            hint: "Matter needs two things: mass and space.",
            answer:
            "Matter is anything with mass that occupies space. Examples: cooking oil, a balloon full of air, a rubber ball.",
            level: "easy",
            marks: 2,
        },
        {
            q: "Name the change of state in each case: (a) wet clothes drying in the sun (b) water vapour forming dew on a cold glass (c) dry ice turning into gas without melting.",
            hint: "Think about which two states are involved in each case.",
            answer: "(a) Evaporation  (b) Condensation  (c) Sublimation",
            steps: [
            "(a) Liquid water becomes water vapour, so it is evaporation.",
            "(b) Water vapour becomes liquid water on the cold glass, so it is condensation.",
            "(c) A solid becomes a gas directly, skipping the liquid stage, so it is sublimation.",
            ],
            level: "easy",
            marks: 3,
        },
        {
            q: "A block of wood has a mass of 350 g and a volume of 500 cm³. Calculate its density.",
            hint: "Use ρ = m ÷ V.",
            answer: "Density = 0.7 g/cm³",
            steps: [
            "Write the formula: ρ = m ÷ V",
            "Substitute the values: ρ = 350 g ÷ 500 cm³",
            "Calculate: ρ = 0.7 g/cm³",
            ],
            level: "medium",
            marks: 3,
        },
        ],
    },
    {
        title: "Explain using particles",
        questions: [
        {
            q: "Explain, in terms of particles, why gases can be compressed easily but solids cannot.",
            hint: "Compare the empty space between the particles in each state.",
            answer:
            "Gas particles are far apart with large empty spaces between them, so they can be pushed closer together. Solid particles are already packed tightly with almost no space left to compress.",
            level: "medium",
            marks: 2,
        },
        {
            q: "Explain why ice, water and steam are considered the same substance even though they look completely different.",
            hint: "What changes during a change of state, and what does not?",
            answer:
            "The identity of the particles does not change during a change of state. Only their arrangement and motion change, so all three are still made of the same water particles.",
            level: "medium",
            marks: 2,
        },
        {
            q: "Using the particle model, explain why perfume sprayed in one corner of a room can be smelled everywhere after some time.",
            hint: "Gas particles move freely. What is that spreading called?",
            answer:
            "Gas particles from the perfume move freely and spread out in all directions (diffusion) until they mix throughout the air in the room.",
            steps: [
            "Perfume particles enter the air as a gas.",
            "Gas particles move freely and randomly in every direction.",
            "They spread into the spaces between air particles until they are mixed through the whole room.",
            ],
            level: "hard",
            marks: 3,
        },
        ],
    },
    ];

    export default function WhatIsMatterPractice() {
    return (
        <PracticePage
        title="What Is Matter? Practice Questions"
        intro="Try every question on paper first. Use the hint if you are stuck, then check your answer."
        colors={colors}
        sections={sections}
        />
    );
    }