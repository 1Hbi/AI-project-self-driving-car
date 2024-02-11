class Controls{
    constructor(type){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;
        switch(type){
            case 'KEYS':
        this.#addkeybordListeners();
                break;
        case 'DUMMY':
            this.forward = true;
            break;

        }
    }
    #addkeybordListeners(){
        document.onkeydown=(event)=> {
            switch(event.key){
                case "A": 
                case "a":
                    this.left=true;
                    break;
                case "D":
                case "d":
                    this.right=true;
                    break;
                case "W":
                case "w":
                    this.forward=true;
                    break;
                case "S":
                case "s":
                    this.reverse=true;
                    break;
            }
            //console.table(this)

        }
        document.onkeyup=(event)=> {
            switch(event.key){
                case "A" :
                case "a":
                    this.left=false;
                    break;
                case "D":
                case "d":
                    this.right=false;
                    break;
                case "W":
                case "w":
                    this.forward=false;
                    break;
                case "S":
                case "s":
                    this.reverse=false;
                    break;
            }
           // console.table(this);

        }
        
    }
}