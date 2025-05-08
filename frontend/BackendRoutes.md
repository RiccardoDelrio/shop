# List of all routes from the Backend

## INDEX-STYLE ROUTES

### index

> **GET** <http://localhost:3000/api/v1/products>

### fetch all the categories

> **GET** <http://localhost:3000/api/v1/products/categories>

### index filter with macroarea

ONLY valid inputs: upper-body, lower-body, dress, accessori

> **GET** <http://localhost:3000/api/v1/products/macroarea/:slug>

### index filter with category (slug)

ONLY valid inputs: orecchini, bracciali, collane, giacche, cappotti, maglie, maglioni, pantaloni, gonne, vestitini

> **GET** <http://localhost:3000/api/v1/products/category/:slug>

### fetch 10 random products

**GET** <http://localhost:3000/api/v1/products/random>

## SHOW ROUTE with slug

> **GET** <http://localhost:3000/api/v1/products/:slug>

## CREATE EMAIL ROUTE FOR THE NEWSLETTER (POST ONLY!)

**!!!! NEEDS FRONTEND VALIDATION !!!**

> ***POST*** <http://localhost:3000/api/v1/products/email>

EXAMPLE BODY:  

    {  
        "email": "any.email@goes.here"  
    }  

**!!!! NEEDS FRONTEND VALIDATION !!!**

## ORDER ROUTES

### CREATE AN ORDER

**!!!! NEEDS FRONTEND VALIDATION !!!**

> ***POST*** <http://localhost:3000/api/v1/products/orders>

EXAMPLE BODY:

        {  
            "customer_info": {  
                "first_name": "Elizabeth",  
                "last_name": "Swann",  
                "email": "elizabeth@blackpearl.com",  
                "phone": "555-123-4567",  
                "address": "23 Pearl Street",  
                "city": "Port Royal",  
                "state": "Caribbean",  
                "postal_code": "12345",  
                "country": "Jamaica"  
            },  
            "items": [  
                {  
                    "product_id": 1,  
                    "product_variation_id": 4,  
                    "quantity": 1,  
                    "price": 1200.00  
                },  
                {  
                    "product_id": 2,  
                    "product_variation_id": null,  
                    "quantity": 2,  
                    "price": 150.00  
                }  
            ],  
                "delivery": 15.00,  
                "total": 1500.00,  
                "discount": 50.00  
        }  

**!!!! NEEDS FRONTEND VALIDATION !!!**

### DISPLAY ALL DETAILS OF ONE ORDER WITH ORDER ID (admin-side)

> **GET** <http://localhost:3000/api/v1/products/orders/:id>

### DISPLAY SUMMARY OF THE ORDER BY USING MAIL AND ORDER_ID (client-side)

> ***POST*** <http://localhost:3000/api/v1/products/orders/track>

EXAMPLE BODY:

        {  
            "email": "elizabeth@blackpearl.com",  
            "order_id": 1  
        }  
    
### RETRIEVE ALL ORDERS ASSOCIATED WITH THE SAME EMAIL

> **GET** <http://localhost:3000/api/v1/products/orders/email/:email>

### UPDATE STATUS OF THE ORDER (admin-side) (Pending, Processing, Completed OR Cancelled)

> ***PATCH*** <http://localhost:3000/api/v1/products/orders/:id/status>

EXAMPLE BODY:

        {  
            "status": "Processing"  
        }  
