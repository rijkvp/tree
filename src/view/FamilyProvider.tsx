import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Family, Gender, Person, Relation } from "../model/family";

const exampleFamily = new Family(
    [
        new Person("John", "Doe", Gender.Male, new Date(1940, 8, 27), new Date(2010, 9, 17)),
        new Person("Jane", "Brennan", Gender.Female, new Date(1945, 5, 14), new Date(2013, 6, 28)),
        new Person("Jack", "Doe", Gender.Male, new Date(1965, 10, 23)),
        new Person("Jill", "Doe", Gender.Female, new Date(1966, 5, 14)),
        new Person("James", "Brown", Gender.Male, new Date(1962, 8, 27), new Date(2015, 8, 27)),
        new Person("Jenny", "Brown", Gender.Female, new Date(1987, 5, 14)),
        new Person("Joe", "Brown", Gender.Male, new Date(1991, 5, 14)),
        new Person("Jade", "Brown", Gender.Female, new Date(1992, 2, 12)),
        new Person("Judy", "Boure", Gender.Female, new Date(1967, 3, 30)),
    ],
    [
        new Relation(0, 1, [2, 3]),
        new Relation(3, 4, [5, 6, 7]),
        new Relation(2, 8),
    ],
);

const FamilyContext = createContext();

export function FamilyProvider(props: any) {
    const [family, setFamily] = createStore(exampleFamily),
        familyValue = [
            family,
            {
                addPerson(person: Person) {
                    setFamily(f => new Family([...f.persons, person], f.relations));
                },
                updatePerson(index: number, person: Person) {
                    console.log('UPDATE PERSON', index, person);
                    setFamily(f => {
                        const persons = [...f.persons];
                        persons[index] = person;
                        return new Family(persons, f.relations);
                    });
                },
                removePerson(index: number) {
                    setFamily(f => {
                        const persons = [...f.persons];
                        const relations = [...f.relations];
                        persons.splice(index, 1);
                        return new Family(persons, relations.filter(r => r.male == index || r.female == index));
                    });
                }
            }
        ];

    return (
        <FamilyContext.Provider value={familyValue}>
            {props.children}
        </FamilyContext.Provider>
    );
}

export function useFamily() { return useContext(FamilyContext); }
