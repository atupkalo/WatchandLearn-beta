import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  const store = await cookies();
  let locale = store.get('locale')?.value || 'en';

  // 🔒 protect against wrong values like "UA"
  if (locale !== 'en' && locale !== 'uk') {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});