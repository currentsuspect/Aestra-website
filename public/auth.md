# Auth.md

Aestra does not currently expose protected APIs. This file is published for forward-compatibility so agents can discover the authentication protocol when APIs launch.

## Identity

- Site: https://aestra.studio
- Contact: hello@aestra.studio

## Authentication

No credentials are required to access public Aestra content or documentation.

When protected APIs are available, agents should follow this discovery flow:

1. `GET /.well-known/oauth-protected-resource` — find the authorization server
2. `GET /.well-known/oauth-authorization-server` — read the `agent_auth` block
3. `POST` to `register_uri` with `{ type: "anonymous" }` to obtain credentials

## agent_auth

See `/.well-known/oauth-authorization-server` for the `agent_auth` block with `register_uri`, supported identity types, and credential types.
