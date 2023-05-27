import { Component, createSignal, For, Show } from "solid-js";
import { Gender, Person } from "../model/family";
import { useFamily } from "./FamilyProvider";

const FamilyList: Component = (props: any) => {
    return <div>
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
                <For each={props.family.persons}>
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
    </div>;
}

export const FamilyManager: Component = () => {
    const [family, { addPerson }] = useFamily();

    const [firstName, setFirstName] = createSignal<string>('');
    const [lastName, setLastName] = createSignal<string>('');
    const [gender, setGender] = createSignal<Gender>();
    const [dateOfBirth, setBirthDate] = createSignal<Date>(new Date());
    const [isDeceased, setIsDead] = createSignal(false);
    const [dateOfDeath, setDeathDate] = createSignal<Date>(new Date());

    function insertPerson(e: SubmitEvent) {
        e.preventDefault();
        const person = new Person(firstName(), lastName(), gender()!, dateOfBirth(), isDeceased() ? dateOfDeath() : undefined);
        addPerson(person);
    }

    return (
        <div class="container mx-auto">
            <h2>Family Manager</h2>
            <FamilyList family={family} />
            <form onSubmit={insertPerson}>
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
