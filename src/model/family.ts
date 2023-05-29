export enum Gender {
    Male = "m",
    Female = "f",
    NonBinary = "nb",
}

export class Person {
    firstName: string;
    lastName: string;
    gender: Gender;
    birthDate: Date;
    deceased?: Date;

    constructor(firstName: string, lastName: string, gender: Gender, birthDate: Date, deceased?: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.birthDate = birthDate;
        this.deceased = deceased;
    }

    summary(): string {
        return `${this.firstName} ${this.lastName} (${this.gender})`;
    }
}

export class Family {
    persons: Person[];
    relations: Relation[];

    constructor(persons: Person[], relations: Relation[]) {
        this.persons = persons;
        this.relations = relations;
    }

    getRelations(index: number): Relation[] {
        let relations: Relation[] = [];
        for (const relation of this.relations) {
            if (relation.male == index || relation.female == index) {
                relations.push(relation);
            }
        }
        return relations;
    }
}

export class Relation {
    male: number;
    female: number;
    children: number[];

    constructor(male: number, female: number, children: number[] = []) {
        this.male = male;
        this.female = female;
        this.children = children;
    }
}

