const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

class Person {
    name: string;
    born: number;
    died: number | null;
}

class Family {
    persons: Person[];
    relations: Relation[];

    constructor(persons: Person[], relations: Relation[]) {
        this.persons = persons;
        this.relations = relations;
    }

    getRelation(index: number): Relation | null {
        for (const relation of this.relations) {
            if (relation.male == index || relation.female == index) {
                return relation;
            }
        }
        return null;
    }

    getPartner(index: number): number | null {
        const relation = this.getRelation(index);
        if (relation == null) return null;
        if (relation.male == index) return relation.female;
        if (relation.female == index) return relation.male;
        return null;
    }
}

class Relation {
    male: number;
    female: number;
    children: number[];

    constructor(male: number, female: number, children: number[] = []) {
        this.male = male;
        this.female = female;
        this.children = children;
    }
}

// An example family tree
const family: Family = new Family(
    [
        { name: "John", born: 1940, died: 2010 },
        { name: "Jane", born: 1945, died: 2013 },
        // children of John and Jane
        { name: "Jack", born: 1965, died: null },
        { name: "Jill", born: 1966, died: null },
        // husband of Jill
        { name: "James", born: 1962, died: 2015 },
        // children of James and Jill
        { name: "Jenny", born: 1987, died: null },
        { name: "Joe", born: 1991, died: null },
        { name: "Jade", born: 1992, died: null },
        // wife of Jack
        { name: "Judy", born: 1967, died: null },
    ],
    [
        new Relation(0, 1, [2, 3]),
        new Relation(3, 4, [5, 6, 7]),
        new Relation(2, 8),
    ],
);

const drawSettings = {
    nodeWidth: 80,
    nodeHeight: 40,
    partnerDist: 140,
    nodeRounding: 6,
    levelHeight: 100,
    levelWidth: 120,
    lineWidth: 3,
    nodeColor: "#555",
    textColor: "#fff",
    lineColor: "#555",
    dotColor: "#999",
    dotSize: 6,
};

function drawPerson(ctx: CanvasRenderingContext2D, person: Person, x: number, y: number) {
    ctx.beginPath();
    ctx.roundRect(x - drawSettings.nodeWidth / 2, y - drawSettings.nodeHeight / 2, drawSettings.nodeWidth, drawSettings.nodeHeight, [drawSettings.nodeRounding]);
    ctx.fillStyle = drawSettings.nodeColor;
    ctx.fill();
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "18px sans-serif";
    ctx.fillStyle = drawSettings.textColor;
    ctx.fillText(person.name, x, y - 4);
    let ageLabel = person.born.toString();
    if (person.died != null) {
        ageLabel += " - " + person.died.toString();
    }
    ctx.font = "12px sans-serif";
    ctx.fillText(ageLabel, x, y + 14);
}

function drawCurvedLine(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
    ctx.lineWidth = drawSettings.lineWidth;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY + drawSettings.nodeHeight / 2);
    ctx.quadraticCurveTo(toX, toY - drawSettings.nodeHeight - 30, toX, toY - drawSettings.nodeHeight / 2);
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.stroke();
}

function drawLine(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
    ctx.lineWidth = drawSettings.lineWidth;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.stroke();
}


function familyDepth(family: Family, root: number) {
    const relation = family.getRelation(root);
    if (relation == null) return 0;
    if (relation.children.length == 0) return 0;
    let maxDepth = 0;
    for (const child of relation.children) {
        maxDepth = Math.max(maxDepth, familyDepth(family, child));
    }
    return 1 + maxDepth;
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.fillStyle = drawSettings.dotColor;
    ctx.arc(x, y, drawSettings.dotSize, 0, 2 * Math.PI);
    ctx.fill();
}

function drawFamilyTree(family: Family, root: number, canvas: HTMLCanvasElement, x: number, y: number) {
    const relation = family.getRelation(root);
    if (relation == null) {
        // Draw a single person
        drawPerson(ctx, family.persons[root], x, y);
        return;
    }
    drawLine(ctx, x - drawSettings.partnerDist / 2, y, x + drawSettings.partnerDist / 2, y);
    drawDot(ctx, x, y);
    if (relation.male == root) {
        let partner = relation.female;
        drawPerson(ctx, family.persons[root], x - drawSettings.partnerDist / 2, y);
        drawPerson(ctx, family.persons[partner], x + drawSettings.partnerDist / 2, y);
    } else if (relation.female == root) {
        let partner = relation.male;
        drawPerson(ctx, family.persons[root], x - drawSettings.partnerDist / 2, y);
        drawPerson(ctx, family.persons[partner], x + drawSettings.partnerDist / 2, y);
    }

    const totalChilds = relation.children.length;
    const levelWidth = drawSettings.levelWidth * Math.pow(2, familyDepth(family, root));
    if (totalChilds == 0) {
        return;
    }
    // Vertical line from relation to dot
    drawLine(ctx, x, y, x, y + drawSettings.levelHeight / 2);
    // Horizontal line
    drawLine(ctx, x - levelWidth / 2, y + drawSettings.levelHeight / 2, x + levelWidth / 2, y + drawSettings.levelHeight / 2);
    drawDot(ctx, x, y);

    for (let i = 0; i < totalChilds; i++) {
        const child = relation.children[i];
        const xOffset = i / (totalChilds - 1) * levelWidth - levelWidth / 2;
        const childX = x + xOffset;
        const childY = y + drawSettings.levelHeight;
        drawLine(ctx, childX, childY - drawSettings.levelHeight / 2, childX, childY);
        drawFamilyTree(family, child, canvas, childX, childY);
    }
}

drawFamilyTree(family, 0, canvas, canvas.width / 2, drawSettings.nodeHeight);
