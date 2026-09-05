import * as THREE from 'three';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Vector3, CameraState, NavigationMode, SpatialOSConfig, DEFAULT_SPATIAL_CONFIG } from './types';
import { useRegionRegistry } from './RegionRegistry';

interface CameraControllerState {
  // Camera state
  camera: THREE.PerspectiveCamera | null;
  state: CameraState;
  targetState: CameraState;
  
  // Navigation state
  navigationMode: NavigationMode;
  isAnimating: boolean;
  animationStartTime: number;
  animationDuration: number;
  
  // Input state
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
  lastDragPosition: { x: number; y: number };
  
  // Touch state for mobile
  touches: Map<number, { x: number; y: number }>;
  pinchDistance: number;
  
  // Minimap
  minimapCamera: THREE.OrthographicCamera | null;
  showMinimap: boolean;
  
  // Actions
  initialize: (canvas: HTMLCanvasElement, config?: Partial<any>) => void;
  setCamera: (camera: THREE.PerspectiveCamera) => void;
  setTargetState: (state: Partial<CameraState>, options?: { duration?: number; easing?: string }) => void;
  animateToRegion: (regionId: string, options?: { duration?: number; easing?: string }) => Promise<void>;
  setNavigationMode: (mode: NavigationMode['type'], active: boolean) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseUp: (event: MouseEvent) => void;
  handleWheel: (event: WheelEvent) => void;
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchMove: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  update: (deltaTime: number) => void;
  resize: (width: number, height: number) => void;
  setShowMinimap: (show: boolean) => void;
  getWorldPositionFromScreen: (x: number, y: number) => THREE.Vector3 | null;
  raycast: (x: number, y: number) => THREE.Intersection[] | null;
}

const createDefaultCameraState = (): CameraState => ({
  position: { x: 0, y: 5, z: 20 },
  target: { x: 0, y: 0, z: 0 },
  zoom: 1,
  mode: 'fly',
});

const createDefaultNavigationMode = (): NavigationMode => ({
  type: 'fly',
  active: false,
});

