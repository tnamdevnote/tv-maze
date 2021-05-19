const searchForm = document.querySelector('#search-form');
const showsList = document.querySelector('#shows-list');
const episodesList = document.querySelector('#episodes-list');
const episodesModal = document.querySelector('#episodesModal');


const searchShows = async (query) => {
  // TODO: Make an ajax request to the searchShows api.  Remove
  const results = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`)

  const showList = results.data.map(showObj => {
    return {
      id: showObj.show.id,
      name: showObj.show.name,
      summary: showObj.show.summary,
      image: showObj.show.image ? showObj.show.image.medium : "http://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
    };
  })
  
  return showList;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
const populateShows = (shows) => {

  for (let show of shows) {
    const item = document.createElement('div');
    item.setAttribute('class', `col-md-6 col-lg-3`)
    item.innerHTML = `
         <div class="card" data-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-primary episodes" data-id="${show.id}" data-bs-toggle="modal" data-bs-target="#episodesModal">Episodes</button>
           </div>
         </div>
      `;
    showsList.append(item);
  }
}

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
 const getEpisodes = async (id) => {
  // TODO: get episodes from tvmaze
  const results = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = results.data.map(episodeObj => {
    return { id: episodeObj.id, name: episodeObj.name, season: episodeObj.season, number: episodeObj.number }
  })

  // TODO: return array-of-episode-info, as described in docstring above
  return episodes;
}

// populate each episode as a list element inside the #episodes-list.
const populateEpisodes = (episodes) => {
  episodes.forEach(episode => {
    const item = document.createElement('li');
    item.innerHTML = `${episode.name} (season ${episode.season}, number ${episode.number})`;
    episodesList.append(item);
  });
}


/** Handle search form submission:
 *    - get list of matching shows and show in shows list
 */
searchForm.addEventListener("submit", onSearch = async evt => {
  evt.preventDefault();
  const input = document.querySelector('#search-query');
  let query = input.value.trim();
  if (!query) return;

  showsList.innerHTML = '';
  let shows = await searchShows(query);
  populateShows(shows);
  input.value = '';
});

// listen for episode button click inside each card.
showsList.addEventListener("click", onClick = async evt => {
  if(evt.target.type === 'button') {
    const id = evt.target.dataset.id;;
    let episodes = await getEpisodes(id);
    populateEpisodes(episodes)
  }
});

// When the modal is closed, empty the list. 
episodesModal.addEventListener('click', onClick = evt => {
  if(evt.target.type === 'button' || evt.target === episodesModal) {
    episodesList.innerHTML = '';
  }
})

