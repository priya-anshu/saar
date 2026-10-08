    "use client";

    import { useEffect, useRef, useState } from "react";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    type Mode = "ionic" | "covalent";
    type IonicPhase = "start" | "moving" | "done";

    interface BondHandle {
    setMode: (m: Mode) => void;
    }

    const IONIC_CAPTIONS: Record<IonicPhase, string> = {
    start: "Sodium has 1 valence electron. Chlorine has 7 and is one short of a full shell.",
    moving: "Sodium gives its valence electron to chlorine.",
    done: "Now Na⁺ (smaller) and Cl⁻ (larger) are oppositely charged ions, and they attract each other.",
    };

    const COVALENT_CAPTION =
    "Two hydrogen atoms share a pair of electrons. Each atom counts both electrons, so both reach a full first shell of 2.";

    function BondingVisualizer() {
    const mountRef = useRef<HTMLDivElement>(null);
    const simRef = useRef<BondHandle | null>(null);
    const [mode, setModeState] = useState<Mode>("ionic");
    const [phase, setPhase] = useState<IonicPhase>("start");

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

        let current: Mode = "ionic";
        let lastPhase: IonicPhase = "start";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0.6, 6.2);

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
        const electronGeo = geo(new THREE.SphereGeometry(0.11, 16, 16));

        const naMat = mat(new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[0]), roughness: 0.4 }));
        const clMat = mat(new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[3]), roughness: 0.4 }));
        const hMat = mat(new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.light[1]), roughness: 0.4 }));
        const eMat = mat(
        new THREE.MeshStandardMaterial({
            color: new THREE.Color(colors.light[2]),
            emissive: new THREE.Color(colors.light[2]),
            emissiveIntensity: 0.5,
            roughness: 0.3,
        })
        );
        const ringMatNa = mat(new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.light[0]), transparent: true, opacity: 0.45 }));
        const ringMatCl = mat(new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.light[3]), transparent: true, opacity: 0.45 }));
        const ringMatH = mat(new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.light[1]), transparent: true, opacity: 0.5 }));

        // ---------- Ionic group ----------
        const NA_X = -1.6;
        const CL_X = 1.6;
        const R_NA = 0.85;
        const R_CL = 0.95;

        const ionic = new THREE.Group();

        const naMesh = new THREE.Mesh(sphereGeo, naMat);
        naMesh.position.set(NA_X, 0, 0);
        naMesh.scale.setScalar(0.42);
        ionic.add(naMesh);

        const clMesh = new THREE.Mesh(sphereGeo, clMat);
        clMesh.position.set(CL_X, 0, 0);
        clMesh.scale.setScalar(0.46);
        ionic.add(clMesh);

        const naRing = new THREE.Mesh(geo(new THREE.TorusGeometry(R_NA, 0.012, 8, 64)), ringMatNa);
        naRing.position.set(NA_X, 0, 0);
        ionic.add(naRing);

        const clRing = new THREE.Mesh(geo(new THREE.TorusGeometry(R_CL, 0.012, 8, 64)), ringMatCl);
        clRing.position.set(CL_X, 0, 0);
        ionic.add(clRing);

        for (let k = 0; k < 8; k++) {
        if (k === 4) continue; // empty slot where the incoming electron lands
        const angle = (k / 8) * Math.PI * 2;
        const e = new THREE.Mesh(electronGeo, eMat);
        e.position.set(CL_X + R_CL * Math.cos(angle), R_CL * Math.sin(angle), 0);
        ionic.add(e);
        }

        const movingElectron = new THREE.Mesh(electronGeo, eMat);
        ionic.add(movingElectron);
        scene.add(ionic);

        // ---------- Covalent group ----------
        const covalent = new THREE.Group();
        const h1 = new THREE.Mesh(sphereGeo, hMat);
        h1.position.set(-0.75, 0, 0);
        h1.scale.setScalar(0.3);
        const h2 = new THREE.Mesh(sphereGeo, hMat);
        h2.position.set(0.75, 0, 0);
        h2.scale.setScalar(0.3);
        covalent.add(h1, h2);

        const ellipse = new THREE.Mesh(geo(new THREE.TorusGeometry(1, 0.012, 8, 96)), ringMatH);
        ellipse.scale.set(1.45, 0.65, 1);
        covalent.add(ellipse);

        const shared1 = new THREE.Mesh(electronGeo, eMat);
        const shared2 = new THREE.Mesh(electronGeo, eMat);
        covalent.add(shared1, shared2);
        covalent.visible = false;
        scene.add(covalent);

        simRef.current = {
        setMode: (m: Mode) => {
            current = m;
            ionic.visible = m === "ionic";
            covalent.visible = m === "covalent";
        },
        };

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

        const clock = new THREE.Clock();
        const smooth = (x: number) => x * x * (3 - 2 * x);
        let frame = 0;

        const animate = () => {
        frame = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (current === "ionic") {
            const cycle = t % 8;
            let ph: IonicPhase = "start";
            let k = 0;

            if (cycle < 2.5) {
            const a = (cycle / 2.5) * Math.PI * 4;
            movingElectron.position.set(NA_X + R_NA * Math.cos(a), R_NA * Math.sin(a), 0);
            } else if (cycle < 4.5) {
            ph = "moving";
            const p = smooth((cycle - 2.5) / 2);
            k = p;
            const x0 = NA_X + R_NA;
            const x1 = CL_X - R_CL;
            movingElectron.position.set(x0 + (x1 - x0) * p, 0.55 * Math.sin(Math.PI * p), 0);
            } else {
            ph = "done";
            k = 1;
            movingElectron.position.set(CL_X - R_CL, 0, 0);
            }

            naMesh.scale.setScalar(0.42 - 0.12 * k);
            clMesh.scale.setScalar(0.46 + 0.1 * k);

            if (ph !== lastPhase) {
            lastPhase = ph;
            setPhase(ph);
            }
        } else {
            const w = t * 1.3;
            shared1.position.set(1.45 * Math.cos(w), 0.65 * Math.sin(w), 0);
            shared2.position.set(1.45 * Math.cos(w + Math.PI), 0.65 * Math.sin(w + Math.PI), 0);
        }

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

    const choose = (m: Mode) => {
        setModeState(m);
        simRef.current?.setMode(m);
    };

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
            <button
            type="button"
            aria-label="Show ionic bonding between sodium and chlorine"
            aria-pressed={mode === "ionic"}
            onClick={() => choose("ionic")}
            className={
                mode === "ionic"
                ? "rounded-lg border border-brand bg-brand px-4 py-1.5 text-sm font-semibold text-page"
                : "rounded-lg border border-brand/40 bg-page px-3 py-1.5 text-sm text-fg"
            }
            >
            Ionic: Na + Cl
            </button>
            <button
            type="button"
            aria-label="Show covalent bonding between two hydrogen atoms"
            aria-pressed={mode === "covalent"}
            onClick={() => choose("covalent")}
            className={
                mode === "covalent"
                ? "rounded-lg border border-brand2 bg-brand2 px-4 py-1.5 text-sm font-semibold text-page"
                : "rounded-lg border border-brand2/40 bg-page px-3 py-1.5 text-sm text-fg"
            }
            >
            Covalent: H + H
            </button>
        </div>

        <div
            ref={mountRef}
            aria-label="3D animation of ionic and covalent bonding. Drag slightly to rotate."
            className="h-[320px] w-full overflow-hidden rounded-xl border border-line bg-tint"
        />

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
            {mode === "ionic" ? (
            <>
                <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-brand">Na (sodium)</span>
                <span className="rounded-full border border-brand4/40 bg-brand4/10 px-2.5 py-1 text-brand4">Cl (chlorine)</span>
                <span className="rounded-full border border-brand3/40 bg-brand3/10 px-2.5 py-1 text-brand3">electron</span>
            </>
            ) : (
            <>
                <span className="rounded-full border border-brand2/40 bg-brand2/10 px-2.5 py-1 text-brand2">H (hydrogen)</span>
                <span className="rounded-full border border-brand3/40 bg-brand3/10 px-2.5 py-1 text-brand3">shared electron</span>
            </>
            )}
        </div>

        <p className="mt-3 text-center text-sm font-medium text-brand2">
            {mode === "ionic" ? IONIC_CAPTIONS[phase] : COVALENT_CAPTION}
        </p>
        </div>
    );
    }

    export default function ValencyIonsAndBondingNote() {
    return (
        <Note
        title="Valency, Ions and Bonding — How Atoms Combine"
        intro="Unit 3 ended with one idea: atoms interact mainly through their valence electrons. This unit turns that idea into something you can actually use — working out an atom’s valency, meeting ions, and watching atoms bond by transferring or sharing electrons."
        colors={colors}
        >
        <Section title="1. Valency — The Basic Idea">
            <p>
            Atoms are most stable when their outermost shell is full. For most of the atoms met in Unit 3, a full
            outer shell means 8 electrons (except the very first shell, which is full at 2). Atoms constantly move
            toward this more stable arrangement by <Hl>losing</Hl>, <Hl>gaining</Hl>, or <Hl>sharing</Hl> electrons.
            </p>
            <p className="mt-3">
            The number of electrons an atom tends to lose, gain, or share in order to reach this stable arrangement is
            called its <Hl>valency</Hl>.
            </p>
            <Callout>
            <Hl>Valency is a consequence of electron arrangement</Hl> — not an isolated fact to memorise. If you know
            how many valence electrons an atom has, you can work out its valency yourself.
            </Callout>
        </Section>

        <Section title="2. Working Out Valency from Valence Electrons">
            <p>
            An atom with only a few valence electrons finds it easier to <Hl>lose</Hl> them; an atom that is only a
            few electrons short of a full shell finds it easier to <Hl>gain</Hl> them.
            </p>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Element</th>
                    <th className="border border-line bg-brand/15 p-2 text-left text-brand">Valence electrons</th>
                    <th className="border border-line bg-brand3/15 p-2 text-left text-brand3">Tendency</th>
                    <th className="border border-line bg-brand4/15 p-2 text-left text-brand4">Valency</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">Na (Sodium)</td>
                    <td className="border border-line p-2">1</td>
                    <td className="border border-line p-2">Tends to lose 1 electron</td>
                    <td className="border border-line p-2">1</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Mg (Magnesium)</td>
                    <td className="border border-line p-2">2</td>
                    <td className="border border-line p-2">Tends to lose 2 electrons</td>
                    <td className="border border-line p-2">2</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Al (Aluminium)</td>
                    <td className="border border-line p-2">3</td>
                    <td className="border border-line p-2">Tends to lose 3 electrons</td>
                    <td className="border border-line p-2">3</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">O (Oxygen)</td>
                    <td className="border border-line p-2">6</td>
                    <td className="border border-line p-2">Tends to gain 2 electrons</td>
                    <td className="border border-line p-2">2</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Cl (Chlorine)</td>
                    <td className="border border-line p-2">7</td>
                    <td className="border border-line p-2">Tends to gain 1 electron</td>
                    <td className="border border-line p-2">1</td>
                </tr>
                </tbody>
            </table>
            </div>
        </Section>

        <Section title="3. Ions — Cations and Anions">
            <p>Once an atom loses or gains electrons, it is no longer electrically neutral — it becomes an ion.</p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand2">
            <li>
                A <Hl>cation</Hl> forms when an atom <Hl>loses</Hl> electrons, leaving it positively charged. Example:
                Na loses 1 electron to become Na⁺.
            </li>
            <li>
                An <Hl>anion</Hl> forms when an atom <Hl>gains</Hl> electrons, leaving it negatively charged. Example:
                Cl gains 1 electron to become Cl⁻.
            </li>
            </ul>
            <Callout>
            Ions explain how compounds form. Oppositely charged ions attract one another:{" "}
            <Hl>Na⁺ + Cl⁻ → NaCl</Hl>. This marks the transition from individual atoms to substances made from atoms.
            </Callout>
        </Section>

        <Section title="4. Watch Atoms Bond — Interactive 3D Visual">
            <p>
            Switch between the two bonding modes below. In the ionic mode, watch the amber electron leave sodium and
            settle on chlorine — and notice how Na shrinks while Cl grows. In the covalent mode, watch two electrons
            travel around <Hl>both</Hl> nuclei at once.
            </p>
            <div className="mt-4">
            <BondingVisualizer />
            </div>
        </Section>

        <Section title="5. Covalent Bonding — Electron Sharing">
            <p>
            Not every element wants to lose or gain electrons completely. When two nonmetal atoms bond, they often{" "}
            <Hl>share</Hl> electrons instead of transferring them outright. This is called <Hl>covalent bonding</Hl>.
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-brand3">
            <li>
                <Hl>Ionic bonding</Hl>: electrons are transferred. Typically occurs between a metal and a nonmetal.
                Example: NaCl.
            </li>
            <li>
                <Hl>Covalent bonding</Hl>: electrons are shared. Typically occurs between two nonmetals. Examples: H₂O,
                CO₂, O₂.
            </li>
            </ul>
            <p className="mt-3 text-sm text-mute">
            At this level, the key distinction to remember is simply <Hl>electron transfer versus electron
            sharing</Hl> — the deeper orbital theory behind bonding comes later.
            </p>
        </Section>

        <Section title="6. Chemical Formulae — Why Ratios Matter">
            <p>
            A chemical formula is not arbitrary — it encodes the exact ratio of atoms needed so that the overall
            charges balance out, or so that every atom reaches a stable electron arrangement.
            </p>
            <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Formula</th>
                    <th className="border border-line bg-brand2/15 p-2 text-left text-brand2">Why this ratio</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-line p-2">NaCl</td>
                    <td className="border border-line p-2">One Na⁺ (charge +1) balances one Cl⁻ (charge −1).</td>
                </tr>
                <tr>
                    <td className="border border-line p-2">CaCl₂</td>
                    <td className="border border-line p-2">
                    One Ca²⁺ (charge +2) needs two Cl⁻ ions (charge −1 each) to balance.
                    </td>
                </tr>
                <tr>
                    <td className="border border-line p-2">H₂O</td>
                    <td className="border border-line p-2">
                    Oxygen needs to share with two hydrogen atoms to complete its outer shell.
                    </td>
                </tr>
                <tr>
                    <td className="border border-line p-2">Al₂O₃</td>
                    <td className="border border-line p-2">
                    Two Al³⁺ ions (total charge +6) balance three O²⁻ ions (total charge −6).
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </Section>

        <Section title="7. Practice Questions">
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>Explain why valency is described as a consequence of electron arrangement rather than a fact to memorise.</li>
            <li>An atom has 2 valence electrons. Predict its valency and whether it is more likely to lose or gain electrons.</li>
            <li>What is the difference between a cation and an anion? Give one example of each.</li>
            <li>Classify each as ionic or covalent bonding, and explain why: (a) potassium and fluorine (b) two oxygen atoms.</li>
            <li>Explain, using charges, why the formula for calcium chloride is CaCl₂ and not CaCl.</li>
            <li>In your own words, describe the difference between electron transfer and electron sharing.</li>
            </ol>

            <details className="mt-4 rounded-xl border border-line bg-tint p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand">Show answer key</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mute">
                <li>
                Because the number of electrons an atom tends to lose, gain or share comes directly from how many
                valence electrons it already has and how close that is to a full outer shell — it is not a random
                number assigned to each element.
                </li>
                <li>
                Valency 2; it is more likely to lose its 2 valence electrons, since losing 2 is easier than gaining 6
                to fill the shell.
                </li>
                <li>
                A cation is a positive ion formed when an atom loses electrons (example: Na⁺). An anion is a negative
                ion formed when an atom gains electrons (example: Cl⁻).
                </li>
                <li>
                (a) Ionic — a metal (potassium) and a nonmetal (fluorine) typically transfer electrons. (b) Covalent
                — two nonmetal atoms of the same element share electrons.
                </li>
                <li>
                Calcium forms Ca²⁺ (charge +2) and chlorine forms Cl⁻ (charge −1). To balance the charges, two Cl⁻
                ions are needed for every one Ca²⁺ ion, giving CaCl₂.
                </li>
                <li>
                In electron transfer, one atom gives up an electron completely to another atom, creating two
                oppositely charged ions. In electron sharing, both atoms keep a claim on the same pair of electrons,
                and neither atom becomes a fully charged ion.
                </li>
            </ol>
            </details>
        </Section>

        <Section title="8. Quick Revision Sheet">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand4">
            <li>
                <Hl>Valency</Hl> = the number of electrons an atom tends to lose, gain, or share to reach a stable
                outer shell.
            </li>
            <li>
                A <Hl>cation</Hl> forms when an atom loses electrons (positive charge); an <Hl>anion</Hl> forms when an
                atom gains electrons (negative charge).
            </li>
            <li>
                <Hl>Ionic bonding</Hl> (electron transfer) typically happens between a metal and a nonmetal;{" "}
                <Hl>covalent bonding</Hl> (electron sharing) typically happens between two nonmetals.
            </li>
            <li>Chemical formulae encode the exact ratio of atoms or ions needed so that charges balance or outer shells fill.</li>
            </ul>
            <Callout>
            Coming up in Unit 5: we zoom back out to <Hl>mixtures</Hl>, <Hl>physical and chemical changes</Hl>, and
            the <Hl>conservation of atoms</Hl> in chemical reactions.
            </Callout>
        </Section>
        </Note>
    );
    }