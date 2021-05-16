const searchForm = document.querySelector('#search-form');
const episodes = document.querySelector('#episodes-list');
const showsList = document.querySelector('#shows-list');


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
  // showsList.empty();

  for (let show of shows) {
    const item = document.createElement('div');
    item.setAttribute('class', 'col-md-6 col-lg-3 Show')
    item.innerHTML = 
      `<div class="Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary episodes" type="button">Episodes</button>
           </div>
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
  console.log(evt)
  const input = document.querySelector('#search-query');
  let query = input.value.trim();
  if (!query) return;

  // $("#episodes-area").show();

  let shows = await searchShows(query);
  populateShows(shows);
  input.value = '';
});

// listen for episode button click inside each card.
showsList.addEventListener("click",  evt => {
  if(evt.target.type === 'button') {
    
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
  const episodesList = document.querySelector('#episodes-list');
  const episode = document.createElement('li');
  episode.innerHTML = `${episodes.name} (season ${episodes.season}, number ${episodes.number})`
  episodesList.append(episode);
}