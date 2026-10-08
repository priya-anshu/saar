    "use client";

    import { useEffect, useRef, useState } from "react";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { Callout, Hl, Note, Section, type NoteColors } from "@/components/NoteKit";

    const colors: NoteColors = {
    light: ["#4338CA", "#0F766E", "#B45309", "#BE123C"],
    dark: ["#A5B4FC", "#5EEAD4", "#FCD34D", "#FDA4AF"],
    };

    type StateKey = "solid" | "liquid" | "gas";

    const STATE_COLORS: Record<StateKey, string> = {
    solid: colors.light[0],
    liquid: colors.light[1],
    gas: colors.light[2],
    };

    const STATE_CAPTIONS: Record<StateKey, string> = {
    solid: "Particles vibrate in place, holding a fixed shape and fixed volume.",
    liquid: "Particles stay close but slide past one another — fixed volume, no fixed shape.",
    gas: "Particles move freely and fill all the available space — no fixed shape or volume.",
    };

    const STATE_BUTTON_ACTIVE: Record<StateKey, string> = {
    solid: "rounded-lg border border-brand bg-brand px-4 py-1.5 text-sm font-semibold text-page",
    liquid: "rounded-lg border border-brand2 bg-brand2 px-4 py-1.5 text-sm font-semibold text-page",
    gas: "rounded-lg border border-brand3 bg-brand3 px-4 py-1.5 text-sm font-semibold text-page",
    };

    const STATE_BUTTON_IDLE = "rounded-lg border border-brand/40 bg-page px-4 py-1.5 text-sm text-fg";

    interface Particle {
    mesh: THREE.Mesh;
    home: THREE.Vector3;
    phase: number;
    wander: THREE.Vector3;
    vel: THREE.Vector3;
    }

    interface SimHandle {
    setState: (s: StateKey) => void;
    }

    function StateSimulator() {
    const mountRef = useRef<HTMLDivElement>(null);
    const simRef = useRef<SimHandle | null>(null);
    const [state, setState] = useState<StateKey>("solid");

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const half = 1.7;
        let current: StateKey = "solid";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(3.2, 2.4, 4.2);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.enableZoom = false;

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dLight.position.set(4, 6, 5);
        scene.add(dLight);

        const boxGeo = new THREE.BoxGeometry(half * 2, half * 2, half * 2);
        const edges = new THREE.EdgesGeometry(boxGeo);
        const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(colors.light[0]),
        transparent: true,
        opacity: 0.45,
        });
        scene.add(new THREE.LineSegments(edges, lineMat));

        const sphereGeo = new THREE.SphereGeometry(0.17, 16, 16);
        const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(STATE_COLORS.solid),
        roughness: 0.4,
        metalness: 0.1,
        });

        const particles: Particle[] = [];
        const side = 3;
        const spacing = 0.95;
        for (let x = 0; x < side; x++) {
        for (let y = 0; y < side; y++) {
            for (let z = 0; z < side; z++) {
            const mesh = new THREE.Mesh(sphereGeo, material);
            const home = new THREE.Vector3((x - 1) * spacing, (y - 1) * spacing, (z - 1) * spacing);
            mesh.position.copy(home);
            scene.add(mesh);
            particles.push({
                mesh,
                home,
                phase: Math.random() * Math.PI * 2,
                wander: new THREE.Vector3(0, 0, 0),
                vel: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
                ),
            });
            }
        }
        }

        simRef.current = {
        setState: (s: StateKey) => {
            current = s;
            material.color.set(STATE_COLORS[s]);
            if (s === "gas") {
            particles.forEach((p) => {
                p.vel.set(
                (Math.random() - 0.5) * 2.6,
                (Math.random() - 0.5) * 2.6,
                (Math.random() - 0.5) * 2.6
                );
            });
            }
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
        let frame = 0;
        const animate = () => {
        frame = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        particles.forEach((p) => {
            if (current === "solid") {
            const jitter = 0.05;
            p.mesh.position.set(
                p.home.x + Math.sin(t * 6 + p.phase) * jitter,
                p.home.y + Math.cos(t * 7 + p.phase * 1.3) * jitter,
                p.home.z + Math.sin(t * 5 + p.phase * 0.7) * jitter
            );
            } else if (current === "liquid") {
            p.wander.x += (Math.random() - 0.5) * 0.02;
            p.wander.y += (Math.random() - 0.5) * 0.02;
            p.wander.z += (Math.random() - 0.5) * 0.02;
            p.wander.clampLength(0, 0.55);
            p.mesh.position.set(
                p.home.x + p.wander.x,
                p.home.y + p.wander.y,
                p.home.z + p.wander.z
            );
            } else {
            p.mesh.position.addScaledVector(p.vel, dt);
            (["x", "y", "z"] as const).forEach((axis) => {
                if (p.mesh.position[axis] > half) {
                p.mesh.position[axis] = half;
                p.vel[axis] *= -1;
                }
                if (p.mesh.position[axis] < -half) {
                p.mesh.position[axis] = -half;
                p.vel[axis] *= -1;
                }
            });
            }
        });

        controls.update();
        renderer.render(scene, camera);
        };
        animate();

        return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        sphereGeo.dispose();
        boxGeo.dispose();
        edges.dispose();
        lineMat.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
            mount.removeChild(renderer.domElement);
        }
        simRef.current = null;
        };
    }, []);

    const choose = (s: StateKey) => {
        setState(s);
        simRef.current?.setState(s);
    };

    const states: StateKey[] = ["solid", "liquid", "gas"];

    return (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap justify-center gap-2">
            {states.map((s) => (
            <button
                key={s}
                type="button"
                aria-label={`Show particles of a ${s}`}
                aria-pressed={state === s}
                onClick={() => choose(s)}
                className={state === s ? STATE_BUTTON_ACTIVE[s] : STATE_BUTTON_IDLE}
            >
                {s === "solid" ? "Solid" : s === "liquid" ? "Liquid" : "Gas"}
            </button>
            ))}
        </div>
        <div
            ref={mountRef}
            aria-label="3D simulation of particles in a solid, liquid or gas. Drag to rotate."
            className="h-[340px] w-full overflow-hidden rounded-xl border border-line bg-tint"
        />
        <p className="mt-3 text-center text-sm font-medium text-brand2">{STATE_CAPTIONS[state]}</p>
        </div>
    );
    }

    export default function WhatIsMatterNote() {
    return (
        <Note
        title="What Is Matter? — From Observation to Particles"
        intro="Before we meet atoms, elements, or the periodic table, we need one habit of mind: whenever something happens that we can see, chemistry asks what is happening at a scale too small to see. This unit builds that habit — connecting the world we observe (called the macroscopic world, meaning large enough to see directly) to the world of particles (called the microscopic world, meaning too small to see without special tools)."
        colors={colors}
        >
        <Section title="1. Why Study Chemistry?">
            <p>
            <Hl>Chemistry</Hl> is the study of matter — what it is made of, how its particles are arranged, and why it
            behaves the way it does. Every topic in chemistry eventually answers one central question:
            </p>
            <Callout>
            “What is this thing made of, how are its particles arranged, and why does it behave this way?”
            </Callout>
            <p className="mt-3">
            Take a familiar example — <Hl>iron rusting</Hl>. Saying “iron reacts with oxygen” is true, but chemistry
            wants to go one level deeper:
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
                <p className="text-sm font-semibold text-brand2">Macroscopic (what we see)</p>
                <p className="mt-1 text-sm text-mute">A shiny iron nail slowly turns orange-brown and flaky.</p>
            </div>
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
                <p className="text-sm font-semibold text-brand">Microscopic (what is really happening)</p>
                <p className="mt-1 text-sm text-mute">
                Iron particles combine with oxygen particles from the air to form a new substance.
                </p>
            </div>
            </div>
        </Section>

        <Section title="2. What Is Matter?">
            <Callout>
            <Hl>Matter</Hl> is anything that has mass (the amount of material something contains) and occupies space
            (takes up room, also called having volume).
            </Callout>
            <p className="mt-3">
            Air, water, stone, wood, metal, and even your own body are all examples of matter. Light and sound are{" "}
            <Hl>not</Hl> matter — they don’t have mass or occupy space the way physical substances do.
            </p>
        </Section>

        <Section title="3. Mass, Volume and Density — the First Micro–Macro Link">
            <p>
            Three basic quantities describe any piece of matter: <Hl>mass</Hl>, <Hl>volume</Hl> (the amount of space
            it occupies), and <Hl>density</Hl> (how tightly packed its particles are, i.e. mass per unit volume).
            </p>
            <div className="mt-4 rounded-2xl border border-brand/30 bg-brand/5 p-5 text-center">
            <p className="text-sm font-semibold text-mute">Density formula</p>
            <p className="font-hand mt-2 text-3xl text-brand">ρ = m ÷ V</p>
            <p className="mt-2 text-xs text-mute">where ρ (rho) = density, m = mass, V = volume</p>
            </div>
            <Callout>
            Density is the <Hl>first clue</Hl> that microscopic structure explains macroscopic behaviour: a dense
            object like a steel ball has particles packed close together, while a light object like foam has particles
            (or air gaps) spread far apart — even if both are the same size.
            </Callout>
        </Section>

        <Section title="4. Interactive 3D Simulator: Solid, Liquid, Gas">
            <p>
            Every substance is made of particles that are constantly in motion. The <Hl>state of matter</Hl> — solid,
            liquid, or gas — depends only on how closely packed the particles are and how freely they can move. Click
            a button below, then drag inside the box to rotate your view.
            </p>
            <div className="mt-4">
            <StateSimulator />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-3 text-sm">
                <span className="mb-1 block font-semibold text-brand">Solid</span>
                Particles are packed tightly and only vibrate around a fixed spot.
            </div>
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-3 text-sm">
                <span className="mb-1 block font-semibold text-brand2">Liquid</span>
                Particles stay close but can slide past one another.
            </div>
            <div className="rounded-xl border border-brand3/30 bg-brand3/10 p-3 text-sm">
                <span className="mb-1 block font-semibold text-brand3">Gas</span>
                Particles are far apart and move freely in every direction.
            </div>
            </div>
        </Section>

        <Section title="5. Changes of State">
            <p>
            Matter can move between the three states when energy (usually heat) is added or removed, without becoming
            a different substance.
            </p>
            <div className="mt-4 overflow-x-auto">
            <div className="min-w-[420px] space-y-3 rounded-2xl border border-line bg-tint p-5">
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
                <span className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-brand">Solid</span>
                <span className="text-xs text-mute">melting →</span>
                <span className="rounded-lg border border-brand2/40 bg-brand2/10 px-3 py-1.5 text-brand2">Liquid</span>
                <span className="text-xs text-mute">evaporation / boiling →</span>
                <span className="rounded-lg border border-brand3/40 bg-brand3/10 px-3 py-1.5 text-brand3">Gas</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
                <span className="rounded-lg border border-brand3/40 bg-brand3/10 px-3 py-1.5 text-brand3">Gas</span>
                <span className="text-xs text-mute">← condensation</span>
                <span className="rounded-lg border border-brand2/40 bg-brand2/10 px-3 py-1.5 text-brand2">Liquid</span>
                <span className="text-xs text-mute">← freezing</span>
                <span className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-brand">Solid</span>
                </div>
                <p className="text-center text-xs text-mute">
                <span className="font-semibold text-brand4">Sublimation</span> is a direct jump from Solid straight to
                Gas, skipping the liquid stage (e.g. dry ice, or camphor).
                </p>
            </div>
            </div>
            <Callout>
            <Hl>Most important idea in this section:</Hl> changing state usually changes how particles are arranged
            and moving — it does <Hl>not</Hl> change what the particles themselves are. Ice, water, and steam are all
            still made of the same water particles.
            </Callout>
        </Section>

        <Section title="6. The Particle Model of Matter — Four Core Ideas">
            <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
                <p className="text-sm font-semibold text-brand">1. Matter is made of particles</p>
                <p className="mt-1 text-sm text-mute">
                Matter is not continuous — it is made of extremely small particles too tiny to see individually.
                </p>
            </div>
            <div className="rounded-xl border border-brand2/30 bg-brand2/10 p-4">
                <p className="text-sm font-semibold text-brand2">2. Particles are always moving</p>
                <p className="mt-1 text-sm text-mute">
                Especially in liquids and gases — and heating a substance makes its particles move faster.
                </p>
            </div>
            <div className="rounded-xl border border-brand3/30 bg-brand3/10 p-4">
                <p className="text-sm font-semibold text-brand3">3. There are spaces between particles</p>
                <p className="mt-1 text-sm text-mute">
                This explains why gases compress easily, why smells spread (diffusion), and why substances can
                dissolve into each other.
                </p>
            </div>
            <div className="rounded-xl border border-brand4/30 bg-brand4/10 p-4">
                <p className="text-sm font-semibold text-brand4">4. Particles attract one another</p>
                <p className="mt-1 text-sm text-mute">
                The strength of this attraction decides whether a substance behaves like a solid, liquid, or gas at
                room temperature.
                </p>
            </div>
            </div>
            <Callout>
            <Hl>Worked example — Why does sugar “disappear” in water?</Hl> Macroscopic observation: sugar seems to
            vanish when stirred into water. Microscopic explanation: sugar particles separate from each other and
            spread out between the water particles — they are still there, just too small and spread out to see.
            </Callout>
        </Section>

        <Section title="7. The Macro–Micro Mental Model">
            <p>
            This single chain of reasoning is the foundation for the rest of chemistry — keep coming back to it in
            every unit that follows.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2 text-center text-sm font-semibold">
            <div className="w-full rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-brand sm:w-auto">
                A macroscopic object (what you can see and touch)
            </div>
            <span className="text-mute" aria-hidden="true">↓</span>
            <div className="w-full rounded-lg border border-brand2/40 bg-brand2/10 px-4 py-2 text-brand2 sm:w-auto">
                A huge collection of particles
            </div>
            <span className="text-mute" aria-hidden="true">↓</span>
            <div className="w-full rounded-lg border border-brand3/40 bg-brand3/10 px-4 py-2 text-brand3 sm:w-auto">
                Particle arrangement + motion + attraction
            </div>
            <span className="text-mute" aria-hidden="true">↓</span>
            <div className="w-full rounded-lg border border-brand4/40 bg-brand4/10 px-4 py-2 text-brand4 sm:w-auto">
                The observed properties (shape, volume, density, behaviour)
            </div>
            </div>
        </Section>

        <Section title="8. Practice Questions">
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand">
            <li>Define matter and give three examples that are not listed in these notes.</li>
            <li>Explain, in terms of particles, why gases can be compressed easily but solids cannot.</li>
            <li>A block of wood has a mass of 350 g and a volume of 500 cm³. Calculate its density.</li>
            <li>
                Name the change of state in each case: (a) wet clothes drying in the sun (b) water vapour forming dew on
                a cold glass (c) dry ice turning into gas without melting.
            </li>
            <li>
                Explain why ice, water, and steam are considered the “same substance” even though they look completely
                different.
            </li>
            <li>
                Using the particle model, explain why perfume sprayed in one corner of a room can be smelled everywhere
                after some time.
            </li>
            </ol>
            <details className="mt-4 rounded-xl border border-line bg-tint p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand2">Show answer key</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mute">
                <li>
                Matter is anything with mass that occupies space — examples: cooking oil, a balloon full of air, a
                rubber ball.
                </li>
                <li>
                Gas particles are far apart with large empty spaces between them, so they can be pushed closer
                together; solid particles are already packed tightly with almost no space left to compress.
                </li>
                <li>Density = mass ÷ volume = 350 g ÷ 500 cm³ = 0.7 g/cm³</li>
                <li>(a) Evaporation (b) Condensation (c) Sublimation</li>
                <li>
                Because the identity of the particles themselves does not change during a change of state — only
                their arrangement and motion change.
                </li>
                <li>
                Gas particles from the perfume move freely and spread out in all directions (diffusion) until they
                mix throughout the air in the room.
                </li>
            </ol>
            </details>
        </Section>

        <Section title="9. Quick Revision Sheet">
            <ul className="list-disc space-y-3 pl-5 marker:text-brand4">
            <li>
                Chemistry always connects the <Hl>macroscopic</Hl> (what we see) to the <Hl>microscopic</Hl> (what
                particles are doing).
            </li>
            <li>
                <Hl>Matter</Hl> = anything with mass that occupies space.
            </li>
            <li>
                <Hl>Density = mass ÷ volume</Hl> — the first bridge between microscopic packing and a measurable
                macroscopic number.
            </li>
            <li>
                <Hl>Solid:</Hl> particles vibrate in fixed positions. <Hl>Liquid:</Hl> particles stay close but slide
                past each other. <Hl>Gas:</Hl> particles move freely, far apart.
            </li>
            <li>
                Changes of state (melting, freezing, evaporation, condensation, sublimation) rearrange particles — they
                do not change what the particles are.
            </li>
            <li>
                Four core particle ideas: particles exist, particles move, particles have space between them, particles
                attract each other.
            </li>
            </ul>
            <Callout>
            <Hl>Coming up in Unit 2:</Hl> we zoom inside a single particle itself — meeting the atom and its three
            fundamental building blocks: protons, neutrons, and electrons.
            </Callout>
        </Section>
        </Note>
    );
    }