export const stripe = {
  charges: {
    // We will resolve this (Promise) with an empty object.
    create: jest.fn().mockResolvedValue({
      id: Date.now()
    })
  }
}

