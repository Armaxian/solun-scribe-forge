/**
 * Release configuration system for download URLs and SHA256 hashes
 * 
 * This configuration can be:
 * 1. Loaded from environment variables (for CI/CD automation)
 * 2. Overridden via a JSON file (for manual updates)
 * 3. Extended in the future for automated CI uploads
 * 
 * @see ENV_SETUP.md for environment variable configuration
 */

export type Platform = 'windows' | 'mac-intel' | 'mac-arm' | 'linux';

export interface ReleaseInfo {
  /** Download URL - if undefined, platform is not available yet */
  downloadUrl?: string;
  /** SHA256 hash of the file (64 hex characters, no 'sha256:' prefix) */
  sha256?: string;
  /** File size estimate (e.g., "~192 MB") */
  size?: string;
  /** Whether this is the recommended installer for the platform */
  recommended?: boolean;
  /** Signature information */
  signature?: string;
  /** Description of the installer */
  description?: string;
}

export interface PlatformRelease {
  platform: Platform;
  installers: ReleaseInfo[];
}

/**
 * Get release configuration from environment variables
 * Environment variables follow the pattern:
 * - VITE_RELEASE_WINDOWS_URL, VITE_RELEASE_WINDOWS_SHA256
 * - VITE_RELEASE_MAC_INTEL_URL, VITE_RELEASE_MAC_INTEL_SHA256
 * - VITE_RELEASE_MAC_ARM_URL, VITE_RELEASE_MAC_ARM_SHA256
 * - VITE_RELEASE_LINUX_URL, VITE_RELEASE_LINUX_SHA256
 * 
 * TODO: Future CI automation should:
 * 1. Automatically calculate SHA256 after build
 * 2. Upload artifacts to release storage (GitHub Releases, S3, etc.)
 * 3. Update environment variables or JSON config via API
 * 4. Trigger deployment after successful upload
 */
function getReleaseConfigFromEnv(): Partial<Record<Platform, ReleaseInfo[]>> {
  const config: Partial<Record<Platform, ReleaseInfo[]>> = {};

  // Windows
  const windowsUrl = import.meta.env.VITE_RELEASE_WINDOWS_URL;
  const windowsSha256 = import.meta.env.VITE_RELEASE_WINDOWS_SHA256;
  if (windowsUrl && windowsSha256) {
    config.windows = [{
      downloadUrl: windowsUrl,
      sha256: windowsSha256.replace(/^sha256:/i, ''), // Remove prefix if present
      size: import.meta.env.VITE_RELEASE_WINDOWS_SIZE || "~192 MB",
      recommended: true,
      signature: "Code signed by Solun Technologies Pty Ltd",
      description: "Standard installer with auto-updater",
    }];
  }

  // Mac Intel
  const macIntelUrl = import.meta.env.VITE_RELEASE_MAC_INTEL_URL;
  const macIntelSha256 = import.meta.env.VITE_RELEASE_MAC_INTEL_SHA256;
  if (macIntelUrl && macIntelSha256) {
    config['mac-intel'] = [{
      downloadUrl: macIntelUrl,
      sha256: macIntelSha256.replace(/^sha256:/i, ''),
      size: import.meta.env.VITE_RELEASE_MAC_INTEL_SIZE || "~80 MB",
      recommended: true,
      signature: "Developer ID signed and notarized by Apple",
      description: "Optimized for Intel-based Macs",
    }];
  }

  // Mac ARM
  const macArmUrl = import.meta.env.VITE_RELEASE_MAC_ARM_URL;
  const macArmSha256 = import.meta.env.VITE_RELEASE_MAC_ARM_SHA256;
  if (macArmUrl && macArmSha256) {
    config['mac-arm'] = [{
      downloadUrl: macArmUrl,
      sha256: macArmSha256.replace(/^sha256:/i, ''),
      size: import.meta.env.VITE_RELEASE_MAC_ARM_SIZE || "~78 MB",
      recommended: true,
      signature: "Developer ID signed and notarized by Apple",
      description: "Native Apple Silicon performance",
    }];
  }

  // Linux
  const linuxUrl = import.meta.env.VITE_RELEASE_LINUX_URL;
  const linuxSha256 = import.meta.env.VITE_RELEASE_LINUX_SHA256;
  if (linuxUrl && linuxSha256) {
    config.linux = [
      {
        downloadUrl: linuxUrl,
        sha256: linuxSha256.replace(/^sha256:/i, ''),
        size: import.meta.env.VITE_RELEASE_LINUX_SIZE || "~90 MB",
        recommended: true,
        signature: "GPG signed",
        description: "Universal Linux package",
      }
    ];

    // Optional .deb package
    const linuxDebUrl = import.meta.env.VITE_RELEASE_LINUX_DEB_URL;
    const linuxDebSha256 = import.meta.env.VITE_RELEASE_LINUX_DEB_SHA256;
    if (linuxDebUrl && linuxDebSha256 && config.linux) {
      config.linux.push({
        downloadUrl: linuxDebUrl,
        sha256: linuxDebSha256.replace(/^sha256:/i, ''),
        size: import.meta.env.VITE_RELEASE_LINUX_DEB_SIZE || "~75 MB",
        recommended: false,
        signature: "GPG signed",
        description: "Debian/Ubuntu package",
      });
    }
  }

  return config;
}

/**
 * Get release configuration from JSON file (fallback or override)
 * This allows manual updates without redeployment
 */
async function getReleaseConfigFromJSON(): Promise<Partial<Record<Platform, ReleaseInfo[]>>> {
  try {
    const response = await fetch('/releases.json');
    if (!response.ok) {
      return {};
    }
    const data = await response.json();
    return data as Partial<Record<Platform, ReleaseInfo[]>>;
  } catch {
    return {};
  }
}

/**
 * Merges environment config with JSON config (JSON takes precedence)
 */
export async function getReleaseConfig(): Promise<Partial<Record<Platform, ReleaseInfo[]>>> {
  const envConfig = getReleaseConfigFromEnv();
  const jsonConfig = await getReleaseConfigFromJSON();
  
  // Merge: JSON config overrides env config for same platforms
  return {
    ...envConfig,
    ...jsonConfig,
  };
}

/**
 * Check if a platform has any available downloads
 */
export function hasAvailableDownloads(
  platform: Platform,
  config: Partial<Record<Platform, ReleaseInfo[]>>
): boolean {
  const installers = config[platform];
  if (!installers || installers.length === 0) {
    return false;
  }
  return installers.some(installer => installer.downloadUrl);
}

/**
 * Filter installers to only show those with download URLs
 */
export function getAvailableInstallers(
  installers: ReleaseInfo[]
): ReleaseInfo[] {
  return installers.filter(installer => installer.downloadUrl);
}
