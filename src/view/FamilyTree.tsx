import { Component, createEffect, createSignal, For, onCleanup } from "solid-js";
import { Family, Person } from "../model/family";
import { useFamily } from "./FamilyProvider";

const drawSettings = {
    nodeWidth: 130,
    nodeHeight: 40,
    partnerDist: 180,
    nodeRounding: 6,
    levelHeight: 100,
    levelWidth: 140,
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
    ctx.font = "16px sans-serif";
    ctx.fillStyle = drawSettings.textColor;
    ctx.fillText(person.summary(), x, y - 5);
    let ageLabel = person.birthDate.toLocaleDateString();
    if (person.deceased) {
        ageLabel += " - " + person.deceased.toLocaleDateString();
    }
    ctx.font = "10px sans-serif";
    ctx.fillText(ageLabel, x, y + 14);
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
    const relations = family.getRelations(root);
    if (relations.length == 0) return 0;
    let maxDepth = 0;
    for (let relation of relations) {
        for (const child of relation.children) {
            maxDepth = Math.max(maxDepth, familyDepth(family, child));
        }
    }
    return 1 + maxDepth;
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.fillStyle = drawSettings.dotColor;
    ctx.arc(x, y, drawSettings.dotSize, 0, 2 * Math.PI);
    ctx.fill();
}

function drawFamilyTree(family: Family, root: number, ctx: CanvasRenderingContext2D, x: number, y: number) {
    const relations = family.getRelations(root);
    if (relations.length == 0) {
        // Draw a single person
        drawPerson(ctx, family.persons[root], x, y);
        return;
    }
    if (relations.length == 1) {
        const relation = relations[0];
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
            drawFamilyTree(family, child, ctx, childX, childY);
        }
    } else {
        console.warn("Multiple relations are not supported yet");
    }
}

export const FamilyTree: Component = () => {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    const [selectedPerson, setSelectedPerson] = createSignal(0);
    const [family] = useFamily();

    const setupCanvas = (canvasRef: HTMLCanvasElement) => {
        canvas = canvasRef;
        context = canvasRef.getContext('2d')!;
    };

    createEffect(() => {
        const drawCanvas = () => {
            const canvasWidth = canvas.getBoundingClientRect().width;
            //const canvasHeight = canvas.getBoundingClientRect().height;
            canvas.width = canvasWidth;
            //canvas.height = canvasHeight;
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            drawFamilyTree(family, selectedPerson(), context, canvas.width / 2, drawSettings.nodeHeight);

        };
        window.addEventListener('resize', drawCanvas);
        drawCanvas();

        onCleanup(() => {
            window.removeEventListener('resize', drawCanvas);
        });
    });

    return <>
        <label class="px-4 py-2">Select person</label>
        <select class="px-4 py-2 rounded-md" onInput={(e) => setSelectedPerson(parseInt(e.target.value))}>
            <For each={family.persons}>
                {(person, index) => (
                    <option value={index()} selected={index() == selectedPerson()}>{person.summary()}</option>
                )}
            </For>
        </select>
        <canvas class="w-full" height="400px" ref={setupCanvas} />
    </>;
};
