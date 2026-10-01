"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Loader2, TriangleAlert } from "lucide-react";

type Status = "loading" | "ready" | "error";

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;

    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    const material = mesh.material;

    if (Array.isArray(material)) {
      for (const item of material) {
        item.dispose();
      }
    } else if (material) {
      material.dispose();
    }
  });
}

export default function ThreeViewer({
  src,
}: {
  src: string;
}) {
  const mount = useRef<HTMLDivElement>(null);

  const [status, setStatus] =
    useState<Status>("loading");

  useEffect(() => {
    const el = mount.current;

    if (!el) {
      return;
    }

    let loadedModel: THREE.Object3D | null = null;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(el.clientWidth, 1) /
        Math.max(el.clientHeight, 1),
      0.01,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2),
    );

    renderer.setSize(
      Math.max(el.clientWidth, 1),
      Math.max(el.clientHeight, 1),
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    el.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);

    const environment =
      pmrem.fromScene(
        new RoomEnvironment(),
        0.04,
      ).texture;

    scene.environment = environment;

    const controls = new OrbitControls(
      camera,
      renderer.domElement,
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enablePan = false;

    const loader = new GLTFLoader();

    loader.load(
      src,
      (gltf) => {
        loadedModel = gltf.scene;

        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);

        const center =
          box.getCenter(new THREE.Vector3());

        const sizeVector =
          box.getSize(new THREE.Vector3());

        const size = Math.max(
          sizeVector.length(),
          0.1,
        );

        model.position.sub(center);

        scene.add(model);

        camera.near = Math.max(size / 100, 0.001);
        camera.far = Math.max(size * 100, 100);

        camera.position.set(
          size * 0.4,
          size * 0.3,
          size * 0.9,
        );

        camera.updateProjectionMatrix();

        controls.maxDistance = size * 4;
        controls.minDistance = size * 0.2;
        controls.update();

        setStatus("ready");
      },
      undefined,
      () => {
        setStatus("error");
      },
    );

    const onResize = () => {
      const width = Math.max(
        el.clientWidth,
        1,
      );

      const height = Math.max(
        el.clientHeight,
        1,
      );

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
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

      if (loadedModel) {
        disposeObject(loadedModel);
        scene.remove(loadedModel);
      }

      environment.dispose();
      pmrem.dispose();

      renderer.dispose();

      if (
        renderer.domElement.parentNode === el
      ) {
        el.removeChild(
          renderer.domElement,
        );
      }
    };
  }, [src]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mount}
        className="h-full w-full"
      />

      {status === "loading" && (
        <div
          className="
            absolute inset-0
            grid place-items-center
            text-zinc-500
            dark:text-white/50
          "
        >
          <Loader2
            className="animate-spin"
            size={28}
          />
        </div>
      )}

      {status === "error" && (
        <div
          className="
            absolute inset-0
            flex flex-col
            items-center justify-center
            gap-2
            text-rose-600
            dark:text-rose-300
          "
        >
          <TriangleAlert size={28} />

          <p className="text-sm">
            Could not load this 3D model.
          </p>
        </div>
      )}
    </div>
  );
}