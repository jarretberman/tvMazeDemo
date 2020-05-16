/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const shows = await axios.get("http://api.tvmaze.com/search/shows", {params:{q:query}})
  console.log(shows.data)
  
  return shows.data
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) { //data-toggle="modal" data-target="#episodeModal"
  const $sum = $(`${show.show.summary}`)
  $sum
    .addClass('card-text h-25')
  let $item = $(
      `<div class="col-xl-6 h-50" data-show-id="${show.show.id}">
         <div class="card m-1 border-0 rounded" data-show-id="${show.show.id}">
           <div class="card-body bg-dark text-light rounded">
             <h5 class="card-title">${show.show.name}</h5>
             <img class = "card-image-bottom w-50" src =${show.show.image.original}>
             <hr><div id ="sum-${show.show.id}"></div>
             <button type="button" class="btn btn-primary" id ='show-${show.show.id}' data-show-id = ${show.show.id} >
             Episodes
             </button>
           </div>
         </div>
       </div>
      `);
    
    $showsList.append($item);
    $(`#sum-${show.show.id}`).append($sum)
    $(`#show-${show.show.id}`).on('click', async () => {
      
      const episodes = await getEpisodes(show.show.id)
      appendEpisodes(episodes)
      $('#episodeModal').modal()
      // return console.log(episodes)
    })
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const eps = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  console.log(eps)
  return eps.data

  // TODO: return array-of-episode-info, as described in docstring above
}

const appendEpisodes = (arr) => {
  const $modal = $('.modal-body')
  const $list = $('<ol>')
  $modal.empty()
  
  for (episode in arr){
    const info = arr[episode]
    $list.append($(`<li>
        <h5>${info.name}</h5>
        <p> Air Date : ${info.airdate}</p>
        <p>${info.summary}</p>
       </li>`))
  }
  $modal.append($list)
}