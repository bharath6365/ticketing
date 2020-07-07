import axios from 'axios';

export default ({req}) => {
  if (typeof window !== 'undefined') {
      return axios.create({
        baseURL: '/'
      })
    } else {
      return axios.create({
        // Todo: Move this to a env variable.
        baseURL: 'http://www.ticket-sell.xyz/',
        headers: req.headers
      })
    }
}