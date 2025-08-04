import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PartForm } from './components/PartForm';
import { SpreadsheetInput } from './components/SpreadsheetInput';
import { PartsTable } from './components/PartsTable';
import { FieldSettings } from './components/FieldSettings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Part, FieldVisibility, defaultFieldVisibility } from './types';

function App() {
  const [parts, setParts] = useLocalStorage<Part[]>('qm-parts', []);
  const [fieldVisibility, setFieldVisibility] = useLocalStorage<FieldVisibility>('field-visibility', defaultFieldVisibility);
  const [showSettings, setShowSettings] = useState(false);

  const addPart = (newPart: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => {
    const part: Part = {
      ...newPart,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setParts(prevParts => [part, ...prevParts]);
  };

  const addParts = (newParts: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const parts: Part[] = newParts.map(newPart => ({
      ...newPart,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setParts(prevParts => [...parts, ...prevParts]);
  };

  const updatePart = (partId: string, updates: Partial<Part>) => {
    setParts(prevParts =>
      prevParts.map(part =>
        part.id === partId
          ? { ...part, ...updates, updatedAt: new Date().toISOString() }
          : part
      )
    );
  };

  const deletePart = (partId: string) => {
    setParts(prevParts => prevParts.filter(part => part.id !== partId));
  };

  const updateFieldVisibility = (field: keyof FieldVisibility, visible: boolean) => {
    setFieldVisibility(prev => ({
      ...prev,
      [field]: visible
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard parts={parts} />
        
        <PartForm 
          onAddPart={addPart} 
          fieldVisibility={fieldVisibility}
        />
        
        <SpreadsheetInput 
          onAddParts={addParts}
          existingParts={parts}
          onImportToExisting={addParts}
          fieldVisibility={fieldVisibility}
        />
        
        <PartsTable 
          parts={parts}
          fieldVisibility={fieldVisibility}
          onUpdatePart={updatePart}
          onDeletePart={deletePart}
        />
      </main>

      <FieldSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        fieldVisibility={fieldVisibility}
        onUpdateVisibility={updateFieldVisibility}
      />
    </div>
  );
}

export default App;