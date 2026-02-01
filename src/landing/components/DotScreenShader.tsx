import React, { useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTrailTexture } from '@react-three/drei'
import * as THREE from 'three'

// Заглушка: 1x1 текстура, чтобы шейдер не падал при null mouseTrail
const dummyTexture = (() => {
  const tex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1)
  tex.needsUpdate = true
  return tex
})()

const DotMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    dotColor: new THREE.Color('#FFFFFF'),
    bgColor: new THREE.Color('#0f172a'),
    mouseTrail: dummyTexture,
    render: 0,
    rotation: 0,
    gridSize: 50,
    dotOpacity: 0.05
  },
  /* glsl */ `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform int render;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform float rotation;
    uniform float gridSize;
    uniform float dotOpacity;

    vec2 rotate(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotationMatrix = mat2(c, -s, s, c);
        return rotationMatrix * (uv - 0.5) + 0.5;
    }

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 rotatedUv = rotate(uv, rotation);

      vec2 gridUv = fract(rotatedUv * gridSize);
      vec2 gridUvCenterInScreenCoords = rotate((floor(rotatedUv * gridSize) + 0.5) / gridSize, -rotation);

      float baseDot = sdfCircle(gridUv, 0.25);

      float screenMask = smoothstep(0.0, 1.0, 1.0 - uv.y);
      vec2 centerDisplace = vec2(0.7, 1.1);
      float circleMaskCenter = length(uv - centerDisplace);
      float circleMaskFromCenter = smoothstep(0.5, 1.0, circleMaskCenter);

      float combinedMask = screenMask * circleMaskFromCenter;
      float circleAnimatedMask = sin(time * 2.0 + circleMaskCenter * 10.0);

      float mouseInfluence = texture2D(mouseTrail, clamp(gridUvCenterInScreenCoords, 0.0, 1.0)).r;

      float scaleInfluence = max(mouseInfluence * 0.5, circleAnimatedMask * 0.3);

      float dotSize = min(pow(circleMaskCenter, 2.0) * 0.3, 0.3);

      float sdfDot = sdfCircle(gridUv, dotSize * (1.0 + scaleInfluence * 0.5));

      float smoothDot = smoothstep(0.05, 0.0, sdfDot);

      float opacityInfluence = max(mouseInfluence * 50.0, circleAnimatedMask * 0.5);

      vec3 composition = mix(bgColor, dotColor, smoothDot * combinedMask * dotOpacity * (1.0 + opacityInfluence));

      gl_FragColor = vec4(composition, 1.0);
    }
  `
)

function Scene() {
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)
  const rotation = 0
  const gridSize = 100

  const themeColors = useMemo(() => ({
    dotColor: '#FFFFFF',
    bgColor: '#0f172a',
    dotOpacity: 0.04
  }), [])

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.1,
    maxAge: 400,
    interpolate: 1,
    ease: (x: number) =>
      x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
  })

  const dotMaterial = useMemo(() => new (DotMaterial as any)(), [])

  useEffect(() => {
    const u = dotMaterial.uniforms
    if (u.dotColor?.value) u.dotColor.value.setStyle(themeColors.dotColor)
    if (u.bgColor?.value) u.bgColor.value.setStyle(themeColors.bgColor)
    if (u.dotOpacity?.value !== undefined) u.dotOpacity.value = themeColors.dotOpacity
  }, [dotMaterial, themeColors])

  useFrame((state) => {
    const u = dotMaterial.uniforms
    if (!u) return
    if (u.time?.value !== undefined) u.time.value = state.clock.elapsedTime
    if (u.resolution?.value) {
      const w = Math.max(1, size.width * viewport.dpr)
      const h = Math.max(1, size.height * viewport.dpr)
      u.resolution.value.set(w, h)
    }
    if (u.rotation?.value !== undefined) u.rotation.value = rotation
    if (u.gridSize?.value !== undefined) u.gridSize.value = gridSize
    if (u.mouseTrail && trail) u.mouseTrail.value = trail
    if (u.render?.value !== undefined) u.render.value = 0
  })

  const handlePointerMove = (e: any) => {
    onMove(e)
  }

  const scale = Math.max(viewport.width, viewport.height) / 2

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={handlePointerMove}>
      <planeGeometry args={[2, 2]} />
      <primitive object={dotMaterial} attach="material" />
    </mesh>
  )
}

export const DotScreenShader: React.FC = () => {
  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
        stencil: false,
        depth: false
      }}
      camera={{ position: [0, 0, 1], fov: 75 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }}
      dpr={[1, 1.5]}
      frameloop="always"
    >
      <Scene />
    </Canvas>
  )
}
