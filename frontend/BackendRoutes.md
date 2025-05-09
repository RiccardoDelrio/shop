# Boolean High Fashion E-commerce API Documentation

This document provides comprehensive information about all available API endpoints for the Boolean haute couture e-commerce platform.

## Base URL

All API requests should be made to: `http://localhost:3000/api/v1/`

## Macroarea Routes

### Get All Macroareas

`GET /macroareas`
Returns all macroareas with their categories.

### Get Categories by Macroarea

`GET /macroareas/:slug/categories`
Returns all categories for a given macroarea (by slug).

### Get Products by Macroarea

`GET /macroareas/:slug/products`
Returns all products for a given macroarea (by slug). This is the only way to get all products for a macroarea.

## Category Routes

### Get All Categories

`GET /categories`
Returns a flat list of all categories (with macroarea info).

### Get Products by Category

`GET /categories/:slug`
Returns all products for a given category (by slug). Category routes do not return macroarea products directly.

## Product Routes

### Get All Products

`GET /products`
Returns all products.

### Get Product by Slug

`GET /products/:slug`
Returns details for a product (by slug).

### Get Random Products

`GET /products/random`
Returns a random selection of products.

### Get Discounted Products

`GET /products/discounted`
Returns all products that have a discount.

### Search Products

`GET /products/search?q=...`
Search products by name or description.

## Order Management Routes

### Create a New Order

`POST /orders`
Create a new order.

**Request body:**

```json
{
  "customer_info": {
    "first_name": "Mario",
    "last_name": "Rossi",
    "email": "customer@example.com",
    "phone": "123456789",
    "address": "Via Roma 1",
    "city": "Milano",
    "state": "MI",
    "postal_code": "20100",
    "country": "Italy"
  },
  "items": [
    {
      "product_id": 5,
      "product_variation_id": 12,
      "quantity": 2,
      "price": 100
    }
  ],
  "delivery": 10,
  "total": 200,
  "discount": 0
}
```

**Note:** `customer_info.email` is required.

### Get Order by ID

`GET /orders/:id`
Retrieve information about a specific order.

### Update Order Status

`PATCH /orders/:id/status`
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

`POST /orders/track`
Track an order using email and order ID.

**Request body:**

```json
{
  "email": "customer@example.com",
  "order_id": 1
}
```

### Get Orders by Email

`GET /orders/email/:email`
Get all orders for a specific email address.

## Newsletter Routes

### Subscribe to Newsletter

`POST /newsletter/subscribe`
Subscribe an email address to the newsletter.

**Request body:**

```json
{
  "email": "customer@example.com"
}
```

### Unsubscribe from Newsletter

`DELETE /newsletter/unsubscribe/:email`
Unsubscribe an email address from the newsletter.
