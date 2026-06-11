UPDATE contacts SET fio = 'Смирнова Анна', phone = '+7 911 555-10-20', email = 'anna.s@mail.ru', telegram = '@anna_s', instagram = '@anna.smile', contact_person = ''
WHERE fio = 'Тестовый Гость' AND id = 1;

UPDATE contacts SET fio = 'Козлов Дмитрий', phone = '+7 926 777-88-99', email = 'kozlov@gmail.com', telegram = '@dmitry_k', instagram = '', contact_person = 'Менеджер — Игорь'
WHERE fio = 'Тестовый Гость' AND id = 2;