    import type { NoteColors } from "@/components/NoteKit";
    import { FlashcardsPage, type Flashcard } from "@/components/FlashKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    const cards: Flashcard[] = [
    {
        front: "Matter",
        back: "Anything that has mass and occupies space.",
        hint: "It needs two things: mass and space.",
    },
    { front: "Mass", back: "The amount of material something contains." },
    { front: "Volume", back: "The amount of space something occupies." },
    {
        front: "Density",
        back: "How tightly packed the particles are: mass per unit volume, ρ = m ÷ V.",
        hint: "Think of mass divided by volume.",
    },
    {
        front: "Macroscopic",
        back: "Large enough to see directly, like a rusting iron nail.",
    },
    {
        front: "Microscopic",
        back: "Too small to see without special tools, like the particles inside the nail.",
    },
    {
        front: "Solid",
        back: "Particles are packed tightly and only vibrate around fixed positions, so it has a fixed shape and volume.",
    },
    {
        front: "Liquid",
        back: "Particles stay close but slide past one another, so it has a fixed volume but no fixed shape.",
    },
    {
        front: "Gas",
        back: "Particles are far apart and move freely, filling all the available space with no fixed shape or volume.",
    },
    { front: "Melting", back: "Solid changes to liquid when heat is added." },
    {
        front: "Evaporation",
        back: "Liquid changes to gas, like wet clothes drying in the sun.",
    },
    {
        front: "Condensation",
        back: "Gas changes to liquid, like dew forming on a cold glass.",
    },
    { front: "Freezing", back: "Liquid changes to solid when energy is removed." },
    {
        front: "Sublimation",
        back: "Solid changes straight to gas, skipping the liquid stage, like dry ice or camphor.",
        hint: "The liquid stage is skipped.",
    },
    {
        front: "Diffusion",
        back: "Particles spreading out until they mix evenly, like perfume smell filling a room.",
    },
    {
        front: "Particle model",
        back: "Matter is made of particles, the particles are always moving, there are spaces between them, and they attract one another.",
        hint: "Four ideas: exist, move, spaces, attract.",
    },
    ];

    export default function WhatIsMatterCards() {
    return (
        <FlashcardsPage
        title="What Is Matter? Flashcards"
        intro="Flip each card, then mark whether you know it. Use the Glossary tab to browse every term in A to Z order."
        colors={colors}
        cards={cards}
        />
    );
    }