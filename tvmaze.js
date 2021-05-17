const searchForm = document.querySelector('#search-form');
const showsList = document.querySelector('#shows-list');
const episodesList = document.querySelector('#episodes-list');


async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  const results = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)

  const showList = results.data.map(showObj => {
    return {
      id: showObj.show.id,
      name: showObj.show.name,
      summary: showObj.show.summary,
      image: showObj.show.image ? showObj.show.image.medium : "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
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
             <button class="btn btn-primary episodes" data-id="${show.id}" type="button">Episodes</button>
           </div>
         </div>
      `;
    showsList.append(item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

searchForm.addEventListener("submit", async function handleSearch (evt) {
  evt.preventDefault();
  const input = document.querySelector('#search-query');
  let query = input.value.trim();
  if (!query) return;

  // $("#episodes-area").show();

  let shows = await searchShows(query);
  populateShows(shows);
  input.value = '';
});

// listen for episode button click inside each card.
showsList.addEventListener("click", async function handleButton (evt) {
  if(evt.target.type === 'button') {
    document.querySelector('#episodes-area').style.display = 'block'
    const id = evt.target.dataset.id;
    // showsList.querySelector(`[data-id="${evt.target.dataset.id}"]`);
    let episodes = await getEpisodes(id);
    populateEpisodes(episodes)
  }
});



/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const results = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodesList = results.data.map(episodeObj => {
    return { id: episodeObj.id, name: episodeObj.name, season: episodeObj.season, number: episodeObj.number }
  })

  // TODO: return array-of-episode-info, as described in docstring above
  return episodesList;
}

const populateEpisodes = (episodes) => {
  
  
  episodes.forEach(episode => {
    const item = document.createElement('li');
    item.innerHTML = `${episode.name} (season ${episode.season}, number ${episode.number})`;
    episodesList.append(item);
  });

  return episodesList;
}