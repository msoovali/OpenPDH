import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ConfigureFlow } from './components/ConfigureFlow';
import { ReadFlow } from './components/ReadFlow';
import { ConfigList } from './components/ConfigList';

export type View = 'configure' | 'read' | 'configs';

function getInitialView(): View {
  const state = window.history.state as { view?: View } | null;
  return state?.view ?? 'configs';
}

export default function App() {
  const [view, setView] = useState<View>(getInitialView);
  const [editConfigId, setEditConfigId] = useState<string | null>(null);
  const [cloneFromConfigId, setCloneFromConfigId] = useState<string | null>(null);
  const [readConfigId, setReadConfigId] = useState<string | null>(null);
  const [sharedFile, setSharedFile] = useState<File | null>(null);
  const [returnToRead, setReturnToRead] = useState(false);

  const navigate = useCallback((next: View) => {
    window.history.pushState({ view: next }, '');
    setView(next);
  }, []);

  useEffect(() => {
    // Replace initial entry so back from first non-configs view lands on configs
    window.history.replaceState({ view }, '');

    const onPopState = (e: PopStateEvent) => {
      const state = e.state as { view?: View } | null;
      setView(state?.view ?? 'configs');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = (id: string) => {
    setEditConfigId(id);
    setCloneFromConfigId(null);
    setReturnToRead(false);
    setSharedFile(null);
    navigate('configure');
  };

  const handleEditFromRead = (id: string, file: File | null) => {
    setEditConfigId(id);
    setCloneFromConfigId(null);
    setSharedFile(file);
    setReturnToRead(true);
    navigate('configure');
  };

  const handleCloneEditFromRead = (id: string, file: File | null) => {
    setEditConfigId(null);
    setCloneFromConfigId(id);
    setSharedFile(file);
    setReturnToRead(true);
    navigate('configure');
  };

  const handleNewConfig = () => {
    setEditConfigId(null);
    setCloneFromConfigId(null);
    setReturnToRead(false);
    setSharedFile(null);
    navigate('configure');
  };

  const handleRead = (id: string) => {
    setReadConfigId(id);
    setSharedFile(null);
    navigate('read');
  };

  const handleConfigDone = (savedConfigId?: string, backToRead?: boolean) => {
    if (backToRead && savedConfigId) {
      setReadConfigId(savedConfigId);
      setReturnToRead(false);
      navigate('read');
    } else {
      setEditConfigId(null);
      setCloneFromConfigId(null);
      setReturnToRead(false);
      setSharedFile(null);
      navigate('configs');
    }
  };

  return (
    <MantineProvider>
      <Layout onNavigate={navigate} currentView={view}>
        {view === 'configure' && (
          <ConfigureFlow
            editConfigId={editConfigId}
            cloneFromConfigId={cloneFromConfigId}
            initialFile={sharedFile}
            returnToRead={returnToRead}
            onDone={handleConfigDone}
          />
        )}
        {view === 'read' && <ReadFlow initialConfigId={readConfigId} initialFile={sharedFile} onEditTemplate={handleEditFromRead} onCloneEditTemplate={handleCloneEditFromRead} />}
        {view === 'configs' && <ConfigList onEdit={handleEdit} onNew={handleNewConfig} onRead={handleRead} />}
      </Layout>
    </MantineProvider>
  );
}
