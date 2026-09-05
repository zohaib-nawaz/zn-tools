export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatSavings(originalBytes: number, optimizedBytes: number): string {
  if (originalBytes <= 0) {
    return "0%";
  }

  const delta = ((originalBytes - optimizedBytes) / originalBytes) * 100;

  if (Math.abs(delta) < 0.5) {
    return "Same size";
  }

  if (delta > 0) {
    return `${Math.round(delta)}% smaller`;
  }

  return `${Math.round(Math.abs(delta))}% larger`;
}
