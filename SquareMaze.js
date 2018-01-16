const chalk = require('chalk')

module.exports = class {
      constructor() {
            
      }
      init(length,obstacleNumber) {
            this.length = length
            this.maze = []
            var i,j
            for(i=0;i<this.length;i++){
                  this.maze.push([])
                  for(j=0;j<this.length;j++){
                        this.maze[i].push(0)
                  }
            }
            this.entry = this.genEdgePoint()
            while(true){
                  this.exit = this.genEdgePoint()
                  if(this.exit.col == this.entry.col && this.exit.row == this.entry.row){
                        continue
                  }
                  break
            }

            this.maze[this.entry.row][this.entry.col] = 8
            this.maze[this.exit.row][this.exit.col] = 5
            
            //var obstacleNumber = parseInt(this.length*this.length/4) 
            this.genObstacles(obstacleNumber)
      }

      getMazeData(){
            return this.maze
      }

      initWithData(mazeData){
            this.maze = mazeData
            this.length = this.maze.length
            
            var i,j
            for(i=0;i<this.length;i++){
                  for(j=0;j<this.length;j++){
                        if(this.maze[i][j]==8){
                              this.entry={row:i, col:j}
                        }
                        if(this.maze[i][j]==5){
                              this.exit={row:i, col:j}
                        }
                  }
            }
      }

      leftDistance(pos,reverse){
            if(reverse){
                  return Math.abs(pos.row - this.entry.row) + Math.abs(pos.col - this.entry.col)
            }else{
                  return Math.abs(pos.row - this.exit.row) + Math.abs(pos.col - this.exit.col)
            }
      }

      resolve(path,reverse){
            var walk = path.walk

            var current
            if(reverse){
                  current = {row: this.exit.row,col: this.exit.col}
            }else{
                  current = {row: this.entry.row,col: this.entry.col}
            }
            
            path.recordTrack(current)

            var canWalk
            for(var i=0;walk.length;i++){
                  canWalk = false
                  switch(walk[i]){
                        case 0: //top
                              if(current.row==0){                                    
                                    break
                              }
                              if(this.maze[current.row-1][current.col]==1 || this.maze[current.row-1][current.col]==8){
                                    break
                              }
                              canWalk = true
                              current.row--
                              break
                        case 1://right
                              if(current.col==this.length-1){
                                    break
                              }
                              if(this.maze[current.row][current.col+1]==1 || this.maze[current.row][current.col+1]==8){
                                    break
                              }

                              canWalk = true
                              current.col++
                              break
                        case 2://bottom
                              if(current.row==this.length-1){
                                    break
                              }
                              if(this.maze[current.row+1][current.col]==1 || this.maze[current.row+1][current.col]==8){
                                    break
                              }

                              canWalk = true
                              current.row++
                        break
                        case 3://left
                              if(current.col==0){
                                    break
                              }
                              if(this.maze[current.row][current.col-1]==1 || this.maze[current.row][current.col-1]==8){
                                    break
                              }

                              canWalk = true
                              current.col--
                              break
                  }
                  if(!canWalk){
                        path.leftDistance =this.leftDistance(current,reverse)
                        path.step = i
                        return false
                  }

                  path.recordTrack(current)

                  if(reverse){
                        if(current.row == this.entry.row && current.col == this.entry.col){
                              return true
                        }
                  }else{
                        if(current.row == this.exit.row && current.col == this.exit.col){
                              return true
                        }
                  }
            }
      }

      genObstacles(number){
            //console.log('genObstacles',number)
            var c = 0
            var index
            while(c<number){
                  var i = Math.floor(Math.random()*this.length)
                  var j = Math.floor(Math.random()*this.length)
                  //console.log('genObstacles',i,j)
                  if(this.maze[i][j]>0){
                        continue
                  }
                  this.maze[i][j] = 1
                  c+=1
            }
      }

      genEdgePoint(){
            var edge = Math.floor(Math.random()*4)
            var index = Math.floor(Math.random()*this.length)
            //console.log(edge,index)
            switch(edge){
                  case 0:     //top
                        return {row:0,col:index}
                  break
                  case 1:     //right
                        return {row:index,col:this.length-1}
                  break
                  case 2:     //bottom
                        return {row:this.length-1,col:index}
                  break
                  case 3:     //left
                        return {row:index,col:0}
                  break
            }
      }

      print(track){
           var line
            var i,j
            for(i=0;i<this.length;i++){
                  line = ''
                  for(j=0;j<this.length;j++){
                        if(this.maze[i][j]==8){//entry
                              line += chalk.blue(this.maze[i][j])
                        }else if(this.maze[i][j]==5){ //exit
                              line += chalk.yellow(this.maze[i][j])
                        }else if(this.maze[i][j]==1){ //obstacle
                              line += chalk.red(this.maze[i][j])
                        }else {
                              if(track && track[i][j]==1){     //track
                                    line += chalk.green(this.maze[i][j])
                                    // line += '2'
                              }else{
                                    line += this.maze[i][j]
                              }
                        }
                        line += ' '
                  }
                  console.log(line)
            } 
      }
      
      printWithTwoPath(path1,path2){
            var line
            var i,j
            var track1 = path1.track
            var track2 = path2.track
            for(i=0;i<this.length;i++){
                  line = ''
                  for(j=0;j<this.length;j++){
                        if(this.maze[i][j]==8){//entry
                              line += chalk.blue(this.maze[i][j])
                        }else if(this.maze[i][j]==5){ //exit
                              line += chalk.yellow(this.maze[i][j])
                        }else if(this.maze[i][j]==1){ //obstacle
                              line += chalk.red(this.maze[i][j])
                        }else {
                              if(track1 && track1[i][j]==1 && track2 && track2[i][j]==1){     //track
                                    line += chalk.green(this.maze[i][j])
                                    // line += '2'
                              }else if(track1 && track1[i][j]==1){     //track
                                    line += chalk.magenta(this.maze[i][j])
                                    // line += '3'
                              }else if(track2 && track2[i][j]==1){     //track
                                    line += chalk.cyan(this.maze[i][j])
                                    // line += '4'
                              }else{
                                    line += this.maze[i][j]
                              }
                        }
                        line += ' '
                  }
                  console.log(line)
            } 
      }
}