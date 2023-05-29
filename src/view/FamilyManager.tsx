import { Component, createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { Gender, Person } from "../model/family";
import { useFamily } from "./FamilyProvider";

const FamilyList: Component<{ setInspectState: Function }> = (props: any) => {
    const [family] = useFamily();

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
                <For each={family.persons}>
                    {(person, i) => (
                        <tr onClick={() => props.setInspectState({
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
        </table>
    </div >;
}

const PersonEditor: Component<{ person: Person, setPerson: Function, }> = (props: any) => {
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

    return <div class="grid grid-cols-2 gap-4">
        <label>First name</label>
        <input type="text" placeholder="First name" value={firstName()} onInput={(e) => setFirstName(e.target.value)} required />
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
    </div>;
}

const Inspector: Component<{ inspectState: InspectState }> = (props: any) => {
    const [family, { addPerson, removePerson }] = useFamily();

    const selectedPerson = () => family.persons[props.inspectState.selected];

    function updatePerson(person: Person) {
        if (props.inspectState.type = InspectStateType.AddPerson) {
            addPerson(person);
        } else if (props.inspectState.type == InspectStateType.EditPerson) {
            family[props.inspectState.selected].person = person;
        }
    }

    function save() {
        console.log('save');
    }

    return <>
        <Show when={props.inspectState.type != InspectStateType.None}>
            <Switch>
                <Match when={props.inspectState.type == InspectStateType.AddPerson}>
                    <h2>Add person</h2>
                    <PersonEditor person={new Person('', '', Gender.Male, new Date())} setPerson={updatePerson} />
                </Match>
                <Match when={props.inspectState.type == InspectStateType.EditPerson}>
                    <h2>Edit person {props.inspectState.selected} {selectedPerson().firstName}</h2>
                    <PersonEditor person={selectedPerson()} setPerson={updatePerson} />
                    <button class="" onClick={save}>Save</button>
                    <button onClick={() => removePerson(props.inspectState.selected)}>Remove person</button>
                </Match>
                <Match when={props.inspectState.type == InspectStateType.AddRelation}>
                    <h2>Add relation</h2>
                    <p>To-Do</p>
                </Match>
            </Switch>
        </Show>
    </>;
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
            <button onClick={() => setInspectState({ type: InspectStateType.AddRelation, selected: -1 })}>Add relation</button>
            <FamilyList setInspectState={setInspectState} />
            <Inspector inspectState={inspectState()} />
        </div>
    );
};
