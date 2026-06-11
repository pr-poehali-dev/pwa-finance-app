INSERT INTO contacts (fio, phone, email, telegram, instagram, contact_person) VALUES
('Иванова Мария Сергеевна', '+7 999 120-45-67', 'maria@mail.ru', '@maria_iv', '@maria.style', 'Агент — Ольга'),
('Петров Алексей', '+7 905 333-22-11', 'petrov@gmail.com', '@alex_p', '@alexphoto', '');

INSERT INTO cal_events (event_date, time_start, time_end, category, title, guest_id, agreement_signed, approved_by_guest, zoom_link) VALUES
('26.06.11', '10:00', '14:00', 'offline', 'Съёмка — лукбук осень', NULL, FALSE, FALSE, ''),
('26.06.12', '15:00', '16:30', 'internal', 'Планёрка команды', NULL, FALSE, FALSE, ''),
('26.06.14', '12:00', '13:00', 'community', 'Интервью с гостем', (SELECT id FROM contacts WHERE fio = 'Иванова Мария Сергеевна' LIMIT 1), TRUE, TRUE, ''),
('26.06.20', '09:00', '11:00', 'online', 'Онлайн-запись подкаста', NULL, FALSE, FALSE, 'https://zoom.us/j/123456');