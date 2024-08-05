// src/store/useStore.ts

import create from 'zustand';
import { Vector3 } from 'three';

interface GameState {
  playerPosition: Vector3;
  playerVelocity: Vector3;
  setPlayerPosition: (position: Vector3) => void;
  setPlayerVelocity: (velocity: Vector3) => void;
}

const useStore = create<GameState>((set) => ({
  playerPosition: new Vector3(0, 1, 0),
  playerVelocity: new Vector3(0, 0, 0),
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setPlayerVelocity: (velocity) => set({ playerVelocity: velocity }),
}));

export default useStore;
