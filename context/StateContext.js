'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PILOT_STATE } from '../lib/i18n';

const StateContext = createContext(null);
const STATE_KEY = 'ration_saathi_state';
const STATE_SELECTED_KEY = 'ration_saathi_state_selected';

export function StateProvider({ children }) {
  const [state, setStateValue] = useState(PILOT_STATE);
  const [hasSelected, setHasSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedState = window.localStorage.getItem(STATE_KEY);
    const savedSelected = window.localStorage.getItem(STATE_SELECTED_KEY);
    if (savedState) setStateValue(savedState);
    if (savedSelected === 'true') setHasSelected(true);
  }, []);

  const selectState = (name) => {
    setStateValue(name);
    setHasSelected(true);
    window.localStorage.setItem(STATE_KEY, name);
    window.localStorage.setItem(STATE_SELECTED_KEY, 'true');
    setModalOpen(false);
  };

  const isPilot = state === PILOT_STATE;

  return (
    <StateContext.Provider
      value={{ state, selectState, isPilot, hasSelected, modalOpen, setModalOpen }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useAppState must be used within StateProvider');
  return ctx;
}
