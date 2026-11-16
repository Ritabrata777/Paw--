// Pinned browser module; CSS product study remains visible if the CDN or WebGL is unavailable.
export async function mountCollar(element, progress, reduced, isCancelled) {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  if (isCancelled()) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0xf2ddbd, 1);
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.set(0, 0, 7.6);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb06b30, 3));
    const key = new THREE.DirectionalLight(0xffffff, 5); key.position.set(-3, 5, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffd5a2, 3); rim.position.set(4, -1, 2); scene.add(rim);
    const collar = new THREE.Group(); scene.add(collar);
    const orange = new THREE.MeshStandardMaterial({ color: 0xee692d, roughness: 0.62 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x292b26, roughness: 0.36, metalness: 0.28 });
    const cream = new THREE.MeshStandardMaterial({ color: 0xfff5db, roughness: 0.32 });
    const metal = new THREE.MeshStandardMaterial({ color: 0xd9d9cf, roughness: 0.22, metalness: 0.8 });
    const band = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.18, 16, 80), orange); band.scale.z = 2.3; collar.add(band);
    const tracker = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.48, 8, 24), dark);
    tracker.rotation.z = Math.PI / 2; tracker.position.set(0, -1.14, 0.35); tracker.scale.z = 0.6; collar.add(tracker);
    const face = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.39, 8, 24), cream);
    face.rotation.z = Math.PI / 2; face.position.set(0, -1.14, 0.56); face.scale.z = 0.16; collar.add(face);
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), dark);
    pad.position.set(0, -1.21, 0.63); pad.scale.set(1.3, 1, 0.2); collar.add(pad);
    for (let i = 0; i < 4; i++) {
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), dark);
      const angle = Math.PI * (0.12 + i * 0.25);
      toe.position.set(Math.cos(angle) * 0.15, -1.19 + Math.sin(angle) * 0.17, 0.63); toe.scale.z = 0.3; collar.add(toe);
    }
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: 0x7af5b0 })); led.position.set(0.43, -1.14, 0.64); collar.add(led);
    const buckle = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.055, 12, 4), metal); buckle.position.set(0.94, 0.84, 0.12); buckle.rotation.z = Math.PI / 4; collar.add(buckle);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 12, 32), metal); ring.position.set(0, -1.7, 0.28); collar.add(ring);
    let visible = true, frame = 0, pointerX = 0, pointerY = 0;
    const draw = (time = 0) => {
      if (!visible || document.hidden) { frame = 0; return; }
      const t = reduced ? 0 : time / 1000;
      const scroll = reduced ? 0 : progress.get();
      collar.rotation.set(0.35 + pointerY * 0.2, -0.4 + Math.sin(t * 0.45) * 0.22 + pointerX * 0.35 + scroll * 1.8, -0.35 + scroll * 0.4);
      collar.position.y = Math.sin(t * 1.2) * 0.07;
      renderer.render(scene, camera);
      frame = reduced ? 0 : requestAnimationFrame(draw);
    };
    const start = () => { if (!frame && visible && !document.hidden) draw(performance.now()); };
    const resize = () => { const { width, height } = element.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); if (reduced) start(); };
    const observer = new ResizeObserver(resize); observer.observe(element);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }); intersection.observe(element);
    const move = (event) => { if (reduced) return; const box = element.getBoundingClientRect(); pointerX = (event.clientX - box.left) / box.width - 0.5; pointerY = (event.clientY - box.top) / box.height - 0.5; };
    const reset = () => { pointerX = 0; pointerY = 0; };
    const contextLost = (event) => { event.preventDefault(); visible = false; renderer.domElement.style.display = 'none'; };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', reset); document.addEventListener('visibilitychange', start);
    resize(); start();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', start);
      element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      scene.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose()); } });
      renderer.dispose(); renderer.domElement.remove();
    };
}
