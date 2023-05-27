import { Component, createSignal, For, Show } from 'solid-js';
import { Person, Gender } from './family';
import { Tree } from './Tree';

const FamilyManager: Component = () => {
    const [people, setPeople] = createSignal<Person[]>([
        new Person("John", "Doe", Gender.Male, new Date(1990, 8, 27)),
        new Person("Jane", "Doe", Gender.Female, new Date(1993, 5, 14)),
    ]);

    const [firstName, setFirstName] = createSignal<string>('');
    const [lastName, setLastName] = createSignal<string>('');
    const [gender, setGender] = createSignal<Gender>();
    const [dateOfBirth, setBirthDate] = createSignal<Date>(new Date());
    const [isDeceased, setIsDead] = createSignal(false);
    const [dateOfDeath, setDeathDate] = createSignal<Date>(new Date());

    function addPerson(e: SubmitEvent) {
        e.preventDefault();
        setPeople((people) => people.concat(new Person(firstName(), lastName(), gender(), dateOfBirth(), isDeceased() ? dateOfDeath() : undefined)));
    }

    return (
        <div class="container mx-auto">
            <h2>Family Manager</h2>
            <div>
                <h2>People</h2>
                <table class="table-auto">
                    <thead>
                        <tr>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Gender</th>
                            <th>Date of birth</th>
                            <th>Date of death</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={people()}>
                            {(person) => (
                                <tr>
                                    <td>{person.firstName}</td>
                                    <td>{person.lastName}</td>
                                    <td>{person.gender}</td>
                                    <td>{person.birthDate.toLocaleDateString()}</td>
                                    <td>{person.deceased?.toLocaleDateString()}</td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>
            <form onSubmit={addPerson}>
                <h2>Add person</h2>
                <div class="grid grid-cols-2 gap-4">
                    <label>First name</label>
                    <input type="text" placeholder="First name" onInput={(e) => setFirstName(e.target.value)} required />
                    <label>Family name</label>
                    <input type="text" placeholder="Family name" onInput={(e) => setLastName(e.target.value)} required />
                    <label>Gender</label>
                    <select class="px-4 py-2 rounded-md" onInput={(e) => setGender(e.target.value as Gender)}>
                        <option value="" selected hidden>Select gender</option>
                        <For each={Object.entries(Gender)}>
                            {([name, id]) => (
                                <option value={id}>{name}</option>
                            )}
                        </For>
                    </select>
                    <label>Date of birth</label>
                    <input type="date" onInput={(e) => setBirthDate(new Date(e.target.value))} required />
                    <label>Deceased</label>
                    <input type="checkbox" onInput={(e) => setIsDead(e.target.checked)} />
                    <Show when={isDeceased()}>
                        <label>Date of death</label>
                        <input type="date" onInput={(e) => setDeathDate(new Date(e.target.value))} required />
                    </Show>
                </div>
                <button class="rounded-md bg-sky-500 hover:bg-sky-700 font-semibold px-4 py-2 text-white" type="submit">Submit</button>
            </form>
        </div>
    );
};

const App: Component = () => {
    return (
        <div class="container mx-auto">
            <h1>My App</h1>
            <Tree />
            <FamilyManager />
        </div>
    );
};

export default App;
