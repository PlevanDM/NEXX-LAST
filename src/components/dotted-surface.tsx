'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
	/** When true, size canvas to container instead of viewport (e.g. for Hero section). */
	contained?: boolean;
	/** 'dark' = light dots, 'light' = dark dots. Default dark for Hero. */
	theme?: 'dark' | 'light';
};

export function DottedSurface({ className, contained, theme: themeProp = 'dark', ...props }: DottedSurfaceProps) {
	const resolvedTheme = themeProp;

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	function getSize() {
		if (contained && containerRef.current) {
			const r = containerRef.current.getBoundingClientRect();
			return { w: r.width, h: r.height };
		}
		return { w: window.innerWidth, h: window.innerHeight };
	}

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const { w: rawW, h: rawH } = getSize();
		// При нулевых размерах ждём ResizeObserver и инициализируем тогда
		const initW = Math.max(rawW || 0, 1);
		const initH = Math.max(rawH || 0, 1);
		const isMobile = (rawW || window.innerWidth) < 768;

		// Меньше точек и ниже нагрузка на мобильных
		const AMOUNTX = isMobile ? 18 : 32;
		const AMOUNTY = isMobile ? 24 : 48;
		const SEPARATION = 150;

		// Медленнее и плавнее: меньший шаг фазы, меньшая амплитуда, мягче частота
		const phaseStep = isMobile ? 0.012 : 0.022;
		const amplitude = isMobile ? 28 : 38;
		const freqX = 0.18;
		const freqY = 0.25;

		// Scene setup
		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(
			60,
			initW / initH,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: !isMobile,
			powerPreference: isMobile ? 'low-power' : 'default',
		});
		renderer.setPixelRatio(isMobile ? Math.min(1.5, window.devicePixelRatio) : Math.min(2, window.devicePixelRatio));
		renderer.setSize(initW, initH);
		renderer.setClearColor(scene.fog.color, 0);

		const canvas = renderer.domElement;
		canvas.style.display = 'block';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.maxWidth = '100%';
		canvas.style.maxHeight = '100%';
		if (!containerRef.current) return;
		containerRef.current.appendChild(canvas);

		const positions: number[] = [];
		const colors: number[] = [];

		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0;
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				if (resolvedTheme === 'dark') {
					colors.push(200, 200, 200);
				} else {
					colors.push(0, 0, 0);
				}
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: isMobile ? 10 : 8,
			vertexColors: true,
			transparent: true,
			opacity: 0.75,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number;
		const targetFps = isMobile ? 30 : 60;
		const minFrameTime = 1000 / targetFps;
		let lastRenderTime = 0;

		const animate = (now: number) => {
			animationId = requestAnimationFrame(animate);

			// Ограничение FPS на мобильных для экономии батареи и нагрузки
			if (isMobile && now - lastRenderTime < minFrameTime) return;
			lastRenderTime = now;

			const positionAttribute = geometry.attributes.position;
			const posArray = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;
					posArray[index + 1] =
						Math.sin((ix + count) * freqX) * amplitude +
						Math.sin((iy + count) * freqY) * amplitude;
					i++;
				}
			}

			positionAttribute.needsUpdate = true;
			renderer.render(scene, camera);
			count += phaseStep;
		};

		// Handle window resize (or container resize when contained)
		const handleResize = () => {
			const { w: rawW, h: rawH } = getSize();
			const w = Math.max(rawW || 0, 1);
			const h = Math.max(rawH || 0, 1);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};

		window.addEventListener('resize', handleResize);

		let resizeObserver: ResizeObserver | undefined;
		if (contained && containerRef.current) {
			resizeObserver = new ResizeObserver(handleResize);
			resizeObserver.observe(containerRef.current);
		}

		// Start animation (requestAnimationFrame passes timestamp)
		animationId = requestAnimationFrame(animate);

		// Когда contained — контейнер мог быть 0×0 при первом рендере; подхватить размер на следующем кадре
		if (contained) {
			const rafId = requestAnimationFrame(() => {
				handleResize();
			});
			// очистка raf в return не нужна — одноразовый вызов
		}

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);
			resizeObserver?.disconnect();

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [resolvedTheme, contained]);

	return (
		<div
			ref={containerRef}
			className={cn(
				'pointer-events-none',
				contained ? 'absolute inset-0 z-0' : 'fixed inset-0 -z-1',
				className,
			)}
			{...props}
		/>
	);
}
