    "use client";

    import { useEffect, useRef, useState } from "react";
    import * as THREE from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
    import { Loader2, TriangleAlert } from "lucide-react";

    export default function ThreeViewer({ src }: { src: string }) {
    const mount = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        const el = mount.current!;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.01, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(el.clientWidth, el.clientHeight);
        el.appendChild(renderer.domElement);

        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.2;

        new GLTFLoader().load(
        src,
        (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3()).length();
            model.position.sub(box.getCenter(new THREE.Vector3()));
            scene.add(model);

            camera.near = size / 100;
            camera.far = size * 100;
            camera.position.set(size * 0.4, size * 0.3, size * 0.9);
            camera.updateProjectionMatrix();
            controls.maxDistance = size * 4;
            controls.update();
            setStatus("ready");
        },
        undefined,
        () => setStatus("error")
        );

        const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
        };
        const observer = new ResizeObserver(onResize);
        observer.observe(el);

        renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
        });

        return () => {
        observer.disconnect();
        renderer.setAnimationLoop(null);
        controls.dispose();
        pmrem.dispose();
        renderer.dispose();
        el.removeChild(renderer.domElement);
        };
    }, [src]);

    return (
        <div className="relative h-full w-full">
        <div ref={mount} className="h-full w-full" />
        {status === "loading" && (
            <div className="absolute inset-0 grid place-items-center text-white/60">
            <Loader2 className="animate-spin" size={28} />
            </div>
        )}
        {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-rose-300">
            <TriangleAlert size={28} />
            <p className="text-sm">Could not load this 3D model.</p>
            </div>
        )}
        </div>
    );
    }