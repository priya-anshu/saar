    "use client";

    import { useEffect, useRef, useState } from "react";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    type ElementKey = "H" | "He" | "Li" | "C" | "O" | "Na" | "Cl";

    interface AtomData {
    name: string;
    protons: number;
    neutrons: number;
    shells: number[];
    }

    const ELEMENTS: Record<ElementKey, AtomData> = {
    H: { name: "Hydrogen", protons: 1, neutrons: 0, shells: [1] },
    He: { name: "Helium", protons: 2, neutrons: 2, shells: [2] },
    Li: { name: "Lithium", protons: 3, neutrons: 4, shells: [2, 1] },
    C: { name: "Carbon", protons: 6, neutrons: 6, shells: [2, 4] },
    O: { name: "Oxygen", protons: 8, neutrons: 8, shells: [2, 6] },
    Na: { name: "Sodium", protons: 11, neutrons: 12, shells: [2, 8, 1] },
    Cl: { name: "Chlorine", protons: 17, neutrons: 18, shells: [2, 8, 7] },
    };

    const ELEMENT_KEYS = Object.keys(ELEMENTS) as ElementKey[];

    interface AtomHandle {
    build: (key: ElementKey) => void;
    }

    function AtomViewer() {
    const mountRef = useRef<HTMLDivElement>(null);
    const simRef = useRef<AtomHandle | null>(null);
    const [element, setElement] = useState<ElementKey>("H");
    const data = ELEMENTS[element];

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 2.6, 6.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.6;
        controls.enableZoom = false;

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dLight.position.set(4, 6, 5);
        scene.add(dLight);

        const particleGeo = new THREE.SphereGeometry(0.14, 14, 14);
        const electronGeo = new THREE.SphereGeometry(0.09, 12, 12);
        const protonMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[3]), roughness: 0.4 });
        const neutronMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[2]), roughness: 0.4 });
        const electronMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colors.light[0]),
        emissive: new THREE.Color(colors.light[0]),
        emissiveIntensity: 0.35,
        roughness: 0.3,
        });
        const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colors.light[1]),
        transparent: true,
        opacity: 0.6,
        });

        let atomGroup: THREE.Group | null = null;
        let ringGeos: THREE.TorusGeometry[] = [];

        const build = (key: ElementKey) => {
        if (atomGroup) {
            scene.remove(atomGroup);
            ringGeos.forEach((g) => g.dispose());
            ringGeos = [];
        }
        const group = new THREE.Group();
        const atom = ELEMENTS[key];

        const nucleusCount = atom.protons + atom.neutrons;
        const nucleusRadius = 0.38;
        for (let i = 0; i < nucleusCount; i++) {
            const isProton = i < atom.protons;
            const mesh = new THREE.Mesh(particleGeo, isProton ? protonMat : neutronMat);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = Math.random() * nucleusRadius;
            mesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
            );
            group.add(mesh);
        }

        atom.shells.forEach((count, i) => {
            const radius = 1.0 + i * 0.85;
            const shellGroup = new THREE.Group();
            shellGroup.rotation.x = i * 0.5 + 0.3;
            shellGroup.rotation.z = i * 0.35;
            shellGroup.userData.speed = 0.5 - i * 0.1;

            const ringGeo = new THREE.TorusGeometry(radius, 0.012, 8, 64);
            ringGeos.push(ringGeo);
            shellGroup.add(new THREE.Mesh(ringGeo, ringMat));

            for (let e = 0; e < count; e++) {
            const angle = (e / count) * Math.PI * 2;
            const eMesh = new THREE.Mesh(electronGeo, electronMat);
            eMesh.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
            shellGroup.add(eMesh);
            }
            group.add(shellGroup);
        });

        scene.add(group);
        atomGroup = group;
        };

        build("H");
        simRef.current = { build };

        const resize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(mount);

        let frame = 0;
        const animate = () => {
        frame = requestAnimationFrame(animate);
        if (atomGroup) {
            atomGroup.children.forEach((child) => {
            if (child instanceof THREE.Group) {
                const speed = typeof child.userData.speed === "number" ? child.userData.speed : 0.3;
                child.rotation.y += speed * 0.02;
            }
            });
        }
        controls.update();
        renderer.render(scene, camera);
        };
        animate();

        return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        ringGeos.forEach((g) => g.dispose());
        particleGeo.dispose();
        electronGeo.dispose();
        protonMat.dispose();
        neutronMat.dispose();
        electronMat.dispose();
        ringMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
            mount.removeChild(renderer.domElement);
        }
        simRef.current = null;
        };
    }, []);

    const choose = (key: ElementKey) => {
        setElement(key);
        simRef.current?.build(key);
    };

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap justify-center gap-2">
            {ELEMENT_KEYS.map((key) => (
            <button
                key={key}
                type="button"
                aria-label={`Show the atom model of ${ELEMENTS[key].name}`}
                aria-pressed={element === key}
                onClick={() => choose(key)}
                className={
                element === key
                    ? "rounded-lg border border-brand bg-brand px-3 py-1.5 text-sm font-bold text-page"
                    : "rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm font-bold text-fg"
                }
            >
                {key}
            </button>
            ))}
        </div>

        <div
            ref={mountRef}
            aria-label="3D model of an atom with its nucleus and electron shells. Drag to rotate."
            className="h-[360px] w-full overflow-hidden rounded-xl border border-line bg-tint"
        />

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Element</p>
            <p className="font-semibold text-fg">
                {data.name} ({element})
            </p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Protons</p>
            <p className="font-semibold text-brand4">{data.protons}</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Neutrons</p>
            <p className="font-semibold text-brand3">{data.neutrons}</p>
            </div>
            <div className="rounded-lg border border-line bg-page p-3">
            <p className="text-xs text-mute">Shell config</p>
            <p className="font-semibold text-brand2">{data.shells.join(", ")}</p>
            </div>
        </div>
        <p className="mt-3 text-center text-xs text-mute">
            Since every atom here is electrically neutral, the number of electrons always equals the number of protons.
        </p>
        </div>
    );
    }

    export default function InsideTheAtomNote() {
    return (
        <Note
        title="Inside the Atom"
        intro="In Unit 1 we said matter is made of particles. Now we zoom into a single particle and ask: what is it made of? The answer — the atom — turns out to be built from just three simpler building blocks, arranged in a pattern that explains almost everything else in chemistry."
        colors={colors}
        >
        <Section title="1. What Is an Atom?">
            <Callout>
            An <Hl>atom</Hl> is the smallest unit (particle) of an element that still keeps the chemical identity of
            that element. Examples: a hydrogen atom, a carbon atom, an oxygen atom, a sodium atom.
            </Callout>
            <p className="mt-3">
            Scientists proposed the idea of atoms because many chemical observations become far easier to explain if
            matter is made of tiny, discrete (separate and countable) particles rather than being one continuous
            substance. This is a great example of how science works:
            </p>
            <Callout>
            Models are created to explain what we observe — and the atomic model is one of the most powerful models
            ever built.
            </Callout>
        </Section>

        <Section title="2. Three Subatomic Particles">
            <p>
            For school-level chemistry, every atom is built from three types of particles smaller than the atom
            itself, called <Hl>subatomic particles</Hl>.
            </p>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Particle</th>
                    <th className="border border-line bg-brand/15 p-2 text-center text-brand">Charge</th>
                    <th className="border border-line bg-brand/15 p-2 text-center text-brand">Relative mass</th>
                    <th className="border border-line bg-brand/15 p-2 text-center text-brand">Location</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2 font-semibold text-brand4">● Proton</td>
                    <td className="border border-line p-2 text-center">+1</td>
                    <td className="border border-line p-2 text-center">1</td>
                    <td className="border border-line p-2 text-center">Nucleus</td>
                </tr>
                <tr>
                    <td className="border border-line p-2 font-semibold text-brand3">● Neutron</td>
                    <td className="border border-line p-2 text-center">0</td>
                    <td className="border border-line p-2 text-center">1</td>
                    <td className="border border-line p-2 text-center">Nucleus</td>
                </tr>
                <tr>
                    <td className="border border-line p-2 font-semibold text-brand">● Electron</td>
                    <td className="border border-line p-2 text-center">−1</td>
                    <td className="border border-line p-2 text-center">~1/1836</td>
                    <td className="border border-line p-2 text-center">Outside nucleus</td>
                </tr>
                </tbody>
            </table>
            </div>
            <Callout>
            <Hl>Good to know:</Hl> in advanced physics, protons and neutrons are themselves made of even smaller
            particles called quarks — but for the basic chemistry model, we treat protons, neutrons, and electrons as
            the three fundamental building blocks.
            </Callout>
        </Section>

        <Section title="3. Structure of the Atom">
            <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
                <p className="text-sm font-semibold text-brand2">Nucleus</p>
                <p className="mt-1 text-sm text-mute">
                The dense central core of the atom, containing protons and neutrons. Almost all of the atom’s mass is
                concentrated here.
                </p>
            </div>
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
                <p className="text-sm font-semibold text-brand">Electron Shells</p>
                <p className="mt-1 text-sm text-mute">
                Electrons occupy regions around the nucleus called shells (or energy levels) — think of them as layers
                at increasing distance from the centre.
                </p>
            </div>
            </div>
            <Callout>
            <Hl>Why electrons matter so much:</Hl> chemical behaviour is controlled mainly by <Hl>electrons</Hl>,
            especially the ones in the <Hl>outermost shell</Hl>. This single fact is the bridge connecting atomic
            structure to the periodic table and to valency, which we study in Units 3 and 4.
            </Callout>
        </Section>

        <Section title="4. Interactive 3D Atom Model Viewer">
            <p>
            Pick an element below to see its nucleus (protons in rose, neutrons in amber) and its electron shells
            (electrons in indigo) filling up. Drag to rotate your view.
            </p>
            <div className="mt-4">
            <AtomViewer />
            </div>
        </Section>

        <Section title="5. Atomic Number and Mass Number">
            <Callout>
            <Hl>Atomic number (Z):</Hl> the number of protons in an atom. This single number determines{" "}
            <Hl>which element</Hl> the atom is.
            </Callout>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Element</th>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">
                    Atomic number (protons)
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">Hydrogen</td>
                    <td className="border border-line p-2">1</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Carbon</td>
                    <td className="border border-line p-2">6</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Oxygen</td>
                    <td className="border border-line p-2">8</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Sodium</td>
                    <td className="border border-line p-2">11</td>
                </tr>
                </tbody>
            </table>
            </div>
            <Callout>
            <Hl>The single most important rule in all of chemistry:</Hl> change the number of protons, and you get a{" "}
            <Hl>completely different element</Hl>.
            </Callout>
            <div className="mt-4 rounded-2xl border border-brand3/30 bg-brand3/5 p-5 text-center">
            <p className="text-sm font-semibold text-mute">Mass number formula</p>
            <p className="font-hand mt-2 text-3xl text-brand3">A = Z + N</p>
            <p className="mt-2 text-xs text-mute">A = mass number, Z = number of protons, N = number of neutrons</p>
            </div>
            <Callout>
            <Hl>Worked example:</Hl> a sodium atom has 11 protons and 12 neutrons. Find its mass number. A = 11 + 12 =
            23
            </Callout>
        </Section>

        <Section title="6. Neutral Atoms and Isotopes">
            <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
                <p className="text-sm font-semibold text-brand2">Neutral atom</p>
                <p className="mt-1 text-sm text-mute">
                An atom with no overall electric charge, where the number of protons equals the number of electrons.
                </p>
            </div>
            <div className="rounded-xl border border-brand4/30 bg-brand4/10 p-4">
                <p className="text-sm font-semibold text-brand4">Isotopes</p>
                <p className="mt-1 text-sm text-mute">
                Atoms of the same element (same number of protons) that have a different number of neutrons, and
                therefore a different mass number.
                </p>
            </div>
            </div>
        </Section>

        <Section title="7. Elements and Chemical Symbols">
            <Callout>
            An <Hl>element</Hl> is a pure substance made entirely of atoms that all have the same number of protons
            (the same atomic number).
            </Callout>
            <p className="mt-3">
            Chemistry needs a short, universal language, so every element is given a <Hl>symbol</Hl> — usually one or
            two letters, often based on the element’s Latin or English name.
            </p>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Element</th>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Symbol</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">Hydrogen</td>
                    <td className="border border-line p-2 font-semibold">H</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Oxygen</td>
                    <td className="border border-line p-2 font-semibold">O</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Carbon</td>
                    <td className="border border-line p-2 font-semibold">C</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Sodium</td>
                    <td className="border border-line p-2 font-semibold">Na</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Iron</td>
                    <td className="border border-line p-2 font-semibold">Fe</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Chlorine</td>
                    <td className="border border-line p-2 font-semibold">Cl</td>
                </tr>
                </tbody>
            </table>
            </div>
            <Callout>
            Symbols let us write chemistry compactly: instead of “sodium combines with chlorine,” we can write{" "}
            <Hl>Na + Cl</Hl>. This short-hand becomes essential once we start writing chemical formulas and equations
            in later units.
            </Callout>
        </Section>

        <Section title="8. Practice Questions">
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>Name the three subatomic particles and state the charge and location of each.</li>
            <li>An atom has 8 protons and 8 neutrons. Find its mass number, and name the element (atomic number 8 = oxygen).</li>
            <li>
                Why does changing the number of protons in an atom always produce a different element, while changing
                the number of neutrons does not?
            </li>
            <li>
                A chlorine atom has atomic number 17 and mass number 35. How many protons, electrons, and neutrons does
                it have?
            </li>
            <li>
                Explain in one or two sentences why electrons are described as the particles that “control chemical
                behaviour.”
            </li>
            <li>
                Two atoms both have 6 protons, but one has 6 neutrons and the other has 8 neutrons. What are they
                called in relation to each other?
            </li>
            </ol>
            <details className="mt-4 rounded-xl border border-line bg-tint p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand2">Show answer key</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mute">
                <li>
                Proton (+1 charge, in the nucleus), Neutron (0 charge, in the nucleus), Electron (−1 charge, outside
                the nucleus in shells).
                </li>
                <li>Mass number = 8 + 8 = 16; the element is oxygen.</li>
                <li>
                The number of protons (atomic number) defines which element it is; neutrons only change the mass
                number, creating isotopes of the same element rather than a new element.
                </li>
                <li>Protons = 17, electrons = 17 (neutral atom), neutrons = 35 − 17 = 18.</li>
                <li>
                Electrons, especially the outermost ones, are involved in forming bonds with other atoms, so they
                determine how an atom reacts and combines with others.
                </li>
                <li>They are isotopes of carbon.</li>
            </ol>
            </details>
        </Section>

        <Section title="9. Quick Revision Sheet">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand4">
            <li>
                An <Hl>atom</Hl> is the smallest particle of an element that keeps its chemical identity.
            </li>
            <li>
                Three subatomic particles: <Hl>proton (+1, nucleus), neutron (0, nucleus), electron (−1, shells)</Hl>.
            </li>
            <li>
                <Hl>Atomic number (Z)</Hl> = number of protons = identity of the element.
            </li>
            <li>
                <Hl>Mass number (A) = protons + neutrons</Hl>.
            </li>
            <li>
                In a <Hl>neutral atom</Hl>, protons = electrons.
            </li>
            <li>
                <Hl>Isotopes</Hl> = same protons, different neutrons.
            </li>
            <li>
                An <Hl>element</Hl> is made of atoms all sharing the same atomic number; each has a short{" "}
                <Hl>symbol</Hl>.
            </li>
            <li>
                <Hl>Electrons</Hl>, especially outer-shell ones, control chemical behaviour — the key idea leading into
                the periodic table.
            </li>
            </ul>
            <Callout>
            <Hl>Coming up in Unit 3:</Hl> we ask why over 100 elements needed organizing at all, and discover how the
            periodic table turns electron-shell patterns into a map we can actually use.
            </Callout>
        </Section>
        </Note>
    );
    }