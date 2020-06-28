import nats, {Stan} from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;


  get client():Stan {
    if (!this._client) {
      throw new Error('Cannot access NATS Client before it is connected');
    } 

    return this._client;
  }
  
  // Will be called inside index.ts
  connect(clusterId: string, clientId: string, url: string) {
    
    return new Promise((resolve, reject) => {
      this._client = nats.connect(clusterId, clientId, {url});
      this._client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      })

      this._client.on('error', (err) => {
        reject(err);
      })
    })
    
  }
}

export const natsWrapper = new NatsWrapper();