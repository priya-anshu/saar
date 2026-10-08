    "use client";

    import { useEffect, useRef, useState } from "react";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    /* ---------------- Separation matcher data ---------------- */

    interface Mixture {
    id: string;
    label: string;
    method: string;
    why: string;
    }

    const MIXTURES: Mixture[] = [
    {
        id: "sand-water",
        label: "Sand mixed with water",
        method: "Filtration",
        why: "Sand does not dissolve, and its particles are too big to pass through the tiny holes in filter paper, while the water does.",
    },
    {
        id: "salt-get-salt",
        label: "Salt dissolved in water (you want the salt)",
        method: "Evaporation",
        why: "Heating makes the water turn into vapour and leave, while the dissolved salt stays behind.",
    },
    {
        id: "salt-get-water",
        label: "Salt dissolved in water (you want the pure water)",
        method: "Distillation",
        why: "The water is boiled into vapour, then cooled so it condenses back into pure liquid water, leaving the salt behind.",
    },
    {
        id: "iron-sand",
        label: "Iron filings mixed with sand",
        method: "Magnetic separation",
        why: "Iron is attracted by a magnet and sand is not, so a magnet pulls the iron out.",
    },
    {
        id: "ink",
        label: "The different colours in black ink",
        method: "Chromatography",
        why: "Each coloured substance travels along paper at a different speed, so the colours spread apart.",
    },
    {
        id: "muddy",
        label: "Muddy pond water left standing",
        method: "Sedimentation and decantation",
        why: "Heavy mud particles settle at the bottom (sedimentation), and then the clear water on top can be poured off carefully (decantation).",
    },
    {
        id: "flour-stones",
        label: "Flour mixed with small stones",
        method: "Sieving",
        why: "The fine flour particles pass through the holes of a sieve, but the larger stones are left behind.",
    },
    ];

    function SeparationMatcher() {
    const [id, setId] = useState<string>(MIXTURES[0].id);
    const mixture = MIXTURES.find((m) => m.id === id) ?? MIXTURES[0];

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <label htmlFor="mixture-select" className="mb-2 block text-sm font-semibold text-fg">
            Choose a mixture
        </label>
        <select
            id="mixture-select"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm text-fg outline-none focus-visible:outline-2 focus-visible:outline-brand"
        >
            {MIXTURES.map((m) => (
            <option key={m.id} value={m.id}>
                {m.label}
            </option>
            ))}
        </select>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
            <p className="text-xs text-mute">Best method</p>
            <p className="mt-1 font-semibold text-brand2">{mixture.method}</p>
            </div>
            <div className="rounded-xl border border-brand3/30 bg-brand3/10 p-4">
            <p className="text-xs text-mute">Why it works</p>
            <p className="mt-1 text-sm text-fg">{mixture.why}</p>
            </div>
        </div>
        </div>
    );
    }

    /* ---------------- Litmus tester data ---------------- */

    type Nature = "acid" | "base" | "neutral";

    interface Substance {
    id: string;
    name: string;
    nature: Nature;
    note: string;
    }

    const SUBSTANCES: Substance[] = [
    { id: "lemon", name: "Lemon juice", nature: "acid", note: "A natural acid that gives lemons their sour taste." },
    { id: "vinegar", name: "Vinegar", nature: "acid", note: "Contains an acid and is used in cooking and pickles." },
    { id: "water", name: "Pure water", nature: "neutral", note: "Neither acidic nor basic, so neither litmus paper changes." },
    { id: "soap", name: "Soap solution", nature: "base", note: "Feels slippery and tastes bitter, which are typical signs of a base." },
    { id: "soda", name: "Baking soda solution", nature: "base", note: "A mild base, often used to soothe ant stings and indigestion." },
    { id: "hcl", name: "Dilute hydrochloric acid", nature: "acid", note: "A strong acid. Only a teacher or a supervised lab should handle it." },
    { id: "naoh", name: "Sodium hydroxide solution", nature: "base", note: "A strong, corrosive base. Never touch or taste it." },
    ];

    const NATURE_TEXT: Record<Nature, string> = {
    acid: "text-brand4",
    base: "text-brand",
    neutral: "text-brand2",
    };

    function Strip({ label, className }: { label: string; className: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
        <div className={`h-9 w-16 rounded-md border border-line ${className}`} />
        <span className="text-xs text-mute">{label}</span>
        </div>
    );
    }

    function LitmusTester() {
    const [id, setId] = useState<string>("lemon");
    const s = SUBSTANCES.find((x) => x.id === id) ?? SUBSTANCES[0];

    const blueAfter = s.nature === "acid" ? "bg-brand4" : "bg-brand";
    const redAfter = s.nature === "base" ? "bg-brand" : "bg-brand4";
    const blueResult = s.nature === "acid" ? "turns red" : "stays blue";
    const redResult = s.nature === "base" ? "turns blue" : "stays red";

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <p className="mb-2 text-sm font-semibold text-fg">Dip litmus paper into a substance</p>
        <div className="flex flex-wrap gap-2">
            {SUBSTANCES.map((x) => (
            <button
                key={x.id}
                type="button"
                aria-label={`Test ${x.name} with litmus paper`}
                aria-pressed={id === x.id}
                onClick={() => setId(x.id)}
                className={
                id === x.id
                    ? "rounded-lg border border-brand bg-brand px-3 py-1.5 text-sm font-semibold text-page"
                    : "rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm text-fg"
                }
            >
                {x.name}
            </button>
            ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-page p-4">
            <p className="text-sm font-semibold text-brand">Blue litmus paper</p>
            <div className="mt-3 flex items-center justify-center gap-4">
                <Strip label="before" className="bg-brand" />
                <span className="text-mute" aria-hidden="true">→</span>
                <Strip label="after" className={blueAfter} />
            </div>
            <p className="mt-3 text-center text-sm text-fg">It {blueResult}.</p>
            </div>
            <div className="rounded-xl border border-line bg-page p-4">
            <p className="text-sm font-semibold text-brand4">Red litmus paper</p>
            <div className="mt-3 flex items-center justify-center gap-4">
                <Strip label="before" className="bg-brand4" />
                <span className="text-mute" aria-hidden="true">→</span>
                <Strip label="after" className={redAfter} />
            </div>
            <p className="mt-3 text-center text-sm text-fg">It {redResult}.</p>
            </div>
        </div>

        <div className="mt-4 rounded-xl border border-line bg-page p-4 text-center">
            <p className="text-sm text-mute">
            {s.name} is{" "}
            <span className={`font-semibold ${NATURE_TEXT[s.nature]}`}>
                {s.nature === "acid" ? "an acid" : s.nature === "base" ? "a base" : "neutral"}
            </span>
            </p>
            <p className="mt-1 text-xs text-mute">{s.note}</p>
        </div>
        </div>
    );
    }

    /* ---------------- 3D reaction visual ---------------- */

    interface ReactionHandle {
    setProgress: (p: number) => void;
    play: () => void;
    }

    function stageText(p: number): string {
    if (p < 15) return "Before: two H₂ molecules and one O₂ molecule, with every atom bonded to its partner.";
    if (p < 40) return "The old bonds between the atoms are breaking.";
    if (p < 75) return "The atoms move and rearrange. None of them disappears.";
    if (p < 100) return "New bonds form between oxygen and hydrogen atoms.";
    return "After: two H₂O molecules. The same 4 hydrogen and 2 oxygen atoms, arranged differently.";
    }

    interface AtomDef {
    el: "H" | "O";
    from: [number, number, number];
    to: [number, number, number];
    side: number;
    }

    const ATOM_DEFS: AtomDef[] = [
    { el: "H", from: [-3.2, 1.2, 0], to: [-1.8, 0.55, 0], side: 1 },
    { el: "H", from: [-2.6, 1.2, 0], to: [0.6, 0.55, 0], side: -1 },
    { el: "H", from: [-3.2, -1.2, 0], to: [-0.6, 0.55, 0], side: 1 },
    { el: "H", from: [-2.6, -1.2, 0], to: [1.8, 0.55, 0], side: -1 },
    { el: "O", from: [2.2, 0, 0], to: [-1.2, 0, 0], side: 1 },
    { el: "O", from: [3.0, 0, 0], to: [1.2, 0, 0], side: -1 },
    ];

    const REACTANT_BONDS: [number, number][] = [
    [0, 1],
    [2, 3],
    [4, 5],
    ];

    const PRODUCT_BONDS: [number, number][] = [
    [4, 0],
    [4, 2],
    [5, 1],
    [5, 3],
    ];

    function ReactionVisualizer() {
    const mountRef = useRef<HTMLDivElement>(null);
    const simRef = useRef<ReactionHandle | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const geos: THREE.BufferGeometry[] = [];
        const mats: THREE.Material[] = [];
        const geo = <T extends THREE.BufferGeometry>(g: T): T => {
        geos.push(g);
        return g;
        };
        const mat = <T extends THREE.Material>(m: T): T => {
        mats.push(m);
        return m;
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0.8, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minAzimuthAngle = -0.9;
        controls.maxAzimuthAngle = 0.9;
        controls.minPolarAngle = 1.0;
        controls.maxPolarAngle = 2.1;

        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const dLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dLight.position.set(3, 5, 6);
        scene.add(dLight);

        const sphereGeo = geo(new THREE.SphereGeometry(1, 32, 32));
        const bondGeo = geo(new THREE.CylinderGeometry(0.06, 0.06, 1, 12));

        const hMat = mat(new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[1]), roughness: 0.4 }));
        const oMat = mat(new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[3]), roughness: 0.4 }));
        const reactBondMat = mat(
        new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[0]), transparent: true, opacity: 1, roughness: 0.5 })
        );
        const prodBondMat = mat(
        new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[0]), transparent: true, opacity: 0, roughness: 0.5 })
        );

        interface AtomState {
        mesh: THREE.Mesh;
        from: THREE.Vector3;
        to: THREE.Vector3;
        side: number;
        }

        const atoms: AtomState[] = ATOM_DEFS.map((d) => {
        const mesh = new THREE.Mesh(sphereGeo, d.el === "H" ? hMat : oMat);
        mesh.scale.setScalar(d.el === "H" ? 0.22 : 0.36);
        scene.add(mesh);
        return {
            mesh,
            from: new THREE.Vector3(d.from[0], d.from[1], d.from[2]),
            to: new THREE.Vector3(d.to[0], d.to[1], d.to[2]),
            side: d.side,
        };
        });

        interface BondState {
        a: number;
        b: number;
        mesh: THREE.Mesh;
        }

        const makeBonds = (pairs: [number, number][], material: THREE.Material): BondState[] =>
        pairs.map(([a, b]) => {
            const mesh = new THREE.Mesh(bondGeo, material);
            scene.add(mesh);
            return { a, b, mesh };
        });

        const reactBonds = makeBonds(REACTANT_BONDS, reactBondMat);
        const prodBonds = makeBonds(PRODUCT_BONDS, prodBondMat);

        const up = new THREE.Vector3(0, 1, 0);
        const dir = new THREE.Vector3();

        const placeBond = (bond: BondState) => {
        const A = atoms[bond.a].mesh.position;
        const B = atoms[bond.b].mesh.position;
        dir.subVectors(B, A);
        const len = dir.length();
        bond.mesh.position.copy(A).addScaledVector(dir, 0.5);
        bond.mesh.scale.set(1, Math.max(len, 0.001), 1);
        bond.mesh.quaternion.setFromUnitVectors(up, dir.normalize());
        };

        const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
        const ease = (x: number) => x * x * (3 - 2 * x);

        const apply = (p: number) => {
        const t = ease(clamp01((p - 0.25) / 0.5));
        atoms.forEach((a) => {
            a.mesh.position.lerpVectors(a.from, a.to, t);
            a.mesh.position.z += Math.sin(Math.PI * t) * 0.7 * a.side;
        });

        const ro = 1 - ease(clamp01((p - 0.15) / 0.2));
        const po = ease(clamp01((p - 0.6) / 0.2));
        reactBondMat.opacity = ro;
        prodBondMat.opacity = po;

        reactBonds.forEach((b) => {
            b.mesh.visible = ro > 0.02;
            if (b.mesh.visible) placeBond(b);
        });
        prodBonds.forEach((b) => {
            b.mesh.visible = po > 0.02;
            if (b.mesh.visible) placeBond(b);
        });
        };

        let value = 0;
        let isPlaying = false;
        let lastInt = 0;

        simRef.current = {
        setProgress: (p: number) => {
            value = clamp01(p);
            isPlaying = false;
        },
        play: () => {
            if (value >= 1) value = 0;
            isPlaying = true;
        },
        };

        const resize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (w === 0 || h === 0) return;
        const aspect = w / h;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        camera.position.setLength(Math.max(6.5, 9.2 / aspect));
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(mount);

        const clock = new THREE.Clock();
        let frame = 0;

        const animate = () => {
        frame = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);

        if (isPlaying) {
            value += dt / 6;
            if (value >= 1) {
            value = 1;
            isPlaying = false;
            setPlaying(false);
            }
        }

        const asInt = Math.round(value * 100);
        if (asInt !== lastInt) {
            lastInt = asInt;
            setProgress(asInt);
        }

        apply(value);
        controls.update();
        renderer.render(scene, camera);
        };
        animate();

        return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        geos.forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
            mount.removeChild(renderer.domElement);
        }
        simRef.current = null;
        };
    }, []);

    const onPlay = () => {
        simRef.current?.play();
        setPlaying(true);
    };

    const onReset = () => {
        simRef.current?.setProgress(0);
        setProgress(0);
        setPlaying(false);
    };

    const onSlide = (v: number) => {
        simRef.current?.setProgress(v / 100);
        setProgress(v);
        setPlaying(false);
    };

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
            type="button"
            aria-label="Play the reaction animation"
            onClick={onPlay}
            disabled={playing}
            className="rounded-lg border border-brand bg-brand px-4 py-1.5 text-sm font-semibold text-page disabled:opacity-60"
            >
            {playing ? "Reacting…" : progress >= 100 ? "Replay" : "Play reaction"}
            </button>
            <button
            type="button"
            aria-label="Reset the reaction to the start"
            onClick={onReset}
            className="rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm text-fg"
            >
            Reset
            </button>
            <span className="flex items-center gap-1.5 rounded-full border border-brand2/40 bg-brand2/10 px-2.5 py-1 text-xs font-medium text-brand2">
            <span className="inline-block h-2 w-2 rounded-full bg-current" />
            H (hydrogen)
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-brand4/40 bg-brand4/10 px-2.5 py-1 text-xs font-medium text-brand4">
            <span className="inline-block h-2 w-2 rounded-full bg-current" />
            O (oxygen)
            </span>
        </div>

        <div
            ref={mountRef}
            aria-label="3D animation of two hydrogen molecules and one oxygen molecule rearranging into two water molecules. Drag slightly to rotate."
            className="h-[320px] w-full overflow-hidden rounded-xl border border-line bg-tint"
        />

        <div className="mt-3">
            <label htmlFor="reaction-progress" className="mb-1 block text-sm font-semibold text-fg">
            Reaction progress: {progress}%
            </label>
            <input
            id="reaction-progress"
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => onSlide(Number(e.target.value))}
            className="w-full accent-brand"
            />
        </div>

        <p className="mt-3 text-center text-sm font-medium text-brand2">{stageText(progress)}</p>

        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Hydrogen atoms</p>
            <p className="font-semibold text-brand2">4</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Oxygen atoms</p>
            <p className="font-semibold text-brand4">2</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Total atoms</p>
            <p className="font-semibold text-brand3">6</p>
            </div>
        </div>
        <p className="mt-2 text-center text-xs text-mute">These counts never change at any point in the reaction.</p>
        </div>
    );
    }

    /* ---------------- The note ---------------- */

    export default function MixturesChangesAndReactionsNote() {
    return (
        <Note
        title="Mixtures, Changes and Reactions — Chemistry in Action"
        intro="Unit 4 showed how atoms combine into molecules and compounds. Now we zoom back out to the world you can see. This unit asks how substances can be mixed without really combining, how to tell a physical change from a chemical change, and what actually happens to the atoms during a reaction."
        colors={colors}
        >
        <Section title="1. Mixtures — Physically Combined">
            <Callout>
            A <Hl>mixture</Hl> is two or more substances that are physically combined, with no new substance formed.
            Examples: air, salt water, soil, milk, and sand mixed with iron filings.
            </Callout>
            <p className="mt-3">
            A <Hl>compound</Hl> (from Unit 4) is different: its elements are chemically combined. The table below is
            the most important distinction in this unit.
            </p>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Feature</th>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Compound</th>
                    <th className="border border-line bg-brand3/15 p-2 text-left text-brand3">Mixture</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">How it is combined</td>
                    <td className="border border-line p-2">Chemically</td>
                    <td className="border border-line p-2">Physically</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Proportion of parts</td>
                    <td className="border border-line p-2">Fixed</td>
                    <td className="border border-line p-2">Can vary</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Properties</td>
                    <td className="border border-line p-2">Often completely different from the elements in it</td>
                    <td className="border border-line p-2">Each part keeps its own properties</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Separating the parts</td>
                    <td className="border border-line p-2">Needs a chemical reaction</td>
                    <td className="border border-line p-2">Physical methods are enough</td>
                </tr>
                </tbody>
            </table>
            </div>
            <Callout>
            Water (H₂O) is a compound of hydrogen and oxygen, and it behaves very differently from both. Hydrogen is a
            highly flammable gas, oxygen supports burning, but water is a liquid that puts out many fires. That is the
            sign of a <Hl>chemical</Hl> combination, not a mixture.
            </Callout>
        </Section>

        <Section title="2. Types of Mixtures">
            <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
                <p className="text-sm font-semibold text-brand2">Homogeneous mixture</p>
                <p className="mt-1 text-sm text-mute">
                Uniform throughout, so every sample looks and behaves the same. Example: a salt solution.
                </p>
            </div>
            <div className="rounded-xl border border-brand4/30 bg-brand4/10 p-4">
                <p className="text-sm font-semibold text-brand4">Heterogeneous mixture</p>
                <p className="mt-1 text-sm text-mute">
                Not uniform throughout, so you can often see the different parts. Example: sand and water.
                </p>
            </div>
            </div>
            <p className="mt-3 text-sm text-mute">
            This idea prepares us for separation: we first need to know what is in a mixture before we choose a way to
            split it up.
            </p>
        </Section>

        <Section title="3. Separating Mixtures">
            <Callout>
            <Hl>The key idea:</Hl> mixtures can be separated because their components keep their own individual
            physical properties, such as size, magnetism, boiling point and solubility.
            </Callout>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand2">
            <li>
                <Hl>Filtration</Hl> separates an insoluble solid from a liquid.
            </li>
            <li>
                <Hl>Evaporation</Hl> recovers a dissolved solid by driving off the liquid.
            </li>
            <li>
                <Hl>Distillation</Hl> recovers the liquid itself by boiling it and cooling the vapour.
            </li>
            <li>
                <Hl>Sedimentation</Hl> lets heavy insoluble particles settle, and <Hl>decantation</Hl> pours off the
                clear liquid above them.
            </li>
            <li>
                <Hl>Sieving</Hl> separates solid particles of different sizes.
            </li>
            <li>
                <Hl>Magnetic separation</Hl> pulls magnetic materials out of a mixture.
            </li>
            <li>
                <Hl>Chromatography</Hl> separates coloured substances that travel at different speeds.
            </li>
            </ul>
            <p className="mt-4">Pick a mixture below and see which method suits it, and why.</p>
            <div className="mt-3">
            <SeparationMatcher />
            </div>
        </Section>

        <Section title="4. Physical Changes and Chemical Changes">
            <Callout>
            Ask one question: <Hl>did the identity of the substance change?</Hl> That is far more reliable than
            memorising lists of examples.
            </Callout>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
                <p className="text-sm font-semibold text-brand">Physical change</p>
                <p className="mt-1 text-sm text-mute">No new substance is formed.</p>
                <p className="mt-2 text-sm text-fg">Melting ice, boiling water, cutting paper, dissolving sugar.</p>
            </div>
            <div className="rounded-xl border border-brand3/30 bg-brand3/10 p-4">
                <p className="text-sm font-semibold text-brand3">Chemical change</p>
                <p className="mt-1 text-sm text-mute">One or more new substances are formed.</p>
                <p className="mt-2 text-sm text-fg">Rusting, burning, cooking, digestion.</p>
            </div>
            </div>
            <p className="mt-3 text-sm text-mute">
            Remember Unit 1: changing state only changes how particles are arranged and moving. Boiling water is still
            water. But when iron rusts, iron atoms and oxygen atoms really do end up in a new substance.
            </p>
        </Section>

        <Section title="5. Chemical Reactions — Reactants to Products">
            <p>
            A chemical reaction is a chemical change written in the language of chemistry. The starting substances are
            the <Hl>reactants</Hl> and the new substances are the <Hl>products</Hl>.
            </p>
            <div className="mt-4 rounded-2xl border border-brand/30 bg-brand/5 p-5 text-center">
            <p className="text-sm font-semibold text-mute">Reactants → Products</p>
            <p className="font-hand mt-2 text-xl text-brand">hydrogen + oxygen → water</p>
            <p className="font-hand mt-2 text-3xl text-brand2">2H₂ + O₂ → 2H₂O</p>
            </div>
            <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-brand4">
            <li>Atoms are <Hl>rearranged</Hl> into new combinations.</li>
            <li>Atoms are <Hl>not</Hl> created or destroyed.</li>
            <li>Different combinations of atoms make new substances with new properties.</li>
            </ul>
        </Section>

        <Section title="6. Watch the Atoms Rearrange — Interactive 3D Visual">
            <p>
            Press play, or drag the slider yourself. Watch the bonds in H₂ and O₂ break, the atoms move, and new bonds
            form in H₂O. The counters under the scene stay the same the whole time.
            </p>
            <div className="mt-4">
            <ReactionVisualizer />
            </div>
        </Section>

        <Section title="7. Conservation of Atoms and Mass">
            <p>
            Count the atoms on each side of 2H₂ + O₂ → 2H₂O. This simple counting is the idea behind balancing every
            chemical equation.
            </p>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Atom</th>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Before (reactants)</th>
                    <th className="border border-line bg-brand3/15 p-2 text-left text-brand3">After (products)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">Hydrogen (H)</td>
                    <td className="border border-line p-2">4</td>
                    <td className="border border-line p-2">4</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Oxygen (O)</td>
                    <td className="border border-line p-2">2</td>
                    <td className="border border-line p-2">2</td>
                </tr>
                </tbody>
            </table>
            </div>
            <Callout>
            <Hl>Conservation of mass:</Hl> because the atoms are only rearranged, the total mass of the products equals
            the total mass of the reactants, as long as nothing escapes from the container.
            </Callout>
        </Section>

        <Section title="8. Acids, Bases and Salts">
            <p>
            Once compounds and reactions make sense, we can sort many everyday substances into acids and bases. We
            test them with <Hl>indicators</Hl> (substances that change colour to show whether something is acidic or
            basic), such as litmus paper, universal indicator, and natural indicators.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand4/30 bg-brand4/10 p-4">
                <p className="text-sm font-semibold text-brand4">Acids</p>
                <p className="mt-1 text-sm text-mute">
                Turn blue litmus red. Examples: lemon juice, vinegar, hydrochloric acid.
                </p>
            </div>
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
                <p className="text-sm font-semibold text-brand">Bases</p>
                <p className="mt-1 text-sm text-mute">
                Turn red litmus blue. Examples: soap solution, sodium hydroxide.
                </p>
            </div>
            </div>
            <div className="mt-4">
            <LitmusTester />
            </div>
            <Callout>
            <Hl>Neutralization:</Hl> acid + base → salt + water. For example, HCl + NaOH → NaCl + H₂O. Here the salt
            is sodium chloride. At this level we focus on the idea, not on pH calculations.
            </Callout>
        </Section>

        <Section title="9. Metals and Nonmetals in Action">
            <p>Now the classification from Unit 3 becomes useful, because it predicts how elements behave.</p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand3">
            <li>
                <Hl>With oxygen:</Hl> metals form metal oxides, such as magnesium burning with a bright white flame to
                make magnesium oxide. Nonmetals form nonmetal oxides, such as carbon making carbon dioxide.
            </li>
            <li>
                <Hl>With water:</Hl> reactivity varies a lot. Sodium reacts very vigorously, magnesium reacts slowly,
                and copper does not react at all.
            </li>
            <li>
                <Hl>With dilute acids:</Hl> reactive metals such as magnesium and zinc react and release hydrogen gas,
                while copper does not.
            </li>
            <li>
                <Hl>Corrosion:</Hl> iron rusts when it is exposed to both oxygen and water. Painting, oiling and
                galvanising (coating with zinc) protect it.
            </li>
            <li>
                <Hl>Uses:</Hl> metals suit wires and utensils because they conduct and can be drawn or hammered.
                Nonmetals are just as essential: oxygen for breathing, nitrogen in fertilizers, chlorine to disinfect
                water, and carbon as fuel.
            </li>
            </ul>
        </Section>

        <Section title="10. Chemistry in the Real World">
            <p>Keep asking the question from Unit 1: what are the particles doing? It explains everyday life too.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
                <p className="text-sm font-semibold text-brand">Food</p>
                <p className="mt-1 text-sm text-mute">
                Carbohydrates, proteins and fats are chemical compounds, and digestion is a chemical change that breaks
                them into smaller substances.
                </p>
            </div>
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
                <p className="text-sm font-semibold text-brand2">Medicine</p>
                <p className="mt-1 text-sm text-mute">
                Medicines, antiseptics and antacids are all chemicals. An antacid is a base that neutralizes extra
                stomach acid.
                </p>
            </div>
            <div className="rounded-xl border border-brand3/30 bg-brand3/10 p-4">
                <p className="text-sm font-semibold text-brand3">Environment</p>
                <p className="mt-1 text-sm text-mute">
                Air pollution, water pollution and greenhouse gases such as carbon dioxide are all questions about
                which substances are in our air and water.
                </p>
            </div>
            <div className="rounded-xl border border-brand4/30 bg-brand4/10 p-4">
                <p className="text-sm font-semibold text-brand4">Materials and agriculture</p>
                <p className="mt-1 text-sm text-mute">
                Plastics, metals, glass and ceramics are chosen for their properties, and fertilizers and soil
                chemistry help crops grow.
                </p>
            </div>
            </div>
        </Section>

        <Section title="11. A Peek Ahead — Energy and Counting">
            <p>Two big ideas are only introduced here. You will study them properly in later classes.</p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand2">
            <li>
                <Hl>Energy:</Hl> chemical changes involve energy. Burning releases energy, some reactions absorb
                energy, and dissolving can release or absorb heat.
            </li>
            <li>
                <Hl>Counting particles:</Hl> relative atomic mass, relative molecular mass, and ratios in compounds
                lead later to the mole and to calculations from chemical equations.
            </li>
            </ul>
        </Section>

        <Section title="12. Practice Questions">
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>State two differences between a compound and a mixture, and give one example of each.</li>
            <li>Classify each as homogeneous or heterogeneous: (a) salt solution (b) sand and water (c) soil.</li>
            <li>
                Name the best separation method for: (a) iron filings from sand (b) pure water from salt water (c) salt
                from salt water (d) the colours in black ink.
            </li>
            <li>
                Say whether each is a physical or a chemical change, and why: (a) melting ice (b) burning wood (c)
                cutting paper (d) cooking an egg.
            </li>
            <li>
                Write the word equation for hydrogen burning in oxygen, then count the atoms on both sides of 2H₂ + O₂ →
                2H₂O.
            </li>
            <li>Why does the total mass stay the same during a reaction in a closed container?</li>
            <li>
                Complete: HCl + NaOH → ____ + ____. Name the salt formed. Then suggest what to apply to an ant sting,
                which contains an acid.
            </li>
            <li>
                A soap solution is tested with both litmus papers. What happens to each paper, and what does that tell
                you?
            </li>
            <li>Name two things that iron needs in order to rust, and give two ways to prevent it.</li>
            </ol>

            <details className="mt-4 rounded-xl border border-line bg-tint p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand">Show answer key</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mute">
                <li>
                In a compound the elements are chemically combined in a fixed proportion and the properties change
                completely, while in a mixture the parts are physically combined and keep their own properties.
                Example of a compound: water. Example of a mixture: salt water, or air.
                </li>
                <li>(a) Homogeneous (b) Heterogeneous (c) Heterogeneous</li>
                <li>(a) Magnetic separation (b) Distillation (c) Evaporation (d) Chromatography</li>
                <li>
                (a) Physical: it is still water, so no new substance forms. (b) Chemical: new substances such as ash
                and gases form. (c) Physical: it is still paper. (d) Chemical: new substances form that cannot be
                turned back into a raw egg.
                </li>
                <li>
                hydrogen + oxygen → water. Hydrogen atoms: 4 before and 4 after. Oxygen atoms: 2 before and 2 after.
                </li>
                <li>
                Because atoms are only rearranged in a reaction. None are created or destroyed, so the total mass of
                the atoms stays the same.
                </li>
                <li>
                HCl + NaOH → NaCl + H₂O. The salt is sodium chloride (NaCl). A mild base such as baking soda solution
                neutralizes the acid in the sting.
                </li>
                <li>
                Red litmus turns blue and blue litmus stays blue. This shows that soap solution is a base.
                </li>
                <li>
                Iron needs oxygen (air) and water. It can be protected by painting, oiling, or galvanising (coating
                with zinc).
                </li>
            </ol>
            </details>
        </Section>

        <Section title="13. Quick Revision Sheet">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand4">
            <li>
                A <Hl>mixture</Hl> is physically combined and a <Hl>compound</Hl> is chemically combined. Mixtures can be
                homogeneous or heterogeneous.
            </li>
            <li>
                Mixtures are separated by physical methods: filtration, evaporation, distillation, sedimentation,
                decantation, sieving, magnetic separation and chromatography.
            </li>
            <li>
                <Hl>Physical change:</Hl> no new substance. <Hl>Chemical change:</Hl> new substances form.
            </li>
            <li>
                In a reaction, <Hl>reactants → products</Hl>, and atoms are rearranged, never created or destroyed. So
                mass is conserved.
            </li>
            <li>
                <Hl>Acid + base → salt + water</Hl>. Acids turn blue litmus red and bases turn red litmus blue.
            </li>
            <li>Metals and nonmetals react differently with oxygen, water and acids, and iron rusts with oxygen and water.</li>
            </ul>
            <Callout>
            <Hl>The five big ideas of this whole course:</Hl> (1) matter is made of particles, (2) the number of protons
            decides which element an atom is, (3) electrons decide chemical behaviour, (4) the periodic table is a map of
            patterns that lets us predict behaviour, and (5) chemical reactions rearrange atoms to make new substances.
            </Callout>
        </Section>
        </Note>
    );
    }