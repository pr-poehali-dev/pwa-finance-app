import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    API календаря: контрагенты (contacts) и события (cal_events).
    Поддерживает GET (список) и POST (создание) для обоих ресурсов.
    Ресурс определяется query-параметром resource=contacts|events.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'events')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()

    try:
        if resource == 'contacts':
            if method == 'GET':
                cur.execute(
                    "SELECT id, fio, phone, email, telegram, instagram, contact_person "
                    "FROM contacts ORDER BY id DESC"
                )
                rows = cur.fetchall()
                data = [
                    {
                        'id': r[0], 'fio': r[1], 'phone': r[2], 'email': r[3],
                        'telegram': r[4], 'instagram': r[5], 'contactPerson': r[6],
                    }
                    for r in rows
                ]
                return _ok(cors, data)

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                fio = (body.get('fio') or '').strip()
                if not fio:
                    return _err(cors, 'ФИО обязательно')
                cur.execute(
                    "INSERT INTO contacts (fio, phone, email, telegram, instagram, contact_person) "
                    "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                    (
                        fio, body.get('phone', ''), body.get('email', ''),
                        body.get('telegram', ''), body.get('instagram', ''),
                        body.get('contactPerson', ''),
                    ),
                )
                new_id = cur.fetchone()[0]
                return _ok(cors, {'id': new_id})

        if resource == 'events':
            if method == 'GET':
                cur.execute(
                    "SELECT id, event_date, time_start, time_end, category, title, "
                    "guest_id, agreement_signed, approved_by_guest, zoom_link "
                    "FROM cal_events ORDER BY event_date, time_start"
                )
                rows = cur.fetchall()
                data = [
                    {
                        'id': r[0], 'date': r[1], 'timeStart': r[2], 'timeEnd': r[3],
                        'category': r[4], 'title': r[5], 'guestId': r[6],
                        'agreementSigned': r[7], 'approvedByGuest': r[8], 'zoomLink': r[9],
                    }
                    for r in rows
                ]
                return _ok(cors, data)

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                title = (body.get('title') or '').strip()
                date = (body.get('date') or '').strip()
                if not title or not date:
                    return _err(cors, 'Дата и название обязательны')
                cur.execute(
                    "INSERT INTO cal_events (event_date, time_start, time_end, category, title, "
                    "guest_id, agreement_signed, approved_by_guest, zoom_link) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (
                        date, body.get('timeStart', ''), body.get('timeEnd', ''),
                        body.get('category', 'offline'), title,
                        body.get('guestId'),
                        bool(body.get('agreementSigned', False)),
                        bool(body.get('approvedByGuest', False)),
                        body.get('zoomLink', ''),
                    ),
                )
                new_id = cur.fetchone()[0]
                return _ok(cors, {'id': new_id})

        return _err(cors, 'Неизвестный ресурс или метод', 404)
    finally:
        cur.close()
        conn.close()


def _ok(cors, data):
    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps(data, ensure_ascii=False),
    }


def _err(cors, message, status=400):
    return {
        'statusCode': status,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': message}, ensure_ascii=False),
    }
