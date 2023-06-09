import { Component, createEffect, createSignal, For, Match, Setter, Show, Switch } from "solid-js";
import { Gender, Person } from "../model/family";
import { useFamily } from "./FamilyProvider";

const FamilyList: Component<{ setInspectState: Function }> = (props) => {
    const [family] = useFamily();

    return <table class="table-auto">
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
            <For each={family.persons}>
                {(person, i) => (
                    <tr
                        class="cursor-pointer border border-slate-900"
                        onClick={() => props.setInspectState({
                            type: InspectStateType.EditPerson,
                            selected: i() as number,
                        })}>
                        <td>{person.firstName}</td>
                        <td>{person.lastName}</td>
                        <td>{person.gender}</td>
                        <td>{person.birthDate.toLocaleDateString()}</td>
                        <td>{person.deceased?.toLocaleDateString()}</td>
                    </tr>
                )}
            </For>
        </tbody>
    </table>;
}

const PersonEditor: Component<{ person: Person, onChange: Function, }> = (props) => {
    const [firstName, setFirstName] = createSignal<string>(props.person.firstName);
    const [lastName, setLastName] = createSignal<string>(props.person.lastName);
    const [gender, setGender] = createSignal<Gender>(props.person.gender);
    const [birthDate, setBirthDate] = createSignal<Date>(props.person.birthDate);
    const [isDeceased, setIsDead] = createSignal(props.person.deceased != undefined);
    const [deathDate, setDeathDate] = createSignal<Date>(props.person.deceased ?? new Date());

    createEffect(() => {
        setFirstName(props.person.firstName);
        setLastName(props.person.lastName);
        setGender(props.person.gender);
        setBirthDate(props.person.birthDate);
        setIsDead(props.person.deceased != undefined);
        setDeathDate(props.person.deceased ?? new Date());
    });

    const save = () => {
        const person = new Person(firstName(), lastName(), gender(), birthDate(), deathDate());
        props.onChange(person);
    }

    return <div>
        <div class="grid grid-cols-2 gap-4">
            <label>First name</label>
            <input type="text" placeholder="First name" value={props.person.firstName} onInput={(e) => setFirstName(e.target.value)} required />
            <label>Family name</label>
            <input type="text" placeholder="Family name" value={lastName()} onInput={(e) => setLastName(e.target.value)} required />
            <label>Gender</label>
            <select class="px-4 py-2 rounded-md" value={gender()} onInput={(e) => setGender(e.target.value as Gender)}>
                <option value="" selected hidden>Select gender</option>
                <For each={Object.entries(Gender)}>
                    {([name, id]) => (
                        <option value={id}>{name}</option>
                    )}
                </For>
            </select>
            <label>Date of birth</label>
            <input type="date" value={birthDate().toString()} onInput={(e) => setBirthDate(new Date(e.target.value))} required />
            <label>Deceased</label>
            <input type="checkbox" onInput={(e) => setIsDead(e.target.checked)} />
            <Show when={isDeceased()}>
                <label>Date of death</label>
                <input type="date" value={deathDate().toString()} onInput={(e) => setDeathDate(new Date(e.target.value))} required />
            </Show>
        </div>
        <button class="bg-green-600" onClick={save}>Save</button>
    </div>;
}

const Inspector: Component<{ inspectState: InspectState, setInspectState: Setter<InspectState> }> = (props) => {
    const [family, { addPerson, updatePerson, removePerson }] = useFamily();

    const selectedPerson = () => family.persons[props.inspectState.selected];

    function close() {
        props.setInspectState({ type: InspectStateType.None, selected: -1 });
    }

    function onPersonChange(person: Person) {
        if (props.inspectState.type == InspectStateType.AddPerson) {
            addPerson(person);
        } else if (props.inspectState.type == InspectStateType.EditPerson) {
            updatePerson(props.inspectState.selected, person);
        }
        close();
    }

    return <div>
        <Show when={props.inspectState.type != InspectStateType.None}>
            <Switch>
                <Match when={props.inspectState.type == InspectStateType.AddPerson}>
                    <h2>Add person</h2>
                    <PersonEditor person={new Person('', '', Gender.Male, new Date())} onChange={onPersonChange} />
                    <button class="bg-slate-600" onClick={() => close()}>Cancel</button>
                </Match>
                <Match when={props.inspectState.type == InspectStateType.EditPerson}>
                    <h2>Edit person</h2>
                    <PersonEditor person={selectedPerson()} onChange={onPersonChange} />
                    <button class="bg-red-600" onClick={() => removePerson(props.inspectState.selected)}>Remove person</button>
                </Match>
                <Match when={props.inspectState.type == InspectStateType.AddRelation}>
                    <h2>Add relation</h2>
                    <p>To-Do</p>
                </Match>
            </Switch>
        </Show>
    </div >;
}

enum InspectStateType {
    None,
    AddPerson,
    EditPerson,
    AddRelation,
    EditRelation,
}

interface InspectState {
    type: InspectStateType,
    selected: number,
}

export const FamilyManager: Component = () => {
    const [inspectState, setInspectState] = createSignal<InspectState>({ type: InspectStateType.None, selected: -1 });

    return (
        <div class="container mx-auto">
            <h2>Family Manager</h2>
            <button onClick={() => setInspectState({ type: InspectStateType.AddPerson, selected: -1 })}>Add person</button>
            <button class="mx-2" onClick={() => setInspectState({ type: InspectStateType.AddRelation, selected: -1 })}>Add relation</button>
            <div class="flex gap-10">
                <FamilyList setInspectState={setInspectState} />
                <Inspector inspectState={inspectState()} setInspectState={setInspectState} />
            </div>
        </div>
    );
};
