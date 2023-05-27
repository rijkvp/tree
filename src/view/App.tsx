import { Component } from 'solid-js';
import { FamilyManager } from './FamilyManager';
import { FamilyTree } from './FamilyTree';
import { FamilyProvider } from './FamilyProvider';

const App: Component = () => {
    return (
        <div class="container mx-auto">
            <FamilyProvider>
                <FamilyTree />
                <FamilyManager />
            </FamilyProvider>
        </div>
    );
};

export default App;
