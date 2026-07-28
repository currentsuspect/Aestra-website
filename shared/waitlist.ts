// Shared between the browser forms and the /api/waitlist function so client
// and server agree on what a valid address is. Native `type="email"` accepts
// `user@localhost`; the server does not, and a client that is more permissive
// than the server turns a fixable typo into a generic "something went wrong".
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
