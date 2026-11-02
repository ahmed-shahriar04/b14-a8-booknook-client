export const getServerUrl = () => {
  let url = 'https://b14-a8-booknook-server.onrender.com';

  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (envUrl && typeof envUrl === 'string' && !envUrl.includes('localhost')) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (clean.endsWith('/v')) {
      clean = clean.slice(0, -2);
    }
    if (clean) url = clean;
  }

  // Ensure absolutely no trailing slash or accidental /v suffix
  return url.replace(/\/+$/, '').replace(/\/v$/, '');
};
