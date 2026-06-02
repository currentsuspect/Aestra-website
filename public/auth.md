# Aestra — Agent Registration

Aestra does not currently expose protected APIs requiring OAuth. This file is published for forward-compatibility.

## Identity

- Site: https://aestra.studio
- Contact: hello@aestra.studio

## Authentication

No authentication is required to access public Aestra content or documentation.

## Future

When Aestra exposes authenticated APIs (e.g., account management, project sync), authentication metadata will be published at:

- `/.well-known/oauth-authorization-server`
- `/.well-known/oauth-protected-resource`

Agents should check `/.well-known/oauth-protected-resource` for the current list of authorization servers before attempting to obtain tokens.
