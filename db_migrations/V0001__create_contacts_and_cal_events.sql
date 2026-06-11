CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    fio VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    telegram VARCHAR(100) DEFAULT '',
    instagram VARCHAR(100) DEFAULT '',
    contact_person VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cal_events (
    id SERIAL PRIMARY KEY,
    event_date VARCHAR(10) NOT NULL,
    time_start VARCHAR(5) DEFAULT '',
    time_end VARCHAR(5) DEFAULT '',
    category VARCHAR(20) NOT NULL,
    title VARCHAR(500) NOT NULL,
    guest_id INTEGER,
    agreement_signed BOOLEAN DEFAULT FALSE,
    approved_by_guest BOOLEAN DEFAULT FALSE,
    zoom_link VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cal_events_date ON cal_events(event_date);