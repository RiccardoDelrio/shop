# Boolean High Fashion E-commerce API Documentation

This document provides comprehensive information about all available API endpoints for the Boolean haute couture e-commerce platform.

## Base URL

All API requests should be made to: `http://localhost:3000/api/v1/`

## Wardrobe Section Routes

### Get All Wardrobe Sections

`GET /wardrobe-sections`
Returns all wardrobe sections with their categories.

### Get Categories by Wardrobe Section

`GET /wardrobe-sections/:slug/categories`
Returns all categories for a given wardrobe section (by slug).

### Get Products by Wardrobe Section

`GET /wardrobe-sections/:slug/products`
Returns all products for a given wardrobe section (by slug).

## Category Routes

### Get All Categories

`GET /categories`
Returns a flat list of all categories (with macroarea info).

### Get Products by Category

`GET /categories/:slug`
Returns all products for a given category (by slug).

## Product Routes

### Dynamic Product Filtering (RECOMMENDED)

`GET /products/filter?...`
Returns products filtered by any combination of supported query parameters. This endpoint replaces all previous static product listing, searching, and filtering routes.

#### Supported Filters

- `wardrobe_section`: Filter by wardrobe section slug (e.g. `wardrobe_section=tops-and-coats`)
- `category`: Filter by category slug (e.g. `category=knits`)
- `color`: Filter by product color (e.g. `color=Cream`)
- `size`: Filter by product size (e.g. `size=M`)
- `discounted`: Only show discounted products (`discounted=true`)
- `inStock`: Only show products in stock (`inStock=true`)
- `search`: Search by product name or description (e.g. `search=alpaca`)
- `minPrice`: Minimum price (e.g. `minPrice=100`)
- `maxPrice`: Maximum price (e.g. `maxPrice=500`)

#### Ordering

- `sort=price_asc`: Order by price ascending
- `sort=price_desc`: Order by price descending
- `sort=discount_asc`: Order by discount ascending
- `sort=discount_desc`: Order by discount descending
- `sort=newest`: Order by creation date, newest first
- `sort=oldest`: Order by creation date, oldest first

#### Limiting

- `limit`: Limit the number of results (e.g. `limit=10`)

**Example:**

`GET /products/filter?wardrobe_section=tops-and-coats&color=Cream&discounted=true&sort=price_desc&limit=5`

> This endpoint replaces all previous static product listing, searching, and filtering routes.

## Order Management Routes

### Create a New Order

`POST /orders`
Create a new order.

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
  "discount": 0
}
```

**Note:**

- `customer_info.email` is required.
- `total` is now calculated server-side as the sum of all item prices (price × quantity), **with each product's discount (if any) automatically applied**.
- `discount` is a percentage (e.g. 10 for 10% off the subtotal after product discounts).
- `delivery` is calculated automatically by the backend: it is 30 by default, but free if the order total is at least 500.
- **Product-level discounts are always applied first, then the order-level discount is applied to the subtotal.**

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
  "email": "mario.rossi@example.com",
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
