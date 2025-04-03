const gameOverContainer = document.getElementById('game-over')
const scoreBoard = document.getElementById('score')

const fruitImg = [
    "./assets/apple.png",
    "./assets/banana.png",
    "./assets/cherry.png",
    "./assets/grape.png",
    "./assets/green.png",
    "./assets/lemon.png",
    "./assets/mango.png",
    "./assets/melon.png",
    "./assets/orange.png",
    "./assets/purple.png",
    "./assets/strawberry.png",
    "./assets/yellow.png",
]
let fruitIndex = 0


let score = 0
let highScore = 0

let snake = []
let lastDirection = ''
let direction = ''


let tailDirectionArray = []
let tailDirection = ''


let isFruit = false
let fruit = []
let fruitBody = null;
let didAte = false


const getScoreFromStorage = () => {
    highScore = JSON.parse(localStorage.getItem('highScore'))
    document.getElementById('high-score').innerText = 0

    if (highScore) {
        document.getElementById('high-score').innerText = highScore
    }
}
getScoreFromStorage()

const setHighScore = (score) => {
    const saveScore = JSON.stringify(score)
    localStorage.setItem('highScore', saveScore)
    getScoreFromStorage()
}


const generateFruit = () => {
    let i;
    let j;
    i = Math.round(Math.random() * 19)
    j = Math.round(Math.random() * 19)
    fruit = [i, j]

    while (snake.toString().indexOf((fruit.toString())) > -1) {
        i = Math.round(Math.random() * 19)
        j = Math.round(Math.random() * 19)
        fruit = [i, j]
    }

    fruitBody = document.querySelector(`[i="${fruit[0]}"][j="${fruit[1]}"] .bg-violet-400`)

    // const fruitIndex = Math.round(Math.random()*12)
    fruitBody.innerHTML = `<img class="absolute top-0 p-[1px] -z-1" src=${fruitImg[fruitIndex]}></img>`
    if (fruitIndex == 11) {
        fruitIndex = 0
    } else {
        fruitIndex++
    }
}


// generate game field 
const container = document.getElementById('container')
const buildField = () => {
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            const div = document.createElement('div')
            div.setAttribute('i', i)
            div.setAttribute('j', j)
            div.classList.add('box', 'relative', 'z-1')

            const innerDiv = document.createElement('div')
            innerDiv.classList.add('bg-violet-400', 'z-10')

            div.appendChild(innerDiv)
            container.appendChild(div)
        }
    }
}

const snakeBody = (head = []) => {
    snake.forEach((cell, index) => {
        const [i, j, isHead] = cell
        const body = document.querySelector(`[i="${i}"][j="${j}"]`)
        body.classList.add("body")
        if (isHead || (head[0] === cell[0] && head[1] === cell[1])) {
            body.classList.remove('body')
            body.classList.add('head')
        } else {
            body.classList.add('body')
            body.classList.remove('head')
        }

        body.classList.remove('lastHead')
        if (index === 1) body.classList.add('lastHead')


        body.classList.remove('rotate-0', 'rotate-90', 'rotate-180', 'rotate-270')
        if (index === 0 || index === 1) {
            switch (lastDirection) {
                case 'l':
                    body.classList.add('rotate-90')
                    break
                case 'r':
                    body.classList.add('rotate-270')
                    break
                case 'u':
                    body.classList.add('rotate-180')
                    break
                case 'd':
                    body.classList.add('rotate-0')
                    break
            }
        }


        // tail animation should be dynamic \
        body.classList.remove('tail')
        if (index === snake.length - 1) {
            if (tailDirectionArray.length) {
                if (cell.slice(0, 2) == tailDirectionArray[0].slice(0, 2).toString()) {
                    tailDirection = tailDirectionArray[0][2]
                    tailDirectionArray.shift()
                }
            }

            body.classList.remove('body')
            body.classList.add('tail')

            switch (tailDirection) {
                case 'l':
                    body.classList.add('rotate-270')
                    break
                case 'r':
                    body.classList.add('rotate-90')
                    break
                case 'u':
                    body.classList.add('rotate-0')
                    break
                case 'd':
                    body.classList.add('rotate-180')
                    break
            }

        }
    })
}



// remove class  for tail 
const removeClass = (cell) => {
    const [i, j, isHead] = cell
    const body = document.querySelector(`[i="${i}"][j="${j}"]`)
    body.classList.remove("body")
    body.classList.remove("head")
}

// handle direction onClick

const setDirection = (d) => {
    direction = d
    // console.log(snake)
}

let isStop = false
const gameOver = () => {
    if (score > highScore) setHighScore(score)
    score = 0
    document.getElementById('score').innerText = score
    const head = document.querySelector('.head')
    head.classList.add('deadHead')
    gameOverContainer.classList.remove('hidden')
    isStop = true
}



const startGame = (direction) => {
    if (!didAte) removeClass(snake.pop())
    snake[0].pop()

    // choose direction 
    if (direction === 'l' && lastDirection === 'r') direction = 'r'
    if (direction === 'r' && lastDirection === 'l') direction = 'l'
    if (direction === 'u' && lastDirection === 'd') direction = 'd'
    if (direction === 'd' && lastDirection === 'u') direction = 'u'


    let head = Array.from(snake[0])


    if (direction !== lastDirection) {
        tailDirectionArray.push([...head, direction])
    }

    // create head and control movement 

    if (direction === 'r') {
        head[1]++
    }
    else if (direction === 'l') {
        head[1]--
    }
    else if (direction === 'u') {
        head[0]--
    }
    else if (direction === 'd') {
        head[0]++
    }
    lastDirection = direction


    if (didAte) {
        const innerDiv = document.createElement('div')
        innerDiv.classList.add('bg-violet-400', 'z-10')
        fruitBody.innerHTML = null
        fruitBody.appendChild(innerDiv)
        didAte = false
        isFruit = false
    }

    if (head.toString() == fruit.toString()) {
        didAte = true
        score++
        scoreBoard.innerText = score
    }


    snake.forEach(array => {
        if (array.toString() == head.toString()) {
            gameOver()
            return
        }
    })


    if (head[0] < 0 || head[0] > 19 || head[1] < 0 || head[1] > 19) {
        gameOver()
        return
    }

    if (isStop) {
        return
    }

    head.push(true)
    snake.unshift(head)
    snakeBody(head)


    if (!isFruit) {
        isFruit = true
        generateFruit()
    }
}

// updateBody(direction)

let speed = 500
let startID;
const start = () => {
    startID = setInterval(() => {
        startGame(direction)
    }, speed);
}

setInterval(() => {
    if (isStop) {
        clearInterval(startID)
    }
}, 0);

const restart = () => {
    container.innerHTML = ``
    buildField()
    isStop = false
    gameOverContainer.classList.add('hidden')
    direction = 'r'
    lastDirection = 'r'
    tailDirection = 'r'
    snake = [[0, 6, true], [0, 5], [0, 4], [0, 3]]
    tailDirectionArray = []
    snakeBody()
    start()

    isFruit = false
}
restart()