export const useCameraController = create<CameraControllerState>()(
  subscribeWithSelector((set, get) => ({
    camera: null,
    state: createDefaultCameraState(),
    targetState: createDefaultCameraState(),
    navigationMode: createDefaultNavigationMode(),
    isAnimating: false,
    animationStartTime: 0,
    animationDuration: 1500,
    mousePosition: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    lastDragPosition: { x: 0, y: 0 },
    touches: new Map(),
    pinchDistance: 0,
    minimapCamera: null,
    showMinimap: false,

    initialize: (canvas: HTMLCanvasElement, config?: any) => {
      const camera = new THREE.PerspectiveCamera(
        60,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
      );
      
      const defaultState = createDefaultCameraState();
      camera.position.set(defaultState.position.x, defaultState.position.y, defaultState.position.z);
      camera.lookAt(defaultState.target.x, defaultState.target.y, defaultState.target.z);
      
      // Create minimap camera
      const minimapCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 1000);
      minimapCamera.position.set(0, 100, 0);
      minimapCamera.lookAt(0, 0, 0);
      minimapCamera.up.set(0, 0, -1);
      
      set({
        camera,
        state: defaultState,
        targetState: defaultState,
        minimapCamera,
      });
      
      // Set up event listeners
      canvas.addEventListener('mousemove', get().handleMouseMove);
      canvas.addEventListener('mousedown', get().handleMouseDown);
      canvas.addEventListener('mouseup', get().handleMouseUp);
      canvas.addEventListener('wheel', get().handleWheel, { passive: false });
      canvas.addEventListener('touchstart', get().handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', get().handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', get().handleTouchEnd);
      window.addEventListener('keydown', get().handleKeyDown);
      window.addEventListener('keyup', get().handleKeyUp);
      window.addEventListener('resize', () => get().resize(canvas.clientWidth, canvas.clientHeight));
    },

    setCamera: (camera: THREE.PerspectiveCamera) => {
      set({ camera });
    },

    setTargetState: (state: Partial<CameraState>, options?: { duration?: number; easing?: string }) => {
      const currentState = get().state;
      const newTargetState = { ...currentState, ...state };
      
      set({
        targetState: newTargetState,
        isAnimating: true,
        animationStartTime: Date.now(),
        animationDuration: options?.duration || 1500,
      });
    },

    animateToRegion: async (regionId: string, options?: { duration?: number; easing?: string }) => {
      const { regions } = useRegionRegistry.getState();
      const region = regions.get(regionId);
      if (!region) {
        console.warn(`Region ${regionId} not found`);
        return;
      }

      const targetState: CameraState = {
        position: region.cameraPosition,
        target: region.cameraTarget,
        zoom: 1,
        mode: 'fly',
      };

      get().setTargetState(targetState, { duration: options?.duration || 1500 });
      
      // Wait for animation to complete
      return new Promise((resolve) => {
        const checkAnimation = () => {
          if (!get().isAnimating) {
            resolve();
          } else {
            setTimeout(checkAnimation, 16);
          }
        };
        checkAnimation();
      });
    },

    setNavigationMode: (type: NavigationMode['type'], active: boolean) => {
      set((state) => ({
        navigationMode: { ...state.navigationMode, type, active },
      }));
    },

    handleMouseMove: (event: MouseEvent) => {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      set({ mousePosition: { x, y } });
      
      if (get().isDragging) {
        const dx = x - get().lastDragPosition.x;
        const dy = y - get().lastDragPosition.y;
        
        const { navigationMode, state, camera } = get();
        
        if (navigationMode.type === 'pan' && navigationMode.active) {
          // Pan camera
          const panSpeed = 0.01 * state.zoom;
          const right = new THREE.Vector3().crossVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3().subVectors(
              new THREE.Vector3(state.target.x, state.target.y, state.target.z),
              new THREE.Vector3(state.position.x, state.position.y, state.position.z)
            ).normalize()
          ).normalize();
          
          const up = new THREE.Vector3(0, 1, 0);
          
          const newPosition = new THREE.Vector3(state.position.x, state.position.y, state.position.z)
            .addScaledVector(right, -dx * panSpeed)
            .addScaledVector(up, dy * panSpeed);
          
          const newTarget = new THREE.Vector3(state.target.x, state.target.y, state.target.z)
            .addScaledVector(right, -dx * panSpeed)
            .addScaledVector(up, dy * panSpeed);
          
          set({
            state: {
              ...state,
              position: { x: newPosition.x, y: newPosition.y, z: newPosition.z },
              target: { x: newTarget.x, y: newTarget.y, z: newTarget.z },
            },
          });
        } else if (navigationMode.type === 'orbit' && navigationMode.active) {
          // Orbit around target
          const spherical = new THREE.Spherical();
          const offset = new THREE.Vector3(
            state.position.x - state.target.x,
            state.position.y - state.target.y,
            state.position.z - state.target.z
          );
          spherical.setFromVector3(offset);
          
          spherical.theta -= dx * 0.01;
          spherical.phi += dy * 0.01;
          spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
          
          const newOffset = new THREE.Vector3().setFromSpherical(spherical);
          const newPosition = new THREE.Vector3(state.target.x, state.target.y, state.target.z).add(newOffset);
          
          set({
            state: {
              ...state,
              position: { x: newPosition.x, y: newPosition.y, z: newPosition.z },
            },
          });
        }
        
        set({ lastDragPosition: { x, y } });
      }
    },

    handleMouseDown: (event: MouseEvent) => {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      set({
        isDragging: true,
        dragStart: { x, y },
        lastDragPosition: { x, y },
      });
    },

    handleMouseUp: (event: MouseEvent) => {
      set({ isDragging: false });
    },

    handleWheel: (event: WheelEvent) => {
      event.preventDefault();
      
      const { state, camera } = get();
      const zoomSpeed = 0.1;
      const newZoom = Math.max(0.1, Math.min(5, state.zoom - event.deltaY * zoomSpeed * 0.01));
      
      // Zoom by moving camera closer/further from target
      const direction = new THREE.Vector3(
        state.target.x - state.position.x,
        state.target.y - state.position.y,
        state.target.z - state.position.z
      ).normalize();
      
      const distance = Math.sqrt(
        Math.pow(state.position.x - state.target.x, 2) +
        Math.pow(state.position.y - state.target.y, 2) +
        Math.pow(state.position.z - state.target.z, 2)
      );
      
      const newDistance = distance * (state.zoom / newZoom);
      
      const newPosition = {
        x: state.target.x - direction.x * newDistance,
        y: state.target.y - direction.y * newDistance,
        z: state.target.z - direction.z * newDistance,
      };
      
      set({
        state: {
          ...state,
          zoom: newZoom,
          position: newPosition,
        },
      });
    },

    handleTouchStart: (event: TouchEvent) => {
      event.preventDefault();
      
      const touches = new Map<number, { x: number; y: number }>();
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        touches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
      }
      
      set({ touches });
      
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        set({ pinchDistance: distance });
      }
    },

    handleTouchMove: (event: TouchEvent) => {
      event.preventDefault();
      
      const touches = new Map<number, { x: number; y: number }>();
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        touches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
      }
      
      const prevTouches = get().touches;
      
      if (event.touches.length === 1 && prevTouches.size === 1) {
        // Single touch - pan
        const touch = event.touches[0];
        const prevTouch = prevTouches.values().next().value;
        
        if (prevTouch) {
          const dx = touch.clientX - prevTouch.x;
          const dy = touch.clientY - prevTouch.y;
          
          const { state } = get();
          const panSpeed = 0.01 * state.zoom;
          
          const newTarget = {
            x: state.target.x - dx * panSpeed,
            y: state.target.y - dy * panSpeed,
            z: state.target.z,
          };
          
          const newPosition = {
            x: state.position.x - dx * panSpeed,
            y: state.position.y - dy * panSpeed,
            z: state.position.z,
          };
          
          set({
            state: { ...state, target: newTarget, position: newPosition },
          });
        }
      } else if (event.touches.length === 2) {
        // Pinch zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const prevDistance = get().pinchDistance;
        if (prevDistance > 0) {
          const zoomFactor = distance / prevDistance;
          const { state } = get();
          const newZoom = Math.max(0.1, Math.min(5, state.zoom * zoomFactor));
          
          const direction = new THREE.Vector3(
            state.target.x - state.position.x,
            state.target.y - state.position.y,
            state.target.z - state.position.z
          ).normalize();
          
          const currentDistance = Math.sqrt(
            Math.pow(state.position.x - state.target.x, 2) +
            Math.pow(state.position.y - state.target.y, 2) +
            Math.pow(state.position.z - state.target.z, 2)
          );
          
          const newDist = currentDistance * (state.zoom / newZoom);
          
          const newPosition = {
            x: state.target.x - direction.x * newDist,
            y: state.target.y - direction.y * newDist,
            z: state.target.z - direction.z * newDist,
          };
          
          set({
            state: { ...state, zoom: newZoom, position: newPosition },
            pinchDistance: distance,
          });
        } else {
          set({ pinchDistance: distance });
        }
      }
      
      set({ touches });
    },

    handleTouchEnd: (event: TouchEvent) => {
      const touches = new Map<number, { x: number; y: number }>();
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        touches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
      }
      set({ touches, pinchDistance: 0 });
    },

    handleKeyDown: (event: KeyboardEvent) => {
      // Handle keyboard navigation
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          get().setNavigationMode('pan', true);
          break;
        case 'KeyS':
        case 'ArrowDown':
          get().setNavigationMode('pan', true);
          break;
        case 'KeyA':
        case 'ArrowLeft':
          get().setNavigationMode('pan', true);
          break;
        case 'KeyD':
        case 'ArrowRight':
          get().setNavigationMode('pan', true);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          get().setNavigationMode('focus', true);
          break;
        case 'ControlLeft':
        case 'ControlRight':
          get().setNavigationMode('zoom', true);
          break;
      }
    },

    handleKeyUp: (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'KeyS':
        case 'KeyA':
        case 'KeyD':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          get().setNavigationMode('pan', false);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          get().setNavigationMode('focus', false);
          break;
        case 'ControlLeft':
        case 'ControlRight':
          get().setNavigationMode('zoom', false);
          break;
      }
    },

    update: (deltaTime: number) => {
      const { state, targetState, isAnimating, animationStartTime, animationDuration, camera } = get();
      
      if (isAnimating) {
        const elapsed = Date.now() - animationStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        // Interpolate position
        const newPosition = {
          x: state.position.x + (targetState.position.x - state.position.x) * eased,
          y: state.position.y + (targetState.position.y - state.position.y) * eased,
          z: state.position.z + (targetState.position.z - state.position.z) * eased,
        };
        
        // Interpolate target
        const newTarget = {
          x: state.target.x + (targetState.target.x - state.target.x) * eased,
          y: state.target.y + (targetState.target.y - state.target.y) * eased,
          z: state.target.z + (targetState.target.z - state.target.z) * eased,
        };
        
        // Interpolate zoom
        const newZoom = state.zoom + (targetState.zoom - state.zoom) * eased;
        
        set({
          state: {
            ...state,
            position: newPosition,
            target: newTarget,
            zoom: newZoom,
          },
        });
        
        if (progress >= 1) {
          set({ isAnimating: false });
        }
      }
      
      // Update camera
      if (camera) {
        const { state } = get();
        camera.position.set(state.position.x, state.position.y, state.position.z);
        camera.lookAt(state.target.x, state.target.y, state.target.z);
      }
    },

    resize: (width: number, height: number) => {
      const { camera, minimapCamera } = get();
      
      if (camera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      
      if (minimapCamera) {
        const size = Math.min(width, height) * 0.15;
        minimapCamera.left = -size;
        minimapCamera.right = size;
        minimapCamera.top = size;
        minimapCamera.bottom = -size;
        minimapCamera.updateProjectionMatrix();
      }
    },

    setShowMinimap: (show: boolean) => {
      set({ showMinimap: show });
    },

    getWorldPositionFromScreen: (x: number, y: number) => {
      const { camera, mousePosition } = get();
      if (!camera) return null;
      
      const rect = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      const ndcX = ((x - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((y - rect.top) / rect.height) * 2 + 1;
      
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), get().camera!);
      
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      ray.ray.intersectPlane(plane, intersection);
      
      return intersection;
    },

    raycast: (x: number, y: number) => {
      const { camera } = get();
      if (!camera) return null;
      
      const rect = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      const ndcX = ((x - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((y - rect.top) / rect.height) * 2 + 1;
      
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      
      // Get all objects in scene (would need scene reference)
      return [];
    },
  }))
);

export const cameraController = useCameraController.getState();