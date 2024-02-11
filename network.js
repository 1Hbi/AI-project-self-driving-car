class NeuralNetwork{
constructor(neuralCounts){
    this.levels=[];
    for(let i=0;i<neuralCounts.length-1;i++){
        this.levels.push(new Level(
            neuralCounts[i],neuralCounts[i+1]
        ));
    }

}
static feedForward(givenInput,network){
    let outputs = Level.feedForward(
        givenInput,network.levels[0]);
        for(let i =0;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
            
        }
        return outputs;

    
}
static mutate(network,amount=1){
    network.levels.forEach(level => {
        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=lerp(
                level.biases[i],
                Math.random()*2-1,
                amount
            )
        }
        for(let i=0;i<level.weights.length;i++){
            for(let j=0;j<level.weights[i].length;j++){
                level.weights[i][j]=lerp(
                    level.weights[i][j],
                    Math.random()*2-1,
                    amount
                )
            }
        }
        
    });
}
}




/**
 * Represents a neural network level.
 */
class Level {
    /**
     * Constructs a new Level instance with the specified number of inputs and outputs.
     * @param {number} inputCount - The number of input neurons.
     * @param {number} outputCount - The number of output neurons.
     */
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);    // Array to store input neuron values
        this.outputs = new Array(outputCount);  // Array to store output neuron values
        this.biases = new Array(outputCount);   // Array to store biases for output neurons
        
        // 2D array to store weights for connections between input and output neurons
        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights.push(new Array(outputCount));
        }
        
        // Initialize weights and biases with random values
        Level.#randomize(this);
    }
    
    /**
     * Private static method to randomize weights and biases of the level.
     * @param {Level} level - The Level instance to be randomized.
     */
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;  // Random weight value between -1 and 1
            }
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;   // Random bias value between -1 and 1
        }
    }
    
    /**
     * Performs feedforward operation for the given input data.
     * @param {Array<number>} givenInput - The input data to be processed.
     * @param {Level} level - The Level instance to perform feedforward operation on.
     * @returns {Array<number>} - The output data after processing.
     */
    static feedForward(givenInput, level) {
        // Assign given input data to input neurons
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInput[i];
        }
        
        // Perform weighted sum and activation for each output neuron
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) { 
                sum += level.inputs[j] * level.weights[j][i];  // Weighted sum of inputs
            }
            // Apply activation function (binary threshold) and assign output
            level.outputs[i] = (sum > level.biases[i]) ? 1 : 0;
        }
        
        // Return the output data after processing
        return level.outputs;
    }
}
