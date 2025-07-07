for(var i=1;i<=100;i++){
    document.getElementById(i).innerHTML=i;
}
let turns = 0;
let players;

async function add_player() {

    for (let index = 0; index < 4; index++) {
        playername = window.prompt("Enter player name");
        const data = {name : playername}
        const url =  await fetch("http://localhost:8080/addplayer",{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await url.json();
        console.log(res)
    
    }
    getandupdatePlayers()
}

    async function getandupdatePlayers() {
        try {
            const response = await fetch("http://localhost:8080/getplayer");
            players = await response.json();
    
            if (Array.isArray(players) && players.length >= 4) {
                for (let index = 0; index < 4; index++) {
                    const playerDiv = `<div class="person" id="p${index + 1}">
                        <img
                          src="https://api.dicebear.com/9.x/adventurer/svg?seed=${players[index].name}"
                          alt="avatar" />
                        <span>${players[index].name}</span>
                      </div>`;
                  
                    document.getElementById("player1").innerHTML += playerDiv;
                  }
                  
    
            } else {
                console.error("Invalid data format or not enough players:", players);
            }
        } catch (error) {
            console.error("Error fetching players:", error);
        }
  
    }


    async function getPlayers() {
        try {
            const response = await fetch("http://localhost:8080/getplayer");
            players = await response.json();
    
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    return players;
    }

   async function rollDice() {
    var dice=['imgs/1.png','imgs/2.png','imgs/3.png','imgs/4.png','imgs/5.png','imgs/6.png'];
    const response = await fetch("http://localhost:8080/roll")
    const data = await response.json();
    document.getElementById('dice').src = dice[parseInt(data)-1]
    const audio = new Audio('diceRoll.mp3')
    audio.play()
    const p = await getPlayers()
   
    if (Array.isArray(p)) {
        const currentTurn = turns % p.length;
        movePlayer(p[currentTurn].name, parseInt(data))
        updatePosition(currentTurn)
        turns++
    }

   }

   async function movePlayer(name, position) {
    const url = `http://localhost:8080/move?name=${name}&newposition=${position}`
    await fetch(url , {
        method:'POST',
    })
   }
  


const previousPositions = {}

async function updatePosition(index) {
    const players = await getPlayers(); 
    const player = players[index];




    const previousPosition = previousPositions[player.name];
    if (previousPosition !== undefined) {
        const previousCell = document.getElementById(previousPosition);
        if (previousCell) {
            previousCell.innerHTML = previousPosition; 
        }
    }

    if (player.position > 0) {
        if (player.position == 100) {
            alert("Winner" + player.name)
            return;
        }
        const currentCell = document.getElementById(player.position);
        if (currentCell) {
            currentCell.innerHTML = player.name;

    
            const audio = new Audio("move.mp3");
            audio.play();
        }
    } else {
        alert("You are on zero");
    }


    previousPositions[player.name] = player.position;

    
    document.getElementById('turn').innerHTML = `
        <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=${player.name}" alt="avatar" />
        <span>${player.name}</span>`;
}

