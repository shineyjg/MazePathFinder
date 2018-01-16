module.exports = class {
    constructor(maze_edge_length){
        this.maze_edge_length = maze_edge_length
    }

    gen(length){
        var i
        var direction
        this.walk = []
        for(i=0;i<length;i++){
            direction = Math.floor(Math.random()*4)
            while(i>0 && Math.abs(this.walk[i-1] - direction)==2){
                direction = Math.floor(Math.random()*4)
            }
            this.walk.push(direction)
        }
    }

    recordTrack(pos){
        var i,j
        if(this.track == undefined){
            this.track = []

            for(i=0;i<this.maze_edge_length;i++){
                this.track.push([])
                for(j=0;j<this.maze_edge_length;j++){
                    this.track[i].push(0)
                }
            }
        }

        this.track[pos.row][pos.col] = 1

        if(this.positions == undefined){
            this.positions = []
        }

        this.positions.push(pos)
    }

    didWalk(row,col){
        return this.track[row][col]==1
    }
    
    print(){
        var line = ''
        for(var i=0;i<this.walk.length;i++){
            line += this.walk[i]
        }
        console.log(line)
        if(this.leftDistance){
            console.log('dis',this.leftDistance,'step',this.step)
        }
    }
}