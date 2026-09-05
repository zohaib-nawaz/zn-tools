function startsWithBytes(buffer: Buffer, signature: readonly number[]): boolean {
  if (buffer.length < signature.length) {
    return false;
  }

  return signature.every((byte, index) => buffer[index] === byte);
}

function asciiAt(buffer: Buffer, start: number, end: number): string {
  return buffer.toString("ascii", start, end);
}

export function hasAllowedImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) {
    return false;
  }

  if (startsWithBytes(buffer, [0xff, 0xd8, 0xff])) {
    return true;
  }

  if (startsWithBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return true;
  }

  if (startsWithBytes(buffer, [0x47, 0x49, 0x46, 0x38])) {
    return true;
  }

  if (asciiAt(buffer, 0, 4) === "RIFF" && asciiAt(buffer, 8, 12) === "WEBP") {
    return true;
  }

  if (
    startsWithBytes(buffer, [0x49, 0x49, 0x2a, 0x00]) ||
    startsWithBytes(buffer, [0x4d, 0x4d, 0x00, 0x2a])
  ) {
    return true;
  }

  if (asciiAt(buffer, 4, 8) === "ftyp") {
    const brand = asciiAt(buffer, 8, 12);
    return brand === "avif" || brand === "avis" || brand === "mif1";
  }

  return false;
}
