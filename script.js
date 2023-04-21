const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'cd31b3d6f5msh3ddc4783abc2071p1ae416jsn4958d92b9184',
		'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
	}
};

fetch('https://api-nba-v1.p.rapidapi.com/seasons', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));