// We are mimicking the NATS Client object
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject: string,data: string,callback:Function) => {
  
    })
  }
}