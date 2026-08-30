"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SoundOptions {
  volume?: number;
  rate?: number;
  loop?: boolean;
}

interface AudioContextState {
  context: AudioContext | null;
  masterGain: GainNode | null;
  enabled: boolean;
  muted: boolean;
}

// Global audio context singleton
const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!(window as any).__AUDIO_CONTEXT__) {
    (window as any).__AUDIO_CONTEXT__ = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__AUDIO_CONTEXT__;
};

// Sound generator functions
const generateTone = (
  context: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  envelope: { attack: number; decay: number; sustain: number; release: number } = { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  
  const now = context.currentTime;
  const attackEnd = now + envelope.attack;
  const decayEnd = attackEnd + envelope.decay;
  const sustainEnd = decayEnd + envelope.sustain;
  const releaseEnd = sustainEnd + envelope.release;
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, attackEnd);
  gain.gain.linearRampToValueAtTime(0.3, decayEnd);
  gain.gain.setValueAtTime(0.3, sustainEnd);
  gain.gain.linearRampToValueAtTime(0, releaseEnd);
  
  oscillator.connect(gain);
  oscillator.start(now);
  oscillator.stop(releaseEnd);
  
  return { oscillator, gain, duration: releaseEnd - now };
};

const generateNoise = (
  context: AudioContext,
  duration: number,
  type: "white" | "pink" | "brown" = "white"
) => {
  const bufferSize = context.sampleRate * duration;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    if (type === "white") {
      data[i] = Math.random() * 2 - 1;
    } else if (type === "pink") {
      // Simple pink noise approximation
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    } else {
      // Brown noise
      data[i] = (Math.random() * 2 - 1) * Math.sqrt(1 - i / bufferSize);
    }
  }
  
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  
  const now = context.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + 0.01);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  
  source.connect(gain);
  source.start(now);
  source.stop(now + duration);
  
  return { source, gain };
};

// Sound library
export const SOUNDS = {
  click: (context: AudioContext) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(800, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    osc.connect(gain);
    osc.start();
    osc.stop(context.currentTime + 0.1);
    return { osc, gain };
  },
  
  hover: (context: AudioContext) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, context.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    osc.connect(gain);
    osc.start();
    osc.stop(context.currentTime + 0.1);
    return { osc, gain };
  },
  
  success: (context: AudioContext) => {
    const nodes: (AudioNode | null)[] = [];
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const time = context.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      osc.connect(gain);
      osc.start(time);
      osc.stop(time + 0.3);
      nodes.push(osc, gain);
    });
    return { nodes };
  },
  
  error: (context: AudioContext) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, context.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    osc.connect(gain);
    osc.start();
    osc.stop(context.currentTime + 0.3);
    return { osc, gain };
  },
  
  whoosh: (context: AudioContext) => {
    const noise = generateNoise(context, 0.3, "pink");
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2000, context.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.3);
    filter.Q.value = 10;
    noise.gain.connect(filter);
    filter.connect(context.destination);
    return { ...noise, filter };
  },
  
  pop: (context: AudioContext) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);
    osc.connect(gain);
    osc.start();
    osc.stop(context.currentTime + 0.05);
    return { osc, gain };
  },
  
  ambient: (context: AudioContext) => {
    // Create evolving pad
    const osc1 = context.createOscillator();
    const osc2 = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    
    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.value = 110; // A2
    osc2.frequency.value = 220; // A3
    
    filter.type = "lowpass";
    filter.frequency.value = 800;
    filter.Q.value = 2;
    
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, context.currentTime + 2);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    
    osc1.start();
    osc2.start();
    
    // Slow modulation
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    
    return { osc1, osc2, gain, filter, lfo };
  }
};

