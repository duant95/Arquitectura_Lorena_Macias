import { createContext, useCallback, useContext, useState } from 'react';

const AgendaContext = createContext({ open: () => {}, close: () => {}, isOpen: false });

export function AgendaProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.documentElement.style.overflow = '';
  }, []);

  return (
    <AgendaContext.Provider value={{ isOpen, open, close }}>
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  return useContext(AgendaContext);
}
