import { OAuth2Strategy } from './oauth2strategy.interface';

export class GoogleAuthentication implements OAuth2Strategy{

  login(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  callback(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  
}
 
export default new GoogleAuthentication();
