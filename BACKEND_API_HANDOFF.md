# TribeVibe Backend API Handoff

This document contains all backend APIs that the frontend team can integrate to replace mock data.

---

# Base URL

### Local

```
https://myntra-tribes.onrender.com//api
```

### Production

```
<Backend Deployment URL>
```

---

# 1. Assign Tribe

Assigns a user to a fashion tribe based on quiz answers.

### Endpoint

```
POST /api/tribes/assign
```

### Request Body

```json
{
  "weekend": "Rooftop rave in Tokyo",
  "colors": "Electric Purple & Chrome",
  "shoes": "Chunky Sneakers",
  "vacation": "Seoul Nightlife",
  "room": "RGB Lights",
  "accessory": "Layered Chains"
}
```

### Success Response

```json
{
  "version": "1.0",
  "success": true,
  "message": "Tribe Assigned Successfully",

  "assignedTribe": {
    "id": "uuid",
    "name": "Neon Static",
    "slug": "neon-static",
    "description": "Cyberpunk × Y2K fusion",

    "primary_color": "#8A2BE2",
    "secondary_color": "#39FF14",

    "theme_config": {
      "mode": "dark",
      "font": "Orbitron"
    }
  },

  "scores": {
    "Neon Static": 18,
    "Golden Hour": 2,
    "Vault Heir": 1
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "colors is required"
}
```

---

# 2. Get All Tribes

Returns every available tribe.

### Endpoint

```
GET /api/tribes
```

### Success Response

```json
{
  "success": true,
  "count": 3,

  "tribes": [
    {
      "id": "...",
      "name": "Neon Static",
      "slug": "neon-static"
    },
    {
      "id": "...",
      "name": "Golden Hour",
      "slug": "golden-hour"
    },
    {
      "id": "...",
      "name": "Vault Heir",
      "slug": "vault-heir"
    }
  ]
}
```

---

# 3. Get Single Tribe

Returns complete details of one tribe.

### Endpoint

```
GET /api/tribes/:slug
```

Example

```
GET /api/tribes/neon-static
```

---

# 4. Get Products

Returns paginated products.

### Endpoint

```
GET /api/products
```

---

## Pagination

```
GET /api/products?page=1&limit=20
```

---

## Search

```
GET /api/products?search=shirt
```

---

## Category Filter

```
GET /api/products?category=T-Shirts
```

---

## Tribe Filter

```
GET /api/products?tribe=neon-static
```

Supported tribe slugs

```
neon-static

golden-hour

vault-heir
```

---

## Combined Filters

```
GET /api/products?tribe=neon-static&category=T-Shirts&page=1&limit=20
```

---

## Success Response

```json
{
  "success": true,

  "page": 1,

  "limit": 20,

  "totalProducts": 812,

  "totalPages": 41,

  "count": 20,

  "products": [
    {
      "myntra_id": "30834617",

      "brand": "Roadster",

      "name": "Printed Oversized T-Shirt",

      "full_name": "Roadster Printed Oversized T-Shirt",

      "price": 699,

      "rating": "4.4",

      "discount": "(40% OFF)",

      "image_url": "...",

      "product_url": "...",

      "category": "T-Shirts",

      "slot": "Top",

      "gender": "Men",

      "color": "Black",

      "primary_tribe_id": "uuid"
    }
  ]
}
```

---

# Frontend Integration

## Tribe Assignment

```javascript
const res = await fetch(
  "http://localhost:5000/api/tribes/assign",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizAnswers),
  }
);

const data = await res.json();

const tribe = data.assignedTribe;
```

Useful fields

```
tribe.name

tribe.slug

tribe.primary_color

tribe.secondary_color

tribe.theme_config
```

---

## Product Catalog

```javascript
const res = await fetch(
  "http://localhost:5000/api/products?page=1&limit=20"
);

const data = await res.json();

const products = data.products;
```

---

## Search

```javascript
const res = await fetch(
  "http://localhost:5000/api/products?search=hoodie"
);
```

---

## Tribe Products

```javascript
const res = await fetch(
  "http://localhost:5000/api/products?tribe=golden-hour"
);
```

---

## Category Products

```javascript
const res = await fetch(
  "http://localhost:5000/api/products?category=Dresses"
);
```

---

# Replace Mock Data

Frontend should replace:

- Mock tribe list → `GET /api/tribes`
- Mock onboarding → `POST /api/tribes/assign`
- Mock product catalog → `GET /api/products`
- Hardcoded tribe products → `GET /api/products?tribe=<slug>`
- Hardcoded colors → `assignedTribe.primary_color`
- Hardcoded themes → `assignedTribe.theme_config`

---

# Backend Status

- ✅ Tribe Assignment API
- ✅ Tribe APIs
- ✅ Products API
- ✅ Pagination
- ✅ Search
- ✅ Category Filter
- ✅ Tribe Filter
- ✅ Supabase Integration
- ✅ Tested with Postman

---

# Notes

- All APIs return JSON.
- Use `Content-Type: application/json` for POST requests.
- Product responses are paginated by default.
- Frontend should use tribe **slug** (e.g. `neon-static`) instead of database UUIDs.