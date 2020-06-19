// This file is responsible for hashing and comparing hashed passwords.
import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

 class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');

    // Scrypt returns a buffer.
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    
    // Salt is part of the stored hash.
    return `${buffer.toString('hex')}.${salt}`;
  }
  
  static async compare(storedPasswordInDB: string, suppliedPassword: string) {
    // We don't need to compare the salt. Just to retreive it.
    const [hashedPassword, salt]= storedPasswordInDB.split('.');

    const suppliedBuffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return suppliedBuffer.toString('hex') === hashedPassword;

  }
}

export default Password;