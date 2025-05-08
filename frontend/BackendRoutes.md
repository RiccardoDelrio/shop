# Boolean High Fashion E-commerce API Documentation

This document provides comprehensive information about all available API endpoints for the Boolean haute couture e-commerce platform.

## Base URL

All API requests should be made to: `http://localhost:3000/api/v1/`

## Macroarea and Category Routes

### Get All Macroareas

```plaintext
http://localhost:3000/api/v1/macroareas
```

Returns a list of all macroareas (product departments) in the system along with their associated categories.

### Get Categories by Macroarea

```plaintext
http://localhost:3000/api/v1/macroareas/{slug}/categories
```

Returns all categories belonging to the specified macroarea.

**Valid macroarea endpoints:**

```plaintext
http://localhost:3000/api/v1/macroareas/upper-body/categories
http://localhost:3000/api/v1/macroareas/lower-body/categories
http://localhost:3000/api/v1/macroareas/dress/categories
http://localhost:3000/api/v1/macroareas/accessori/categories
```

### Get Products by Macroarea

```plaintext
http://localhost:3000/api/v1/macroareas/{slug}/products
```

Returns all products belonging to all categories under the specified macroarea.

**Valid macroarea endpoints:**

```plaintext
http://localhost:3000/api/v1/macroareas/upper-body/products
http://localhost:3000/api/v1/macroareas/lower-body/products
http://localhost:3000/api/v1/macroareas/dress/products
http://localhost:3000/api/v1/macroareas/accessori/products
```

### Get All Categories

```plaintext
http://localhost:3000/api/v1/macroareas/categories
```

Returns a flattened list of all product categories in the system with their associated macroarea information.

### Get Products by Category

```plaintext
http://localhost:3000/api/v1/macroareas/categories/{slug}
```

Returns all products belonging to a specific category.

**Example category endpoints:**

```plaintext
http://localhost:3000/api/v1/macroareas/categories/cappotti
http://localhost:3000/api/v1/macroareas/categories/giacche
http://localhost:3000/api/v1/macroareas/categories/maglie
http://localhost:3000/api/v1/macroareas/categories/maglioni
http://localhost:3000/api/v1/macroareas/categories/pantaloni
http://localhost:3000/api/v1/macroareas/categories/gonne
http://localhost:3000/api/v1/macroareas/categories/vestitini
http://localhost:3000/api/v1/macroareas/categories/orecchini
http://localhost:3000/api/v1/macroareas/categories/bracciali
http://localhost:3000/api/v1/macroareas/categories/collane
```

## Product Routes

### Get All Products

```plaintext
http://localhost:3000/api/v1/products
```

Returns a list of all products in the system.

### Get Product by ID

```plaintext
http://localhost:3000/api/v1/products/{id}
```

Returns detailed information about a specific product.

### Get Random Products

```plaintext
http://localhost:3000/api/v1/products/random
```

Returns a selection of random products, useful for the homepage.

### Search Products

```plaintext
http://localhost:3000/api/v1/products/search?q={searchTerm}
```

Search products by name or description.

## Product Image Routes

### Get All Images for a Product

```plaintext
http://localhost:3000/api/v1/products/images/{productId}
```

Returns all images associated with a specific product.

## Order Management Routes

### Create a New Order

```plaintext
http://localhost:3000/api/v1/orders
```

Create a new order in the system.

**Request body:**

```json
{
  "user_id": 1,
  "items": [
    {
      "product_id": 5,
      "product_variation_id": 12,
      "quantity": 2
    }
  ]
}
```

### Get Order by ID

```plaintext
http://localhost:3000/api/v1/orders/{id}
```

Retrieve information about a specific order.

### Update Order Status

```plaintext
http://localhost:3000/api/v1/orders/{id}/status
```

Update the status of an order.

**Request body:**

```json
{
  "status": "Processing"
}
```

**Valid status values:**

- `Pending`
- `Processing`
- `Completed`
- `Cancelled`

### Track Order

```plaintext
http://localhost:3000/api/v1/orders/track
```

Track an order using email and order ID.

**Request body:**

```json
{
  "email": "customer@example.com",
  "order_id": 1
}
```

### Get Orders by Email

```plaintext
http://localhost:3000/api/v1/orders/email/{email}
```

Get all orders associated with a specific email address.

## Newsletter Routes

### Subscribe to Newsletter

```plaintext
http://localhost:3000/api/v1/newsletter/subscribe
```

Subscribe an email address to the newsletter.

**Request body:**

```json
{
  "email": "customer@example.com"
}
```
