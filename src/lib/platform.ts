export type Platform = 'windows' | 'mac' | 'linux' | 'unknown';

export function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  
  return 'unknown';
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    windows: 'Windows',
    mac: 'macOS',
    linux: 'Linux',
    unknown: 'Your Platform'
  };
  
  return labels[platform];
}
