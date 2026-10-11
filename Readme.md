This is week9 individual assignment of Betechifield
Backend-Development advanced classes "blog-api-week9".

## Authentication

Set `JWT_SECRET` in `.env` to a long, random secret before starting the API. Users can register and log in with an email and a password of at least 8 characters:

- `POST /auth/register` with `{ "email": "you@example.com", "password": "your-password" }`
- `POST /auth/login` with the same request body

Both endpoints return a JWT in the `token` property. Send it as `Authorization: Bearer <token>` when creating, updating, or deleting articles. Listing and reading articles remain public. Passwords are stored as hashes, not in plain text.