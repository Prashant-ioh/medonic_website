import { useCallback, useEffect, useState } from 'react';

export function useGeolocation() {
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // BigDataCloud's client-side reverse geocode endpoint is free and keyless.
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const place = data.city || data.locality || data.principalSubdivision || data.countryName;
          if (place) {
            setCity(place);
            setStatus('success');
          } else {
            setStatus('error');
          }
        } catch {
          setStatus('error');
        }
      },
      () => setStatus('error'),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    detect();
  }, [detect]);

  return { city, status, detect };
}
