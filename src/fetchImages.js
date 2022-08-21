import axios from "axios";
import Notiflix from "notiflix";


const BASE_URL = 'https://pixabay.com/api/';


async function fetchImages(query, page) {
    console.log({ query, page });
    const parameters = `?key=29384510-d3fd293ec4cac87d919319a0f&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    return await axios.get(`${BASE_URL}${parameters}`)
        .then(response => response.data);
}

export default { fetchImages };