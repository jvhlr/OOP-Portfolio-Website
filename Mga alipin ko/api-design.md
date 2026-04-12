---
name: api-design
description: API design skill covering RESTful APIs, GraphQL, API documentation, versioning, request/response design, and OpenAPI/Swagger specs. Use this skill when the user wants to design or document an API, plan API endpoints, write an OpenAPI spec, think through API structure, decide between REST vs GraphQL, or create developer-facing API documentation. Also triggers for tasks like "design the routes for my app", "what endpoints should I create?", "write the API spec", "document my API", "how should I structure my API?", or "review my API design". Use even for partial tasks like naming a single endpoint correctly, designing a response format, or planning pagination.
---

# API Design Skill

This skill guides the design of clean, intuitive, and developer-friendly APIs — from naming endpoints to writing full OpenAPI documentation.

---

## Step 1: REST vs. GraphQL — Choose Wisely

| Factor | REST | GraphQL |
|---|---|---|
| Use case | CRUD operations, simple resources | Complex, nested, or flexible data fetching |
| Learning curve | Low | Medium-High |
| Over-fetching | Common (you get all fields) | Eliminated (client asks for what it needs) |
| Caching | Easy (HTTP caching) | More complex (needs custom setup) |
| Tooling | Widely supported | Growing ecosystem |
| Best for | Public APIs, simple backends | Data-heavy apps, mobile, varied clients |

**Default**: Use REST unless you have a specific reason to use GraphQL.

---

## Step 2: RESTful URL Design

### Rules
- Use **nouns**, not verbs
- Use **plural** resource names
- Use **kebab-case** for multi-word resources
- Nest resources to show relationships (max 2 levels deep)

```
✅ GET    /api/v1/users
✅ GET    /api/v1/users/:id
✅ POST   /api/v1/users
✅ PATCH  /api/v1/users/:id
✅ DELETE /api/v1/users/:id

✅ GET    /api/v1/users/:id/posts        (posts belonging to a user)
✅ GET    /api/v1/posts/:id/comments

❌ GET    /api/v1/getUsers
❌ POST   /api/v1/deleteUser
❌ GET    /api/v1/users/:id/posts/:postId/comments/:id/likes  (too deep)
```

### Filtering, Sorting, Pagination via Query Params
```
GET /api/v1/posts?status=published&sort=created_at&order=desc&page=2&limit=20
GET /api/v1/users?search=alice&role=admin
```

---

## Step 3: HTTP Status Codes — Use Them Correctly

| Code | Meaning | When to use |
|---|---|---|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (include `Location` header) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Not logged in / missing auth token |
| 403 | Forbidden | Logged in but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email already taken) |
| 422 | Unprocessable Entity | Semantically invalid data |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |

---

## Step 4: Response Design

### Consistent Success Response
```json
{
  "data": {
    "id": 1,
    "email": "alice@example.com",
    "name": "Alice"
  },
  "meta": {
    "requestId": "abc-123"
  }
}
```

### Paginated List Response
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### Error Response (always consistent)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ]
  }
}
```

Key rules:
- Never change the shape of error responses based on error type
- Include a machine-readable `code` alongside the human `message`
- Don't expose internal stack traces in production

---

## Step 5: API Versioning

Always version your API from day one.

**URL versioning** (most common, most visible):
```
/api/v1/users
/api/v2/users
```

**Header versioning** (cleaner URLs, less discoverable):
```
Accept: application/vnd.myapi.v2+json
```

**Rule**: Never make breaking changes to an existing version. Add a new version instead. Deprecate old versions with clear timelines.

---

## Step 6: OpenAPI (Swagger) Spec

Write OpenAPI 3.0 specs to document your API and enable auto-generated docs/clients.

```yaml
openapi: 3.0.3
info:
  title: My App API
  version: 1.0.0

paths:
  /users:
    get:
      summary: List all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
    post:
      summary: Create a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        '201':
          description: User created
        '400':
          description: Validation error

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        email:
          type: string
          format: email
        name:
          type: string
        createdAt:
          type: string
          format: date-time

    UserCreate:
      type: object
      required: [email, name, password]
      properties:
        email:
          type: string
          format: email
        name:
          type: string
        password:
          type: string
          minLength: 8

    UserList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        pagination:
          $ref: '#/components/schemas/Pagination'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

---

## Step 7: Authentication Design

### Bearer Token (JWT)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### API Keys (for server-to-server)
```
X-API-Key: sk_live_abc123
```

### OAuth 2.0 Flows
- **Authorization Code**: Web apps with a user login (most common)
- **Client Credentials**: Server-to-server, no user involved
- **Device Code**: TVs, CLI tools

---

## Step 8: Rate Limiting Headers

Always communicate rate limits to clients:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1680000000
Retry-After: 60   (on 429 response)
```

---

## Step 9: API Design Checklist

- [ ] URLs use nouns, not verbs
- [ ] Resources are pluralized
- [ ] HTTP methods are used correctly (GET, POST, PATCH, DELETE)
- [ ] Status codes are accurate and consistent
- [ ] Error responses have a consistent structure with machine-readable codes
- [ ] API is versioned (`/v1/`)
- [ ] Pagination implemented on list endpoints
- [ ] Authentication documented
- [ ] Sensitive data is not returned (passwords, secrets, PII you don't need to expose)
- [ ] OpenAPI spec exists or is planned

---

## Output Format

When designing an API:
1. List all resources and their relationships
2. Show all endpoints in a table (method, path, description)
3. Provide example request and response bodies
4. Note any design decisions or trade-offs
5. Optionally, provide a full or partial OpenAPI YAML spec
