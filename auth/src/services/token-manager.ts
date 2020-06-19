import jwt from 'jsonwebtoken';

export default class TokenManager {

  static async generateToken(user: any): Promise<string> {
    const userJWT = await jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY || ''
    );


    return userJWT;
  }

  static async getPayloadIfVerified(token: string): Promise<any> {

    // Verify throw's an error.
    try {
      const payload = await jwt.verify(token, process.env.JWT_KEY || '');
      return payload;
    } catch(e) {
      return null;
    }
    
  }
}
