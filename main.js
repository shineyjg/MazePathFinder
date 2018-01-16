
const SquareMaze = require('./SquareMaze')
const MazeSolution = require('./MazeSolution')

// var mazes = genMazeManual()
var mazes = genMazeRandom(10,10)
var solution = new MazeSolution()
var count = 0
for(var i=0;i<mazes.length;i++){
    console.log("----------------maze: " + (i+1) + "-------------------")
    mazes[i].print()
    console.log()
    if(solution.resolve(mazes[i])){
        count++
    }
}

console.log("success rate: ", (count*100/mazes.length).toFixed(2) + '%')

function genMazeRandom(count,maze_size_length){
    var mazes = []

    for(i=0;i<count;i++){
        maze = new SquareMaze()
        maze.init(maze_size_length,parseInt(maze_size_length*maze_size_length*3/10))
        mazes.push(maze)
    }
    return mazes
}

function genMazeManual(){

var mazeData = [
        [
            [8,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,5]
        ],
        [
            [8,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,0,1],
            [0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,5]
        ],
        [
            [8,0,1,0,0,0,0,0],
            [0,0,0,1,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [0,0,1,0,0,0,1,0],
            [0,0,0,0,0,0,0,0],
            [1,0,1,1,0,0,0,0],
            [0,1,0,1,0,0,0,0],
            [1,0,0,0,1,1,0,5]
        ],
        // [
        //     [8,0,1,0,0,0,0,0],
        //     [0,0,1,1,0,1,0,1],
        //     [1,0,0,0,0,0,0,1],
        //     [0,0,1,0,0,0,1,0],
        //     [0,0,0,0,0,0,0,0],
        //     [1,0,1,1,0,0,0,0],
        //     [0,1,0,1,0,0,0,1],
        //     [1,0,0,0,1,1,1,5]
        // ],
        [
            [8,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,0,1],
            [0,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,1,5]
        ]
    ]

    var maze
    var mazes = []
    for(var i=0;i<mazeData.length;i++){
        maze = new SquareMaze()
        maze.initWithData(mazeData[i])
        mazes.push(maze)
    }
    return mazes
}
