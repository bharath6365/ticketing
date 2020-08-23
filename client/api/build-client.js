import axios from 'axios';

const buildClient = ({req}) => {
  if (typeof window !== 'undefined') {
      return axios.create({
        baseURL: '/'
      })
    } else {
      return axios.create({
        // Todo: Move this to a env variable.
        baseURL: 'http://www.ticket-sell.xyz/',
        // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/',
        headers: req.headers
      })
    }
}

export default buildClient;