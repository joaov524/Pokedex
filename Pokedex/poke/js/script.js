const pokecontainer = document.querySelector("#pokeContainer")
const pokemonCount = 251
const colors = {
    fire: '#FF6961',
    grass: '#98d7a5',
    electric: '#fdfd96',
    water: '#add8e6',
    ground: '#b38b6d',
    rock: '#d5d5d4',
    fairy: '#ffb6c1',
    poison: '#b19cd9',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#ffcbdb',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#d3d3d3'
}

const maintypes = Object.keys(colors);

const FetchPokemons = async () => {
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i)
    }
}

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const resp = await fetch(url)
    const data = await resp.json()
    pokecard(data)
}

const pokecard = (poke) => {
    const card = document.createElement('div')
    card.classList.add("pokemon")

    const name = poke.name[0].toUpperCase() + poke.name.slice(1)
    const id = poke.id.toString().padStart(3, '0')

    const poketypes = poke.types.map(type => type.type.name)
    const type = maintypes.find(type => poketypes.indexOf(type) > -1)
    const color = colors[type]

    card.style.backgroundColor = color

    const pokemonInnerHTML = `
        <div class="img">
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
             </div>
             <div class="info">
                 <span class="number">#${id}</span>
                 <h3 class="name">${name}</h3>
                    <span class="type">type: <span>${type}</span></span>
              </div>
`
    card.innerHTML = pokemonInnerHTML

    pokeContainer.appendChild(card)
}

FetchPokemons()


const BASEURL = "https://pokeapi.co/api/v2/pokemon/"

document.addEventListener("DOMContentLoaded", getPokemonList)

function getPokemonList() {
    fetch(BASEURL + '?limit=251')
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(data => {
            data.results.forEach(pokemon => {
                displayPokemon(pokemon)
            });
        })
        .catch(error => console.error(error))
}

function getPokemonDetails(id) {
    if (id <= 251) {
        const url = `${BASEURL}${id}/`
        return fetch(url)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } 
            });
    } else {
        alert ("ID inválido ( 1 - 251 ) ")
    }
}

function showPokemonDetails(id) {
    getPokemonDetails(id)
        .then(pokemon => {
            showPokemonDetailsModal(pokemon)
        });
}

function showPokemonByIdPrompt() {
    const pokemonId = prompt("Digite o ID do Pokémon:")
    if (pokemonId) {
        showPokemonDetails(pokemonId);
    }
}
function displayPokemon(pokemon) {
    let liPokemon = document.createElement("li")
    let liPokemonImg = document.createElement("img")

    const pokemonId = pokemon.url.split('/')[6];
    liPokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    liPokemon.innerHTML = `${pokemon.name} - ${pokemonId}`

    liPokemon.setAttribute('data-pokemon-id', pokemonId)
    liPokemonImg.addEventListener("click", function () {
        const clickedPokemonId = this.parentNode.getAttribute('data-pokemon-id')
        addToTeam(clickedPokemonId)
    });

    const detailsButton = document.createElement("button")
    detailsButton.textContent = "Detalhes"
    detailsButton.addEventListener("click", function () {
        const clickedPokemonId = this.parentNode.getAttribute('data-pokemon-id');
        showPokemonDetails(clickedPokemonId)
    });

    liPokemon.appendChild(liPokemonImg)
    liPokemon.appendChild(detailsButton)

    document.getElementById("ListaPokemons").appendChild(liPokemon)
}



function showPokemonDetailsModal(pokemon) {
    const modalContent = document.getElementById("modalContent")
    modalContent.innerHTML = `<h2 id="pokemonName">${pokemon.name}</h2>`

    
    const detailsContainer = document.createElement("div")
    detailsContainer.id = "pokemonDetails"
    detailsContainer.innerHTML = `
        <div class="pokemon-details-inner">
            <img src="${pokemon.sprites.front_default}" alt="Imagem de ${pokemon.name}" class="pokemon-image">
            <div class="details-text">
                <strong>Nome:</strong> ${pokemon.species.name}
                <strong>Tipo:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}<br>
                <strong>Altura:</strong> ${pokemon.height / 10} m<br>
                <strong>Peso:</strong> ${pokemon.weight / 10} kg<br>
            </div>
        </div>
    `
    modalContent.appendChild(detailsContainer)

    const addToTeamButton = document.createElement("button")
    addToTeamButton.id = "addToTeamButton"
    addToTeamButton.textContent = "Sair da tela"
    addToTeamButton.addEventListener("click", function () {
        closeModal()
        addToTeam(pokemon.id)
    });
    modalContent.appendChild(addToTeamButton)

    const modal = document.getElementById("pokemonModal")
    modal.style.display = "block"
}

function closeModal() {
    const modal = document.getElementById("pokemonModal")
    modal.style.display = "none"
}

function addToTeam(pokemonId) {
    const teamList = document.getElementById("capturedPokemonList");
    const currentTeamSize = teamList.children.length;
    if (currentTeamSize < 6) {
        const existingPokemon = teamList.querySelector(`[data-pokemon-id="${pokemonId}"]`);

        if (existingPokemon) {
            removeFromTeam(pokemonId);
        } else {
            const teamPokemon = document.createElement("li");
            const teamPokemonImg = document.createElement("img");

            teamPokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            teamPokemon.textContent = `ID: ${pokemonId}`;

            teamPokemon.setAttribute('data-pokemon-id', pokemonId);
            teamPokemon.addEventListener("click", function () {
                const clickedPokemonId = this.getAttribute('data-pokemon-id');
                removeFromTeam(clickedPokemonId);
            });

            teamPokemon.appendChild(teamPokemonImg);
            teamList.appendChild(teamPokemon);
        }
    } else {
        alert("Suas pokebolas acabaram.");
    }
}
function removeFromTeam(pokemonId) {
    const teamList = document.getElementById("capturedPokemonList")
    const teamPokemon = document.querySelector(`#capturedPokemonList [data-pokemon-id="${pokemonId}"]`)

    if (teamPokemon) {
        teamList.removeChild(teamPokemon)
    }
}

function showPokemonList() {
    document.getElementById("pokemonDetails").innerHTML = ""

    fetch(BASEURL + '?limit=251')
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(data => {
            document.getElementById("ListaPokemons").innerHTML = ""

            data.results.forEach(pokemon => {
                displayPokemon(pokemon)
            })
        })
}