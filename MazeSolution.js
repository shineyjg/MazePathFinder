const Path = require('./Path')
module.exports = class {
    resolve(maze){
        //maze.print()

        //种群个数
        const PATH_NUMBER = Math.min(Math.max(100,maze.length*maze.length/2),200)
        
        //基因长度
        const PATH_LENGTH = Math.floor(maze.length*maze.length*3/4)

        var i,j
        var pathes = []
        var path
        for(i=0;i<PATH_NUMBER;i++){
            path = new Path(maze.length)
            path.gen(PATH_LENGTH)
            pathes.push(path)
        }

        var reverse_pathes = []        
        for(i=0;i<PATH_NUMBER;i++){
            path = new Path(maze.length)
            path.gen(PATH_LENGTH)
            reverse_pathes.push(path)
        }

        var generation = 0
        var overlap
        generation_while:
        while(true){
            generation++
            //console.log("---generation---" ,generation)
            for(i=0;i<PATH_NUMBER;i++){
                //console.log("---" + i + "---")
                
                if(maze.resolve(pathes[i],false)){
                    success(pathes[i])
                    return true
                }else{
                    //maze.print(pathes[i].track)
                }
            }
            
            for(i=0;i<PATH_NUMBER;i++){
                if(maze.resolve(reverse_pathes[i],true)){
                    success(reverse_pathes[i])
                    return true
                }
            }

            for(i=0;i<PATH_NUMBER;i++){
                for(j=0;j<PATH_NUMBER;j++){
                    overlap = doesPathesOverlaped(pathes[i],reverse_pathes[j])
                    if(overlap){
                        success(pathes[i],reverse_pathes[j],overlap)
                        return true
                    }
                }
            }

            if(generation>=Math.max(100,maze.length*maze.length/2)){
                console.log("failed")
                maze.print(pathes[0].track)
                console.log("failed")
                maze.print(pathes[1].track)
                console.log("failed")
                maze.print(reverse_pathes[0].track)
                console.log("failed")
                maze.print(reverse_pathes[1].track)
                return false
            }

            genNextGeneration(false)
            genNextGeneration(true)
        }

        function success(path1,path2){
            //console.log("success")
            if(path1 && path2){
                //console.log("success with two path")
                //path1.print()
                //path2.print()
                maze.printWithTwoPath(path1,path2)
            }else if(path1){
                //console.log("success with path1")
                maze.print(path1.track)
            }else{
                //console.log("success with path2")
                maze.print(path2.track)
            }
        }

        function optimizePathes(pathes){
            var i
            var p
            for(i=0;i<pathes.length;i++){
                p = pathes[i]
                eraseLoop(p)
            }
        }

        function eraseLoop(path){
            var i
            for(i=0;i<path.positions.length;i++){
                for(j=path.positions.length-1;j>i;j--){
                    if(path.positions[i].row == path.positions[j].row && path.positions[i].col == path.positions[j].col){

                    }
                }
            }
        }

        function doesPathesOverlaped(path1,path2){
            if(!path1.track || !path2.track){
                return false
            }
            var i,j
            for(i=0;i<path1.maze_edge_length;i++){                
                for(j=0;j<path1.maze_edge_length;j++){
                    if(path1.track[i][j]==1 && path2.didWalk(i,j)){
                        return {row:i,col:j}
                    }
                }
            }
            return false
        }

        //生成精英后代
        function genEliteChildren(path){
            var children = []
            var w,w1,w2,p
            if(path.step==0){
                for(w=0;w<4;w++){
                    if(w!=path.walk[0]){
                        children.push(genPathViaStep(path,w))
                        //break
                    }
                }
            }else{
                w = path.walk[path.step-1]
                for(i=0;i<4;i++){
                    if(i!=path.walk[path.step] && Math.abs(path.walk[path.step-1]-i)!=2){
                        children.push(genPathViaStep(path,i))
                        //break
                    }
                }
            }

            return children
        }

        function genPathViaStep(path,direction){
            var p = new Path(maze.length)
            p.walk = path.walk.slice(0,path.walk.length)
            p.walk[path.step] = direction
            return p
        }

        function genNextGeneration(reverse){
            var targetPathes = reverse?reverse_pathes:pathes

            //挑选走的远的4%
            var topLength = parseInt(PATH_NUMBER*4/100)
            var children = targetPathes.sort(function(p1,p2){
                return p2.step-p1.step
            })
            children = children.slice(0,topLength)

            //挑选离目标近的4%
            var children2 = targetPathes.sort(function(p1,p2){
                return p1.leftDistance-p2.leftDistance
            })
            children2 = children2.slice(0,topLength)
            
            children = children.concat(children2)
            
            //顺应环境基因改变
            var i,j
            var path
            var nextGeneration = []
            for(i=0;i<children.length;i++){
                path = children[i]
                //console.log("top children: ",i)
                //path.print()
                //maze.print(path.track)

                nextGeneration = nextGeneration.concat(genEliteChildren(path))  
            }

            // for(i=0;i<nextGeneration.length;i++){
            //     console.log("next elite generation: " ,i)
            //     nextGeneration[i].print()
            // }


            //杂交
            while(nextGeneration.length<PATH_NUMBER){
                i = Math.floor(Math.random()*targetPathes.length)
                while(true){
                    j = Math.floor(Math.random()*targetPathes.length)
                    if(i==j){
                        continue
                    }

                    break
                }

                nextGeneration.push(genPathViaExchangeGene(i,j))
            }
            
            if(reverse){
                reverse_pathes = nextGeneration
            } else{
                pathes = nextGeneration
            }
        }

        function genPathViaExchangeGene(i,j){
            var p1 = pathes[i]
            var p2 = pathes[j]

            //var pos = Math.floor(Math.random()*(PATH_LENGTH-2)+1)
            var pos = p1.step

            var p = new Path(maze.length)
            if(Math.abs(p1.walk[pos-1] - p2.walk[pos])==2){
                if(Math.abs(p1.walk[pos-1] - p2.walk[pos+1])==2){
                    p2.walk[pos] ++
                    if(p2.walk[pos]>3){
                        p2.walk[pos] = 0
                    }
                }else{
                    p2.walk[pos] = p2.walk[pos+1]
                }
            }
            p.walk = p1.walk.slice(0,pos).concat(p2.walk.slice(pos))
            return p
        }

    }
}

