-- Creazione della tabella degli utenti
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Creazione della tabella delle macroaree
CREATE TABLE Macroareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Creazione della tabella delle categorie
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    macroarea_id INT NOT NULL,
    slug TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (macroarea_id) REFERENCES Macroareas(id)
);

-- Creazione della tabella dei prodotti
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Creazione della tabella delle varianti dei prodotti
CREATE TABLE Product_Variations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color VARCHAR(50),
    size VARCHAR(50),
    stock INT NOT NULL,
    additional_price DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Creazione della tabella degli ordini
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    delivery DECIMAL(10, 2),
    total DECIMAL(10, 2),
    discount DECIMAL(5, 2) DEFAULT 0,
    final_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Creazione della tabella degli articoli degli ordini
CREATE TABLE Order_Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_variation_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (product_variation_id) REFERENCES Product_Variations(id)
);

-- Creazione della tabella per la newsletter
CREATE TABLE email_newsletter (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Inserimento dati nelle macroaree
INSERT INTO Macroareas (slug, name, description) VALUES
('accessori', 'Accessori', 'Categoria dedicata agli accessori come orecchini, collane, bracciali.'),
('upper-body', 'Upper Body', 'Categoria dedicata a cappotti, maglioni e maglie.'),
('lower-body', 'Lower Body', 'Categoria dedicata a pantaloni e gonne.'),
('dress', 'Dress', 'Categoria dedicata ai vestitini.');

-- Inserimento dati nelle categorie
INSERT INTO Categories (macroarea_id, slug, name, description) VALUES
(1, 'orecchini', 'Orecchini', 'Sottocategoria di accessori dedicata agli orecchini.'),
(1, 'bracciali', 'Bracciali', 'Sottocategoria di accessori dedicata ai bracciali.'),
(1, 'collane', 'Collane', 'Sottocategoria di accessori dedicata alle collane.'),
(2, 'giacche', 'Giacche', 'Sottocategoria di upper body dedicata alle giacche.'),
(2, 'cappotti', 'Cappotti', 'Sottocategoria di upper body dedicata ai cappotti.'),
(2, 'maglie', 'Maglie', 'Sottocategoria di upper body dedicata alle maglie.'),
(2, 'maglioni', 'Maglioni', 'Sottocategoria di upper body dedicata ai maglioni.'),
(3, 'pantaloni', 'Pantaloni', 'Sottocategoria di lower body dedicata ai pantaloni.'),
(3, 'gonne', 'Gonne', 'Sottocategoria di lower body dedicata alle gonne.'),
(4, 'vestitini', 'Vestitini', 'Sottocategoria di dress dedicata ai vestitini.');

-- Inserimento dati nei prodotti
INSERT INTO Products (slug, name, description, price, category_id, image) VALUES
('orecchini-eleganti', 'Orecchini Eleganti', 'Orecchini in argento con cristalli.', 49.99, 1, 'orecchini.jpg'),
('collana-perle', 'Collana Perle', 'Collana con perle naturali.', 89.99, 1, 'collana.jpg'),
('bracciale-oro', 'Bracciale Oro', 'Bracciale placcato oro.', 69.99, 1, 'bracciale.jpg'),

('cappotto-lana', 'Cappotto Lana', 'Cappotto lungo in lana.', 149.99, 2, 'cappotto.jpg'),
('maglione-cashmere', 'Maglione Cashmere', 'Maglione caldo in cashmere.', 129.99, 2, 'maglione.jpg'),
('maglia-cotone', 'Maglia Cotone', 'Maglia leggera in cotone.', 39.99, 2, 'maglia.jpg'),

('pantaloni-eleganti', 'Pantaloni Eleganti', 'Pantaloni a gamba larga.', 59.99, 3, 'pantaloni.jpg'),
('gonna-plissettata', 'Gonna Plissettata', 'Gonna midi plissettata.', 49.99, 3, 'gonna.jpg'),

('vestitino-estivo', 'Vestitino Estivo', 'Vestitino leggero per l’estate.', 79.99, 4, 'vestitino.jpg'),
('vestitino-elegante', 'Vestitino Elegante', 'Vestitino per occasioni speciali.', 109.99, 4, 'vestitino_elegante.jpg'),
('vestitino-casual', 'Vestitino Casual', 'Vestitino comodo per il quotidiano.', 69.99, 4, 'vestitino_casual.jpg');

-- Inserimento delle varianti dei prodotti
INSERT INTO Product_Variations (product_id, color, size, stock, additional_price) VALUES
(1, 'Argento', 'Unica', 10, 0),
(2, 'Bianco', 'Unica', 5, 0),
(3, 'Oro', 'Unica', 7, 0),

(4, 'Nero', 'M', 3, 0),
(4, 'Grigio', 'L', 2, 10.00),
(5, 'Beige', 'S', 4, 0),
(6, 'Blu', 'M', 8, 0),

(7, 'Nero', 'M', 5, 0),
(8, 'Rosa', 'S', 6, 0),

(9, 'Rosso', 'S', 3, 0),
(10, 'Blu', 'M', 4, 0),
(11, 'Verde', 'L', 7, 0);