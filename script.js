document.addEventListener('DOMContentLoaded', () => {
    
    /********************************VARIABLES**********************************/
    const url = 'https://api-nba-v1.p.rapidapi.com/' // base url
    const options = { // get options
        method: 'GET',
        headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': apiKEY,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
    }
    
    const cardContainer = document.getElementById('card-container') // div containing all cards
    const personalCollectionDiv = document.getElementById('personal-collection') // variable for personal collection div
    
    
    /**********************FUNCTIONS************************/
    //try outside of function to play with possibiity
    function getPlayer (playerLastName) { // get request for player info
        return fetch(`${url}players?name=${playerLastName}`, options)
        .then(resp => resp.json())
        .then(resp => {
            const playersArray = resp.response // setting const ‘players’ to array response
            cardContainer.innerHTML = '' // Clears out old player cards from previous search
            playersArray.forEach(player => { // sends each player in the array to populatePlayers function
                populatePlayers(player)
                console.log(player)
            })
        })
        .catch(err => console.error(err))
    }
    let forGetandPost = false;

    function populatePlayers(player) { // renders player card on page
        const playerId = player.id // sets playerId to the id of the current player
        const season = document.getElementById('season').value // saves value of season text field to variable
        const seasonLabel = document.createElement('p') // creates season label element
        seasonLabel.innerText = `${season} Season Totals:`
        const playerCard = document.createElement('div') // player card
        playerCard.setAttribute('class', 'card') // sets id attribute of player card
        const playerName = document.createElement('h1') // creates player name element
        const playerJersey = document.createElement('h2') // creates player jersey no element
        const playerHeight = document.createElement('h4') // creates player height element
        const playerWeight = document.createElement('h4') // creates player weight element
        const playerCollege = document.createElement('h5') // creates player college element
        const playerTeam = document.createElement('h6') // creates player team element
        const teamLogoImg = document.createElement('img') // creates team logo image element
        const playerAssists = document.createElement('h4') // creates player assists element
        const playerPoints = document.createElement('h4') // creates player points element
        const addPlayerBtn = document.createElement('button') // button for adding player to personal collection
        addPlayerBtn.innerText = 'Add Player' // sets text content of addPlayerBtn
        addPlayerBtn.setAttribute('class', 'add-player-btn') // assigns class to add player button for styling
        addPlayerBtn.setAttribute('type', 'button') // sets type attribute for add player button
        
        
        
        /****************POPULATING PLAYER INFO ELEMENTS************************/
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

        // get player statistics
        fetch(`${url}players/statistics?id=${playerId}&season=${season}`, options) //whole line is url and options is input along with playerId & season pos starts
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
            
            //event listener for add player button
            addPlayerBtn.addEventListener('click', (e) => {//serach button event listener
                 e.preventDefault()
                addPlayerBtn.remove()
                playerCard.remove() // removes add player button on click 
                // POST to add card to JSON
                fetch(`http://localhost:3000/cards`, {//post method
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: player.firstname + ' ' + player.lastname,
                        jersey: player.leagues.standard.jersey,
                        height: player.height.feets + ' ' + player.height.inches,
                        weight: player.weight.pounds,
                        college: player.college,
                        img: teamLogo,
                        assists: totalAssists,
                        points: totalPoints,
                        season: season,
                        comment : ''
                    })  
                })
                .then(() => { //.then to intialize first card
                    forGetandPost = true
                    console.log(forGetandPost)
                    if (forGetandPost === true) {
                        getFromJson()
                        forGetandPost = false
                    }
                })
            })
        })
        .catch(err => console.error(err))
    }


        function getFromJson() {fetch ('http://localhost:3000/cards')//intial get for delete 
        .then(resp => resp.json())
        .then(player => {
            console.log(player)
            populatePersonalCollection(player)
        })}
            
    function populatePersonalCollection (player) {//delete function with constants
            personalCollectionDiv.innerHTML = ''
            player.forEach(player => {
            const playerCard = document.createElement('div') // player card
            playerCard.setAttribute('class', 'card') // sets id attribute of player card
            const playerName = document.createElement('h1') // creates player name element
            const playerJersey = document.createElement('h2') // creates player jersey no element
            const playerHeight = document.createElement('h4') // creates player height element
            const playerWeight = document.createElement('h4') // creates player weight element
            const playerCollege = document.createElement('h5') // creates player college element
            const playerTeam = document.createElement('h6') // creates player team element
            const teamLogoImg = document.createElement('img') // creates team logo image element
            const playerAssists = document.createElement('h4') // creates player assists element
            const playerPoints = document.createElement('h4') // creates player points element
            const deletePlayerBtn = document.createElement('button') // creates delete button for player card   
            const seasonLabel = document.createElement('p') // creates season label element
            const commentField = document.createElement('input')//creating commentFiled
            commentField.setAttribute('type', 'text')
            commentField.setAttribute('placeholder', "add comment")
            const commentSubmit =  document.createElement('button')
            commentSubmit.setAttribute('type', 'submit')
            commentSubmit.innerText = 'Submit comment'
            const commentP =  document.createElement('p')
            commentP.textContent = player.comment 
            

            deletePlayerBtn.innerText = 'Delete Player' // sets text content of delete button


            playerName.innerText = player.name // populates player name element
            playerJersey.innerText = 'Jersey #:' + ' ' + player.jersey // populates player jersey element
            playerHeight.innerText = 'Height:'  + ' ' + player.height // populates player height element
            playerWeight.innerText = 'Weight:' + ' ' + player.weight // populates player weight element
            playerCollege.innerText = 'College:' + ' ' + player.college // populates player college element
            teamLogoImg.src = player.img
            playerAssists.innerText = 'Assists:' + ' ' + player.assists
            playerPoints.innerText = 'Points:' + ' ' + player.points
            seasonLabel.innerText = player.season + ' ' + 'Season Totals:'
            
            commentSubmit.addEventListener('click', (e) => {
                e.preventDefault()
                let commentValue = commentField.value
                console.log(commentValue)
                commentP.textContent = commentValue
                fetch(`http://localhost:3000/cards/${player.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type' : 'application/json', 
                        'Accept' : 'application/json'
                    } ,
                    body: JSON.stringify({
                        'comment' : commentValue
                    }) 
                })//clean button after use 
               
            })
            
            /***************APPENDING PLAYER INFO ELEMENTS********************/
            playerCard.append( // appends all player info elements to player card
                commentP,
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
                deletePlayerBtn,
                commentField,
                commentSubmit

            )


            personalCollectionDiv.append(playerCard)
                
            
                deletePlayerBtn.addEventListener('click', e => {
                    e.preventDefault()
                    //DELETE request 
                    fetch(`http://localhost:3000/cards/${player.id}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },    
                    })
                    playerCard.remove() 
                })
            })}
    /***********************EVENT LISTENERS*************************/
    // event listener for from submission
    document.getElementById('player-search').addEventListener("submit", (e) => {
        e.preventDefault(e)
        let playerLastName = document.getElementById('player-name').value // saves value of player input to var
        getPlayer(playerLastName) // invokes function with playerLastName
    })

    //create patch with url, id in url, add to eventlistener 
    

    getFromJson()
})
/* Still needs a post and delete request to the db.json. post will replace line 99 and post the data to db.json. Another function is needed to get from the db.json and post to the personal collection div*/