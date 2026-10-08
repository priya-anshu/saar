    "use client";

    import { useState } from "react";
    import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    type Category = "metal" | "nonmetal" | "metalloid" | "noble-gas";

    interface ElementData {
    symbol: string;
    name: string;
    number: number;
    group: number;
    period: number;
    category: Category;
    }

    const ELEMENTS: ElementData[] = [
    { symbol: "H", name: "Hydrogen", number: 1, group: 1, period: 1, category: "nonmetal" },
    { symbol: "He", name: "Helium", number: 2, group: 18, period: 1, category: "noble-gas" },
    { symbol: "Li", name: "Lithium", number: 3, group: 1, period: 2, category: "metal" },
    { symbol: "Be", name: "Beryllium", number: 4, group: 2, period: 2, category: "metal" },
    { symbol: "B", name: "Boron", number: 5, group: 13, period: 2, category: "metalloid" },
    { symbol: "C", name: "Carbon", number: 6, group: 14, period: 2, category: "nonmetal" },
    { symbol: "N", name: "Nitrogen", number: 7, group: 15, period: 2, category: "nonmetal" },
    { symbol: "O", name: "Oxygen", number: 8, group: 16, period: 2, category: "nonmetal" },
    { symbol: "F", name: "Fluorine", number: 9, group: 17, period: 2, category: "nonmetal" },
    { symbol: "Ne", name: "Neon", number: 10, group: 18, period: 2, category: "noble-gas" },
    { symbol: "Na", name: "Sodium", number: 11, group: 1, period: 3, category: "metal" },
    { symbol: "Mg", name: "Magnesium", number: 12, group: 2, period: 3, category: "metal" },
    { symbol: "Al", name: "Aluminium", number: 13, group: 13, period: 3, category: "metal" },
    { symbol: "Si", name: "Silicon", number: 14, group: 14, period: 3, category: "metalloid" },
    { symbol: "P", name: "Phosphorus", number: 15, group: 15, period: 3, category: "nonmetal" },
    { symbol: "S", name: "Sulfur", number: 16, group: 16, period: 3, category: "nonmetal" },
    { symbol: "Cl", name: "Chlorine", number: 17, group: 17, period: 3, category: "nonmetal" },
    { symbol: "Ar", name: "Argon", number: 18, group: 18, period: 3, category: "noble-gas" },
    { symbol: "K", name: "Potassium", number: 19, group: 1, period: 4, category: "metal" },
    { symbol: "Ca", name: "Calcium", number: 20, group: 2, period: 4, category: "metal" },
    ];

    function shellsFor(atomicNumber: number): number[] {
    const caps = [2, 8, 8, 2];
    let remaining = atomicNumber;
    const shells: number[] = [];
    for (const cap of caps) {
        if (remaining <= 0) break;
        const fill = Math.min(cap, remaining);
        shells.push(fill);
        remaining -= fill;
    }
    return shells;
    }

    const categorySoft: Record<Category, string> = {
    metal: "border-brand/40 bg-brand/10 text-brand",
    nonmetal: "border-brand4/40 bg-brand4/10 text-brand4",
    metalloid: "border-brand3/40 bg-brand3/10 text-brand3",
    "noble-gas": "border-brand2/40 bg-brand2/10 text-brand2",
    };

    const categorySolid: Record<Category, string> = {
    metal: "border-brand bg-brand text-page",
    nonmetal: "border-brand4 bg-brand4 text-page",
    metalloid: "border-brand3 bg-brand3 text-page",
    "noble-gas": "border-brand2 bg-brand2 text-page",
    };

    const categoryLabel: Record<Category, string> = {
    metal: "Metal",
    nonmetal: "Nonmetal",
    metalloid: "Metalloid",
    "noble-gas": "Noble gas",
    };

    function PeriodicTableExplorer() {
    const [selected, setSelected] = useState<string | null>("H");
    const selectedElement = ELEMENTS.find((e) => e.symbol === selected) ?? null;

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-3">
            {(Object.keys(categoryLabel) as Category[]).map((cat) => (
            <span
                key={cat}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${categorySoft[cat]}`}
            >
                <span className="inline-block h-2 w-2 rounded-full bg-current" />
                {categoryLabel[cat]}
            </span>
            ))}
        </div>

        <div className="overflow-x-auto">
            <div className="grid min-w-[720px] grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
            {ELEMENTS.map((el) => (
                <button
                key={el.symbol}
                type="button"
                aria-label={`Show details for ${el.name}`}
                onClick={() => setSelected(el.symbol)}
                style={{ gridColumn: el.group, gridRow: el.period }}
                className={`flex aspect-square flex-col items-center justify-center rounded-md border transition ${
                    selected === el.symbol ? categorySolid[el.category] : categorySoft[el.category]
                }`}
                >
                <span className="text-[9px] opacity-70">{el.number}</span>
                <span className="font-hand text-sm leading-none">{el.symbol}</span>
                </button>
            ))}
            </div>
        </div>

        {selectedElement && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-line bg-page p-3">
                <p className="text-xs text-mute">Element</p>
                <p className="font-semibold text-fg">
                {selectedElement.name} ({selectedElement.symbol})
                </p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
                <p className="text-xs text-mute">Atomic number</p>
                <p className="font-semibold text-brand">{selectedElement.number}</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
                <p className="text-xs text-mute">Category</p>
                <p className="font-semibold text-brand3">{categoryLabel[selectedElement.category]}</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
                <p className="text-xs text-mute">Shell configuration</p>
                <p className="font-semibold text-brand2">{shellsFor(selectedElement.number).join(", ")}</p>
            </div>
            </div>
        )}
        </div>
    );
    }

    export default function PeriodicTableNote() {
    return (
        <Note
        title="The Periodic Table — Organizing Elements"
        intro="By Unit 2 you had met atoms, with their protons, neutrons and electrons. But there are more than 100 known elements, and memorising a random list of them would be useless. This unit asks why elements need organising at all, and shows how the periodic table turns electron-shell patterns into a map we can actually use to predict behaviour."
        colors={colors}
        >
        <Section title="1. Why Do We Need to Organize Elements?">
            <p>
            Imagine trying to remember the properties of over 100 different elements, one at a time, with no pattern
            connecting them. It would be nearly impossible. Fortunately, scientists noticed something useful:{" "}
            <Hl>elements show repeating patterns in their properties.</Hl>
            </p>
            <p className="mt-3">
            Some elements behave in similar ways to each other, react with similar substances, and form similar kinds
            of compounds. Once this pattern was noticed, it became possible to arrange all known elements into a single
            organized chart — the <Hl>periodic table</Hl> — where elements with similar behaviour line up with one
            another.
            </p>
            <Callout>
            The periodic table is not a chart to memorise from end to end — it is a map of patterns that lets us{" "}
            <Hl>predict</Hl> how an element is likely to behave, even before we have tested it ourselves.
            </Callout>
        </Section>

        <Section title="2. Periods and Groups">
            <p>
            The periodic table is built from rows and columns, and each direction tells us something different about
            an element.
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand2">
            <li>
                <Hl>Periods</Hl> are the horizontal rows. In the simplified school model, the period number tells us how
                many electron shells an atom has occupied.
            </li>
            <li>
                <Hl>Groups</Hl> are the vertical columns. Elements in the same group often behave similarly because they
                tend to have a similar arrangement of outer electrons.
            </li>
            </ul>

            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Group 1 (similar behaviour)</th>
                    <th className="border border-line bg-brand4/15 p-2 text-left text-brand4">
                    Group 17 (similar behaviour)
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">Li — Lithium</td>
                    <td className="border border-line p-2">F — Fluorine</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Na — Sodium</td>
                    <td className="border border-line p-2">Cl — Chlorine</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">K — Potassium</td>
                    <td className="border border-line p-2">Br — Bromine</td>
                </tr>
                </tbody>
            </table>
            </div>
            <p className="mt-3 text-sm text-mute">
            Elements within the same group show similar broad chemical tendencies, even though they are different
            elements with different atomic numbers.
            </p>
        </Section>

        <Section title="3. Explore the First 20 Elements">
            <p>
            Select any element below to see its atomic number, category, and simplified electron shell configuration.
            Notice how the grid positions elements exactly where they sit in the real periodic table.
            </p>
            <div className="mt-4">
            <PeriodicTableExplorer />
            </div>
        </Section>

        <Section title="4. Metals, Nonmetals and Metalloids">
            <p>
            Once elements are placed on the table, we can sort them into three broad categories based on their general
            properties.
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand">
            <li>
                <Hl>Metals</Hl> are generally shiny, malleable (can be hammered into sheets), ductile (can be drawn into
                wires), and good conductors of heat and electricity.
            </li>
            <li>
                <Hl>Nonmetals</Hl> are generally poor conductors, often dull in appearance, and many are brittle when
                solid.
            </li>
            <li>
                <Hl>Metalloids</Hl> have properties that fall between metals and nonmetals.
            </li>
            </ul>
            <Callout>
            An element’s position and broad category give useful clues about <Hl>how it is likely to behave
            chemically</Hl>, even before you look up its exact properties.
            </Callout>
        </Section>

        <Section title="5. Electron Arrangement — Filling the Shells">
            <p>
            The periodic table makes sense once we understand how electrons fill the shells around the nucleus. In the
            simplified school model used at this level:
            </p>
            <ol className="mt-3 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand2">
            <li>
                The <Hl>1st shell</Hl> holds a maximum of 2 electrons.
            </li>
            <li>
                The <Hl>2nd shell</Hl> holds a maximum of 8 electrons.
            </li>
            <li>
                The <Hl>3rd shell</Hl> is commonly introduced as holding 8 electrons for the first few elements studied
                at this level.
            </li>
            </ol>
            <p className="mt-3 text-sm text-mute">
            This simplified shell model is a teaching tool rather than the complete quantum-mechanical picture, but it
            is exactly the model used to explain the shell configurations you explored above — for example, chlorine
            (atomic number 17) fills as 2, 8, 7, while potassium (atomic number 19) starts a new, fourth shell and
            fills as 2, 8, 8, 1.
            </p>
        </Section>

        <Section title="6. Valence Electrons — The Bridge to Valency">
            <p>
            The electrons in an atom’s <Hl>outermost occupied shell</Hl> are called <Hl>valence electrons</Hl>. These
            are the electrons most directly involved in chemical bonding, which makes them the single most important
            detail for predicting how an atom will react.
            </p>
            <Callout>
            Everything about how atoms combine with one another — covered in the next unit — comes down to this one
            idea: atoms interact mainly through their <Hl>valence electrons</Hl>.
            </Callout>
        </Section>

        <Section title="7. Practice Questions">
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>Explain, in your own words, why the periodic table is useful even though it cannot be memorised all at once.</li>
            <li>What does the period number tell us about an atom, in the simplified school model?</li>
            <li>Why do elements in the same group often behave similarly?</li>
            <li>
                Using the simplified shell-filling rule (2, 8, 8, 2), work out the shell configuration for an atom with
                atomic number 15.
            </li>
            <li>Name one property each of a typical metal, a typical nonmetal, and a metalloid.</li>
            <li>What are valence electrons, and why are they important?</li>
            </ol>

            <details className="mt-4 rounded-xl border border-line bg-tint p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand">Show answer key</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mute">
                <li>
                Because it organizes elements by repeating patterns in their properties, so instead of memorising
                every element individually, we can predict behaviour from an element’s position on the table.
                </li>
                <li>The period number tells us how many electron shells the atom has occupied.</li>
                <li>
                Because elements in the same group tend to have a similar arrangement of outer (valence) electrons,
                which controls chemical behaviour.
                </li>
                <li>Atomic number 15 → 2, 8, 5 (phosphorus).</li>
                <li>
                Metal: good conductor of electricity (also shiny, malleable, ductile). Nonmetal: poor conductor of
                electricity. Metalloid: properties in between metals and nonmetals.
                </li>
                <li>
                Valence electrons are the electrons in the outermost occupied shell of an atom. They are important
                because they are the electrons mainly responsible for chemical bonding and reactivity.
                </li>
            </ol>
            </details>
        </Section>

        <Section title="8. Quick Revision Sheet">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand4">
            <li>
                The periodic table organizes elements by <Hl>repeating patterns</Hl> in their properties, not by random
                order.
            </li>
            <li>
                <Hl>Periods</Hl> (rows) relate to the number of occupied electron shells; <Hl>groups</Hl> (columns)
                relate to similar outer-electron arrangements and similar chemical behaviour.
            </li>
            <li>
                Elements are broadly classed as <Hl>metals</Hl>, <Hl>nonmetals</Hl>, or <Hl>metalloids</Hl> based on
                their general physical and chemical properties.
            </li>
            <li>
                Simplified shell-filling rule: 1st shell holds 2, 2nd shell holds 8, 3rd shell is introduced here as
                holding 8.
            </li>
            <li>
                <Hl>Valence electrons</Hl> (outermost shell) are the electrons that mainly control how an atom bonds and
                reacts.
            </li>
            </ul>
            <Callout>
            Coming up in Unit 4: we use valence electrons to explain <Hl>valency</Hl> itself, meet <Hl>ions</Hl>, and
            see how atoms combine through <Hl>ionic and covalent bonding</Hl>.
            </Callout>
        </Section>
        </Note>
    );
    }