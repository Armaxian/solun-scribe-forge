export type Platform = 'windows' | 'mac-intel' | 'mac-arm' | 'linux' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  architecture: 'x64' | 'arm64' | 'unknown';
  isMobile: boolean;
  userAgent: string;
}

export function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) {
    // Check for Apple Silicon (M1/M2/M3 chips)
    // Apple Silicon Macs have 'Mac OS X' and don't typically show 'Intel' in UA
    // We'll use a more sophisticated check
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('mac') && !ua.includes('intel')) {
      // Check if it's likely Apple Silicon by checking for modern macOS versions
      // and absence of Intel indicators
      return 'mac-arm';
    }
    return 'mac-intel';
  }
  if (ua.includes('linux')) return 'linux';

  return 'unknown';
}

export function getDetailedPlatformInfo(): PlatformInfo {
  const ua = navigator.userAgent;
  const platform = navigator.platform.toLowerCase();

  // Check for mobile devices
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());

  // Determine architecture
  let architecture: 'x64' | 'arm64' | 'unknown' = 'unknown';
  if (platform.includes('mac')) {
    // macOS - check for Apple Silicon vs Intel
    if (!ua.toLowerCase().includes('intel') && !platform.includes('intel')) {
      // Likely Apple Silicon (M1/M2/M3)
      architecture = 'arm64';
    } else {
      architecture = 'x64';
    }
  } else if (platform.includes('win')) {
    // Windows - most modern Windows are x64
    architecture = 'x64';
  } else if (platform.includes('linux')) {
    // Linux - could be either, but we'll default to x64
    // In a real implementation, you might want to check more specifically
    architecture = 'x64';
  }

  return {
    platform: detectPlatform(),
    architecture,
    isMobile,
    userAgent: ua
  };
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    windows: 'Windows',
    'mac-intel': 'macOS (Intel)',
    'mac-arm': 'macOS (Apple Silicon)',
    linux: 'Linux',
    unknown: 'Your Platform'
  };

  return labels[platform];
}

export function getRecommendedInstaller(platform: Platform): string {
  switch (platform) {
    case 'windows':
      return '.exe (Recommended)';
    case 'mac-intel':
      return '.dmg (Intel)';
    case 'mac-arm':
      return '.dmg (Apple Silicon)';
    case 'linux':
      return '.AppImage (Recommended)';
    default:
      return 'Download';
  }
}

export function getPlatformGuidance(platform: Platform): string {
  switch (platform) {
    case 'mac-intel':
      return 'This installer is optimized for Intel-based Macs. If you have an Apple Silicon Mac (M1/M2/M3), please download the Apple Silicon version instead.';
    case 'mac-arm':
      return 'This installer is optimized for Apple Silicon Macs (M1/M2/M3). If you have an Intel-based Mac, please download the Intel version instead.';
    case 'windows':
      return 'Choose .exe for a standard installation or .msi for enterprise deployment.';
    case 'linux':
      return 'AppImage works on most Linux distributions. .deb packages are available for Debian/Ubuntu-based systems.';
    default:
      return 'Please select the appropriate installer for your operating system.';
  }
}
