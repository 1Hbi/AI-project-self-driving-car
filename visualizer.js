/**
 * Provides methods to visualize neural networks.
 */
class Visualizer {
    /**
     * Draws the entire neural network on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {Object} network - The neural network to be visualized.
     */
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(height - levelHeight, 0, network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1));

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight,
                i == network.levels.length - 1 ? ['W', 'A', 'D', 'S'] : []);
        }
    }

    /**
     * Draws a single level of the neural network.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {Object} level - The level of the neural network to be visualized.
     * @param {number} left - The left coordinate of the level.
     * @param {number} top - The top coordinate of the level.
     * @param {number} width - The width of the level.
     * @param {number} height - The height of the level.
     * @param {Array<string>} outputLabels - Labels for output nodes.
     */
    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        // Draw connections between nodes
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        // Draw input nodes
        const nodeRadius = 18;
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        // Draw output nodes
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw output labels
            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    /**
     * Private static method to calculate the x-coordinate of a node.
     * @param {Array<number>} nodes - The array of nodes.
     * @param {number} index - The index of the current node.
     * @param {number} left - The left coordinate of the level.
     * @param {number} right - The right coordinate of the level.
     * @returns {number} - The x-coordinate of the node.
     */
    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}
