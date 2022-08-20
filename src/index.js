import './css/styles.css';
import Notiflix from 'notiflix';
import API from './fetchImages';


const refs = {
    searchForm: document.querySelector('.search-form'),
    imageContainer: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

let searchQuery = '';
// let currentPage = 1;

async function onSearch(event) {
  event.preventDefault();

  searchQuery = event.currentTarget.elements.searchQuery.value;

  currentPage = 1;

  if (searchQuery === '') {
    clearImagesContainer();
    refs.loadMore.classList.add('is-hidden');
    return Notiflix.Notify.info(`Sorry, there are no images matching your search query. Please try again.`);
  }
  
  try {
    const images = await API.fetchImages(searchQuery, currentPage);

    if (images.totalHits > 40) {
      refs.loadMore.classList.remove('is-hidden');
    } else {
      refs.loadMore.classList.add('is-hidden');
    };

    if (images.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);

      clearImagesContainer();

      renderImagesCard(images.hits);

      const { height: cardHeight } = refs.imageContainer.firstElementChild.getBoundingClientRect();

      window.scrollBy({
      top: cardHeight * -100,
      behavior: "smooth",});
      
    } 

  } catch (error) { console.log(error) };
  
  }

async function onLoadMore() {
  currentPage += 1;

  const images = await API.fetchImages(searchQuery, currentPage);

  renderImagesCard(images.hits);
}



function renderImagesCard(images) {
  const markup = images
    .map(el => {
        return `<div class="photo-card">
  <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${el.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${el.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${el.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${el.downloads}
    </p>
  </div>
</div>`
    }).join('');
  
  refs.imageContainer.insertAdjacentHTML('beforeend', markup);
};

function clearImagesContainer() {
  refs.imageContainer.innerHTML = '';
}