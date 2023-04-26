document.addEventListener('DOMContentLoaded', () => {
    /**********************VARIABLES************************/
    const url = 'https://api-nba-v1.p.rapidapi.com/' // base url
    const options = { // get options
        method: 'GET',
        headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': 'cd31b3d6f5msh3ddc4783abc2071p1ae416jsn4958d92b9184',
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
    }
    const cardContainer = document.getElementById('card-container') // div containing all cards
    /**********************FUNCTIONS************************/
    function getPlayer (playerLastName) { // get request for player info
        return fetch(`${url}players?name=${playerLastName}`, options)
        .then(response => response.json())
        .then(response => {
            const players = response.response // setting const ‘players’ to array response
            cardContainer.innerHTML = '' // Clears out old player cards from previous search
            players.forEach(player => { // sends each player in the array to populatePlayers function
                populatePlayers(player)
                console.log(player)
            })
        })
        .catch(err => console.error(err))
    }
    function populatePlayers(player) { // renders player card on page
        /********************FUNCTION VARIABLES************************/
        const playerId = player.id // sets playerId to the id of the current player
        const season = document.getElementById('season').value // saves value of season text field to variable
        const playerCard = document.createElement('div') // player card
        playerCard.setAttribute('class', 'card') // sets id attribute of player card
        const playerName = document.createElement('h1') // creates player name element
        const playerJersey = document.createElement('h2') // creates player jersey no element
        const playerHeight = document.createElement('h4') // creates player height element
        const playerWeight = document.createElement('h4') // creates player weight element
        const playerCollege = document.createElement('h5') // creates player college element
        const playerTeam = document.createElement('h6') // creates player team element
        const teamLogoImg = document.createElement('img') // creates team logo image element
        const seasonLabel = document.createElement('p') // creates season label element
        seasonLabel.innerText = `${season} Season Totals:`
        const playerAssists = document.createElement('h4') // creates player assists element
        const playerPoints = document.createElement('h4') // creates player points element
        const addPlayerBtn = document.createElement('button') // button for adding player to personal collection
        addPlayerBtn.innerText = 'Add Player'
        addPlayerBtn.setAttribute('class', 'add-player-btn')
        addPlayerBtn.setAttribute('type', 'button')
        const personalCollectionDiv = document.getElementById('personal-collection')
        /**********POPULATING PLAYER INFO ELEMENTS************************/
        if (player.leagues.standard.active === true) { // filters only active players
            playerName.innerText = player.firstname + ' ' + player.lastname // populates player name element
            playerJersey.innerText = 'Jersey #:' + ' ' + player.leagues.standard.jersey // populates player jersey element
            playerHeight.innerText = 'Height:'  + ' ' + player.height.feets + 'ft' + ' ' + player.height.inches + 'in' // populates player height element
            playerWeight.innerText = 'Weight:' + ' ' + player.weight.pounds // populates player weight element
            playerCollege.innerText = 'College:' + ' ' + player.college // populates player college element
            /***************APPENDING PLAYER INFO ELEMENTS********************/
            playerCard.append( // appends all player info elements to player card
                playerName,
                playerJersey,
                playerHeight,
                playerWeight,
                playerCollege,
                playerTeam,
                teamLogoImg,
                seasonLabel,
                playerPoints,
                playerAssists,
                addPlayerBtn
            )
            cardContainer.append(playerCard) // appends player card to container div
        }
        fetch(`${url}players/statistics?id=${playerId}&season=${season}`, options) // get player statistics
        .then(response => response.json())
        .then(response => {
            const stats = response.response // saves response array into a variable
            const teamName = stats[0].team.name // pulls team nmae from array index 0
            const teamLogo = stats[0].team.logo // pulls team logo img url from array index 0
            console.log(stats)
            playerTeam.innerText = teamName // populates playerTeam var with team name
            teamLogoImg.src = teamLogo // sets img source for teamLogoImg
            // next two lines iterate array and add all assist values together
            const assistValues = stats.map(stats => stats.assists);
              const totalAssists = assistValues.reduce((total, value) => total + value, 0);
            //next two lines iterate array and add all points values together
            const pointsValues = stats.map(stats => stats.points);
              const totalPoints = pointsValues.reduce((total, value) => total + value, 0);
            playerPoints.innerText = 'Points:' + ' ' + totalPoints // sets player points to sum of all points in season
            playerAssists.innerText = 'Assists:' + ' ' + totalAssists // sets player assists to sum of all assists in season
        })
        .catch(err => console.error(err))
        addPlayerBtn.addEventListener('click', (e) =>{
            e.preventDefault()
            console.log('YESSS')
            personalCollectionDiv.append(playerCard)
        })
    }
    /***********************EVENT LISTENERS*************************/
    // event listener for from submission
    document.getElementById('player-search').addEventListener("submit", (e) => {
        e.preventDefault(e)
        let playerLastName = document.getElementById('player-name').value // saves value of player input to var
        getPlayer(playerLastName) // invokes function with playerLastName
    })
})