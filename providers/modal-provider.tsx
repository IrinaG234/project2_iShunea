"use client";

import { useEffect, useState } from "react";

export const ModalProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // evita hydration mismatch

  return <>{children}</>;
};