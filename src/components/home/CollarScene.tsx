'use client';
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, type MotionValue } from 'framer-motion';
import { PawPrint } from 'lucide-react';

type SceneModule = { mountCollar: (element: HTMLElement, progress: MotionValue<number>, reduced: boolean, isCancelled: () => boolean) => Promise<(() => void) | undefined> };
export default function CollarScene({ progress }: { progress: MotionValue<number> }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const moduleUrl = '/collar-scene.mjs';
    // Native import keeps the optional Three.js download out of the initial bundle.
    import(/* webpackIgnore: true */ moduleUrl).then(async (scene: SceneModule) => {
      if (cancelled) return;
      const cleanup = await scene.mountCollar(element, progress, Boolean(reduced), () => cancelled);
      if (cancelled) cleanup?.(); else dispose = cleanup;
    }).catch(() => { /* The CSS collar is the intentional offline/WebGL fallback. */ });
    return () => { cancelled = true; dispose?.(); };
  }, [progress, reduced]);
  return <div ref={host} className="collar-canvas" role="img" aria-label="Three-dimensional orange Pawtrace collar concept"><motion.div className="css-collar" animate={reduced ? undefined : { rotateY: [-22, 22, -22], rotateZ: [-20, -12, -20] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}><div className="css-collar-band" /><div className="css-collar-tracker"><PawPrint size={22} /><i /></div><div className="css-collar-ring" /></motion.div></div>;
}
