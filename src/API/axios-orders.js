import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-test-project-13170-default-rtdb.firebaseio.com/'
});

export default instance;