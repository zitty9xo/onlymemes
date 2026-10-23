/**
 * emailValidator.js
 * Multi-tiered email integrity and disposable/dummy email filter for OnlyMeme.
 */

// Comprehensive dictionary of disposable, temporary, and burner email domains
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'trashmail.com',
  'trashmail.net',
  'yopmail.com',
  'yopmail.net',
  'dispostable.com',
  'throwawaymail.com',
  'getnada.com',
  'fakeinbox.com',
  'mohmal.com',
  'burnermail.io',
  'generator.email',
  'crazymailing.com',
  'fakemailgenerator.com',
  'inboxkitten.com',
  'nada.ltd',
  'maildrop.cc',
  'mytemp.email',
  'tempail.com',
  'emailondeck.com',
  'minuteinbox.com',
  'zillamail.com',
  'throwawayemailaddresses.com'
]);

/**
 * Validates whether an email address is authentic, verified (if required), and not a dummy/burner address.
 * 
 * @param {string} email - The email address to inspect.
 * @param {boolean} [requireVerification=false] - Whether to require emailVerified token flag.
 * @param {boolean} [emailVerified=true] - The verification status from auth provider.
 * @returns {{ isValid: boolean, reason: string | null }}
 */
export function validateEmailIntegrity(email, requireVerification = false, emailVerified = true) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, reason: 'Email address is missing or invalid.' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Basic RFC 5322 structural regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(normalizedEmail)) {
    return { isValid: false, reason: 'Invalid email syntax. Please enter a valid email address.' };
  }

  // Provider email verification check (e.g. for Google OAuth)
  if (requireVerification && !emailVerified) {
    return {
      isValid: false,
      reason: 'Unverified email. Please verify your Google account before signing in.'
    };
  }

  const [username, domain] = normalizedEmail.split('@');

  // Check 1: Disposable/burner domain blocklist
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      reason: `The email domain "${domain}" is a known disposable/burner provider. Only authentic, permanent accounts are allowed.`
    };
  }

  // Check 2: Known dummy/bot username prefixes
  const dummyPrefixes = ['testtest', 'dummyuser', 'fakeemail', 'asdfghj', 'tempuser', 'botuser', 'throwaway'];
  if (dummyPrefixes.some(prefix => username.startsWith(prefix))) {
    return {
      isValid: false,
      reason: 'Automated or dummy username patterns are not permitted.'
    };
  }

  // Check 3: Repetitive character bot patterns (e.g., "aaaaaaaa@...", "11111111@...")
  if (/^(.)\1{5,}@/.test(normalizedEmail)) {
    return {
      isValid: false,
      reason: 'Suspicious repetitive bot email format detected.'
    };
  }

  return { isValid: true, reason: null };
}
