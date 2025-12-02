erDiagram
    CATEGORIES {
        int id PK
        nvarchar(100) name
        nvarchar(500) description
    }

    SUPPLIERS {
        int id PK
        nvarchar(200) name
        nvarchar(20) phone
        nvarchar(200) email
        nvarchar(500) address
    }

    PRODUCTS {
        int id PK
        nvarchar(200) name
        nvarchar(max) description
        int category_id FK
        int supplier_id FK
        decimal(10,2) purchase_price
        decimal(10,2) sale_price
        int current_quantity
        nvarchar(100) unit
    }

    CUSTOMERS {
        int id PK
        nvarchar(100) first_name
        nvarchar(100) last_name
        nvarchar(20) phone
        nvarchar(200) email
        nvarchar(500) address
        date registration_date
    }

    EMPLOYEES {
        int id PK
        nvarchar(100) first_name
        nvarchar(100) last_name
        nvarchar(20) phone
        nvarchar(200) email
        nvarchar(100) position
        date hire_date
        decimal(10,2) salary
    }

    ORDERS {
        int id PK
        int customer_id FK
        int employee_id FK
        datetime order_date
        nvarchar(50) status
        decimal(10,2) total_amount
        nvarchar(500) delivery_address
        nvarchar(50) payment_method
    }

    ORDER_DETAILS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal(10,2) unit_price
        decimal(10,2) subtotal
    }

    DELIVERIES {
        int id PK
        int supplier_id FK
        datetime delivery_date
        decimal(10,2) total_cost
        nvarchar(500) notes
    }

    DELIVERY_DETAILS {
        int id PK
        int delivery_id FK
        int product_id FK
        int quantity
        decimal(10,2) unit_cost
    }

    CATEGORIES ||--o{ PRODUCTS : contains
    SUPPLIERS ||--o{ PRODUCTS : supplies
    SUPPLIERS ||--o{ DELIVERIES : makes
    CUSTOMERS ||--o{ ORDERS : places
    EMPLOYEES ||--o{ ORDERS : processes
    ORDERS ||--o| ORDER_DETAILS : consists_of
    PRODUCTS }o--o{ ORDER_DETAILS : included_in
    DELIVERIES ||--o{ DELIVERY_DETAILS : consists_of
    PRODUCTS }o--o{ DELIVERY_DETAILS : supplied_in
