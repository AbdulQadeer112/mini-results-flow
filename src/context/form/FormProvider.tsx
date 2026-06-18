import React, { useState } from "react";
import { FormContext, defaultFormData, type FormData } from "./FormContext";

const STORAGE_KEY = "mini-results-form-data";

function loadFromStorage(): FormData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultFormData, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return defaultFormData;
}

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormDataState] = useState<FormData>(loadFromStorage);

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => {
      const next = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetForm = () => {
    setFormDataState(defaultFormData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};
