// What the sign-up forms say when something goes wrong. One place, so the early-access
// dialog and the Founding Supporter form never drift apart. Each message says what
// happened, whether anything was saved, and what to do next.
export const FORM_ERRORS = {
  email: {
    inline: "That doesn't look like an email address. It needs an @ and a domain, like you@studio.email.",
    toastTitle: "Check that email",
    toastBody: "It needs an @ and a domain, like you@studio.email.",
  },
  server: {
    inline: "That didn't go through, and nothing was saved. Try again in a moment, or write to support@aestra.studio.",
    toastTitle: "Couldn't send that",
    toastBody: "Nothing was saved. Try again, or write to support@aestra.studio.",
  },
  network: {
    inline: "Couldn't reach the server, so nothing was sent. Check your connection and try again.",
    toastTitle: "No connection",
    toastBody: "Nothing was sent. Check your connection and try again.",
  },
} as const;
