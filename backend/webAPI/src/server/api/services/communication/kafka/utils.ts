import crypto from 'crypto';

export class Utils {
  hash(data: any): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}

export default new Utils();
