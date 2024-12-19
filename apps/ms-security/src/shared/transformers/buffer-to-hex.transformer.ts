import { ValueTransformer } from 'typeorm';

export class BufferToHexTransformer implements ValueTransformer {
  to(value: string | null): Buffer | null {
    if (!value) return null;
    return Buffer.from(value.replace(/-/g, ''), 'hex');
  }

  from(value: Buffer | null): string | null {
    if (!value) return null;
    return value.toString('hex').toUpperCase();
  }
}
