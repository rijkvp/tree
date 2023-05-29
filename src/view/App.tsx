import { Component } from 'solid-js';
import { FamilyManager } from './FamilyManager';
import { FamilyTree } from './FamilyTree';
import { FamilyProvider } from './FamilyProvider';

const App: Component = () => {
    return (
        <FamilyProvider>
            <FamilyTree />
            <FamilyManager />
        </FamilyProvider>
    );
};

export default App;