// Sound manager hook
export function useSound() {
  const [enabled, setEnabled] = useState(true);
  const [muted, setMuted] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const initAudio = async () => {
      if (initializedRef.current) return;
      
      const context = getAudioContext();
      if (!context) return;
      
      contextRef.current = context;
      
      // Create master gain
      const masterGain = context.createGain();
      masterGain.gain.value = 0.5;
      masterGain.connect(context.destination);
      masterGainRef.current = masterGain;
      
      // Resume context on user interaction
      const resume = () => {
        if (context.state === "suspended") {
          context.resume();
        }
        document.removeEventListener("click", resume);
        document.removeEventListener("keydown", resume);
      };
      
      document.addEventListener("click", resume);
      document.addEventListener("keydown", resume);
      
      initializedRef.current = true;
    };
    
    initAudio();
    
    return () => {
      // Don't close context as it's shared
    };
  }, []);

  const play = useCallback((soundName: keyof typeof SOUNDS, options: SoundOptions = {}) => {
    if (!enabled || muted) return;
    
    const context = contextRef.current;
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;
    
    const sound = SOUNDS[soundName];
    if (!sound) return;
    
    const result = sound(context);
    
    // Connect to master gain
    Object.values(result).forEach(node => {
      if (node && "connect" in node) {
        try {
          node.connect(masterGain);
        } catch (e) {
          // Already connected
        }
      }
    });
    
    return result;
  }, [enabled, muted]);

  const setVolume = useCallback((volume: number) => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, volume)),
        getAudioContext()?.currentTime || 0
      );
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      if (masterGainRef.current) {
        masterGainRef.current.gain.linearRampToValueAtTime(
          next ? 0 : 0.5,
          getAudioContext()?.currentTime || 0
        );
      }
      return next;
    });
  }, []);

  return { play, setVolume, toggleMute, enabled, muted, setEnabled };
}

// Ambient soundscape
export function useAmbientSound(enabled: boolean = true) {
  const ambientRef = useRef<{
    osc1: OscillatorNode | null;
    osc2: OscillatorNode | null;
    gain: GainNode | null;
    filter: BiquadFilterNode | null;
    lfo: OscillatorNode | null;
    lfoGain: GainNode | null;
  }>({ osc1: null, osc2: null, gain: null, filter: null, lfo: null, lfoGain: null });

  useEffect(() => {
    if (!enabled) return;
    
    const context = getAudioContext();
    if (!context) return;
    
    const masterGain = context.createGain();
    masterGain.gain.value = 0.02;
    masterGain.connect(context.destination);
    
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    filter.Q.value = 2;
    filter.connect(masterGain);
    
    const osc1 = context.createOscillator();
    const osc2 = context.createOscillator();
    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.value = 110;
    osc2.frequency.value = 220;
    osc1.connect(filter);
    osc2.connect(filter);
    
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    osc1.start();
    osc2.start();
    lfo.start();
    
    ambientRef.current = { osc1, osc2, gain: masterGain, filter, lfo, lfoGain };
    
    // Fade in
    masterGain.gain.setValueAtTime(0, context.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.02, context.currentTime + 5);
    
    return () => {
      // Fade out
      masterGain.gain.linearRampToValueAtTime(0, context.currentTime + 2);
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        lfo.stop();
        masterGain.disconnect();
      }, 2000);
    };
  }, [enabled]);
}

// Sound-enabled magnetic cursor
export function useMagneticSound() {
  const { play } = useSound();
  
  const onEnter = useCallback(() => {
    play("hover");
  }, [play]);
  
  const onClick = useCallback(() => {
    play("click");
  }, [play]);
  
  return { onEnter, onClick };
}

// Page transition sounds
export function usePageTransitionSounds() {
  const { play } = useSound();
  
  const onLeave = useCallback(() => {
    play("whoosh");
  }, [play]);
  
  const onEnter = useCallback(() => {
    play("pop");
  }, [play]);
  
  return { onLeave, onEnter };
}

// Form validation sounds
export function useFormSounds() {
  const { play } = useSound();
  
  const onSuccess = useCallback(() => {
    play("success");
  }, [play]);
  
  const onError = useCallback(() => {
    play("error");
  }, [play]);
  
  return { onSuccess, onError };
}

// Scroll sound (subtle)
export function useScrollSound(threshold = 100) {
  const { play } = useSound();
  const lastScrollRef = useRef(0);
  const accumulatedRef = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = Math.abs(scrollY - lastScrollRef.current);
      accumulatedRef.current += delta;
      lastScrollRef.current = scrollY;
      
      if (accumulatedRef.current >= threshold) {
        accumulatedRef.current = 0;
        play("click", { volume: 0.1 });
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [play, threshold]);
}