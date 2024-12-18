import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BufferToHexInterceptor implements NestInterceptor {
  private isBufferLikeObject(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;

    // Check if it's a Buffer-like object with numeric keys
    const keys = Object.keys(obj);
    if (keys.length === 0) return false;

    return keys.every((key) => {
      const numKey = parseInt(key, 10);
      return (
        !isNaN(numKey) &&
        typeof obj[key] === 'number' &&
        obj[key] >= 0 &&
        obj[key] <= 255
      );
    });
  }

  private convertBufferToHex(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertBufferToHex(item));
    }

    if (typeof obj === 'object') {
      // Handle Buffer type objects
      if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return Buffer.from(obj.data).toString('hex').toUpperCase();
      }

      // Handle objects with numeric keys that represent buffer data
      if (this.isBufferLikeObject(obj)) {
        const values = Object.values(obj);
        return Buffer.from(values as number[])
          .toString('hex')
          .toUpperCase();
      }

      const result = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = this.convertBufferToHex(obj[key]);
        }
      }
      return result;
    }

    return obj;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.convertBufferToHex(data)));
  }
}
