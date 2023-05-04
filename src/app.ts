const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const tree = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 4,
            left: {
                value: 8,
                left: null,
                right: null,
            },
            right: {
                value: 9,
                left: null,
                right: null,
            },
        },
        right: {
            value: 5,
            left: {
                value: 10,
                left: null,
                right: null,
            },
            right: null,
        },
    },
    right: {
        value: 3,
        left: {
            value: 6,
            left: {
                value: 12,
                left: null,
                right: null,
            },
            right: {
                value: 13,
                left: null,
                right: null,
            },
        },
        right: null
    },
};

const drawSettings = {
    radius: 20,
    levelHeight: 100,
    levelWidth: 20,
    lineWidth: 3,
    nodeColor: "#555",
    textColor: "#fff",
    lineColor: "#555",
};

function drawTree(tree: object, canvas: HTMLCanvasElement, x: number, y: number) {
    const ctx = canvas.getContext("2d")!;

    // Draw the current node
    ctx.lineWidth = drawSettings.lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, drawSettings.radius, 0, Math.PI * 2);
    ctx.fillStyle = drawSettings.nodeColor;
    ctx.fill();
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px sans-serif";
    ctx.fillStyle = drawSettings.textColor;
    ctx.fillText(tree["value"].toString(), x, y);

    // Draw the left subtree
    if (tree["left"]) {
        const leftX = x - drawSettings.levelWidth * Math.pow(2, treeDepth(tree["left"]));
        const leftY = y + drawSettings.levelHeight;
        ctx.beginPath();
        ctx.moveTo(x, y + drawSettings.radius);
        ctx.quadraticCurveTo(leftX, leftY - drawSettings.radius - 30, leftX, leftY - drawSettings.radius);
        ctx.strokeStyle = drawSettings.lineColor;
        ctx.stroke();
        drawTree(tree["left"], canvas, leftX, leftY);
    }

    // Draw the right subtree
    if (tree["right"]) {
        const rightX = x + drawSettings.levelWidth * Math.pow(2, treeDepth(tree["right"]));
        const rightY = y + drawSettings.levelHeight;
        ctx.beginPath();
        ctx.moveTo(x, y + drawSettings.radius);
        ctx.quadraticCurveTo(rightX, rightY - drawSettings.radius - 30, rightX, rightY - drawSettings.radius);
        ctx.strokeStyle = drawSettings.lineColor;
        ctx.stroke();
        drawTree(tree["right"], canvas, rightX, rightY);
    }
}

function treeDepth(tree: object) {
    if (!tree) return 0;
    const leftDepth = treeDepth(tree["left"]);
    const rightDepth = treeDepth(tree["right"]);
    return 1 + Math.max(leftDepth, rightDepth);
}

drawTree(tree, canvas, canvas.width / 2, drawSettings.radius + 10);
