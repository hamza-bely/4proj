

INSERT INTO utilisateur (create_date, email, first_name, last_name, password, provider_id, roles, status, update_date)
VALUES
    (NOW(), 'john.doe@example.com', 'John', 'Doe', 'password123', NULL, 'USER', 'ACTIVE', NOW()),
    (NOW(), 'jane.smith@example.com', 'Jane', 'Smith', 'pass456', NULL, 'ADMIN', 'ACTIVE', NOW()),
    (NOW(), 'alice.johnson@example.com', 'Alice', 'Johnson', 'alicepass', NULL, 'USER', 'DELETED', NOW()),
    (NOW(), 'bob.miller@example.com', 'Bob', 'Miller', 'bob123', NULL, 'USER', 'ACTIVE', NOW()),
    (NOW(), 'carol.davis@example.com', 'Carol', 'Davis', 'secure123', NULL, 'USER', 'ACTIVE', NOW()),
    (NOW(), 'daniel.wilson@example.com', 'Daniel', 'Wilson', 'danpass', NULL, 'MODERATOR', 'ACTIVE', NOW()),
    (NOW(), 'eve.moore@example.com', 'Eve', 'Moore', 'evepw', NULL, 'USER', 'DELETED', NOW()),
    (NOW(), 'frank.taylor@example.com', 'Frank', 'Taylor', 'frankpass', NULL, 'USER', 'ACTIVE', NOW()),
    (NOW(), 'grace.anderson@example.com', 'Grace', 'Anderson', 'gracepwd', NULL, 'ADMIN', 'ACTIVE', NOW()),
    (NOW(), 'henry.thomas@example.com', 'Henry', 'Thomas', 'henry123', NULL, 'USER', 'DELETED', NOW());

INSERT INTO report (
    address, create_date, dislike_count, latitude, like_count, longitude, status, type, update_date, username_user
) VALUES
      ('1 rue de Paris', CURRENT_TIMESTAMP, 2, 48.8566, 10, 2.3522, 'CANCELED', 'ACCIDENTS', CURRENT_TIMESTAMP, 'john.doe@example.com'),
      ('5 avenue Victor Hugo', CURRENT_TIMESTAMP, 0, 45.7640, 25, 4.8357, 'AVAILABLE', 'POLICE_CHECKS', CURRENT_TIMESTAMP, 'jane.smith@example.com'),
      ('10 boulevard Haussmann', CURRENT_TIMESTAMP, 1, 43.2965, 5, 5.3698, 'PENDING', 'TRAFFIC', CURRENT_TIMESTAMP, 'alice.johnson@example.com'),
      ('22 chemin des Lilas', CURRENT_TIMESTAMP, 3, 50.6292, 8, 3.0573, 'PENDING', 'OBSTACLES', CURRENT_TIMESTAMP, 'bob.miller@example.com'),
      ('7 rue des Peupliers', CURRENT_TIMESTAMP, 0, 44.8378, 0, -0.5792, 'AVAILABLE', 'ACCIDENTS', CURRENT_TIMESTAMP, 'carol.davis@example.com');
DELETE FROM itinerary;
DROP TABLE IF EXISTS itinerary;

CREATE TABLE itinerary (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         address_end VARCHAR(255),
                         address_start VARCHAR(255),
                         create_date TIMESTAMP,
                         end_latitude DOUBLE,
                         end_longitude DOUBLE,
                         is_peage BOOLEAN,
                         mode ENUM('Court', 'Rapide'),
                         start_latitude DOUBLE,
                         start_longitude DOUBLE,
                         status ENUM('ACTIVE', 'DELETED'),
                         update_date TIMESTAMP,
                         user_name VARCHAR(100)
);

INSERT INTO itinerary (
    address_end, address_start, create_date, end_latitude, end_longitude, is_peage,
    mode, start_latitude, start_longitude, status, update_date, user_name
) VALUES
      ('10 Rue de Lyon', '1 Av. des Champs', CURRENT_TIMESTAMP, 48.8566, 2.3522, false, 'Rapide', 48.8600, 2.3500, 'ACTIVE', CURRENT_TIMESTAMP, 'alice'),
      ('20 Rue Lafayette', '5 Bd Haussmann', CURRENT_TIMESTAMP, 48.8700, 2.3600, true, 'Rapide', 48.8650, 2.3550, 'ACTIVE', CURRENT_TIMESTAMP, 'bob'),
      ('15 Rue Rivoli', '3 Av. Montaigne', CURRENT_TIMESTAMP, 48.8540, 2.3400, false, 'Rapide', 48.8510, 2.3370, 'ACTIVE', CURRENT_TIMESTAMP, 'carol'),
      ('30 Rue Vaugirard', '7 Rue Cler', CURRENT_TIMESTAMP, 48.8450, 2.3100, true, 'Rapide', 48.8420, 2.3050, 'ACTIVE', CURRENT_TIMESTAMP, 'daniel'),
      ('55 Av. Foch', '22 Rue Lecourbe', CURRENT_TIMESTAMP, 48.8705, 2.2930, false, 'Court', 48.8680, 2.2900, 'DELETED', CURRENT_TIMESTAMP, 'eve'),
      ('60 Rue Tolbiac', '9 Rue du Bac', CURRENT_TIMESTAMP, 48.8200, 2.3750, true, 'Court', 48.8230, 2.3700, 'DELETED', CURRENT_TIMESTAMP, 'frank'),
      ('18 Rue Mouffetard', '2 Bd St-Michel', CURRENT_TIMESTAMP, 48.8425, 2.3480, false, 'Court', 48.8400, 2.3450, 'DELETED', CURRENT_TIMESTAMP, 'grace'),
      ('99 Rue St-Honoré', '11 Av. de l’Opéra', CURRENT_TIMESTAMP, 48.8665, 2.3345, false, 'Court', 48.8640, 2.3300, 'DELETED', CURRENT_TIMESTAMP, 'henry');
