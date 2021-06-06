import  axios from 'axios';


const BASE_URL_API = "https://api.mathjs.org/v4"
const client = axios.create({
  baseURL : BASE_URL_API
})

export const calculate = (premier, second, operator) => 
    client.get('/?expr=2%2B3')
