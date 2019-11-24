import axios from 'axios';
var instance = axios.create({
      baseURL: 'https://api.spoonacular.com/recipes/complexSearch'
});
export default instance;