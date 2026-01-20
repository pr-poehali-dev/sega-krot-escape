import json
import random
import time
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для получения данных о вилках в букмекерских конторах'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method == 'GET':
        opportunities = generate_arbitrage_opportunities()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'count': len(opportunities),
                'data': opportunities,
                'timestamp': datetime.now().isoformat()
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }


def generate_arbitrage_opportunities():
    '''Генерация примеров арбитражных возможностей'''
    bookmakers = [
        'Bet365', 'Фонбет', 'Winline', '1xBet', 
        'Marathon', 'BaltBet', 'Лига Ставок', 'Parimatch'
    ]
    
    sports_data = {
        'Футбол': {
            'leagues': ['Премьер-лига', 'Лига чемпионов', 'Бундeslига', 'Серия А'],
            'teams': [
                ['Манчестер Сити', 'Ливерпуль'],
                ['Бавария', 'Боруссия Д'],
                ['Реал Мадрид', 'Барселона'],
                ['Интер', 'Милан']
            ]
        },
        'Теннис': {
            'leagues': ['ATP', 'WTA', 'Турнир Большого шлема'],
            'teams': [
                ['Новак Джокович', 'Карлос Алькарас'],
                ['Арина Соболенко', 'Ига Свёнтек'],
                ['Даниил Медведев', 'Янник Синнер']
            ]
        },
        'Баскетбол': {
            'leagues': ['NBA', 'Евролига', 'ВТБ'],
            'teams': [
                ['Лейкерс', 'Бостон Селтикс'],
                ['ЦСКА', 'Зенит'],
                ['Реал Мадрид', 'Барселона']
            ]
        },
        'Хоккей': {
            'leagues': ['КХЛ', 'NHL', 'Чемпионат мира'],
            'teams': [
                ['ЦСКА', 'СКА'],
                ['Авангард', 'Ак Барс'],
                ['Торонто', 'Бостон']
            ]
        }
    }
    
    opportunities = []
    num_opps = random.randint(3, 6)
    
    attempts = 0
    while len(opportunities) < num_opps and attempts < 20:
        attempts += 1
        
        sport = random.choice(list(sports_data.keys()))
        sport_info = sports_data[sport]
        league = random.choice(sport_info['leagues'])
        teams = random.choice(sport_info['teams'])
        
        odds1 = round(random.uniform(1.8, 2.8), 2)
        odds2 = round(random.uniform(1.8, 2.8), 2)
        
        implied_prob = (1/odds1 + 1/odds2)
        if implied_prob >= 0.98:
            continue
        
        profit_percent = round((1/implied_prob - 1) * 100, 2)
        
        if profit_percent < 2 or profit_percent > 12:
            continue
        
        bk1 = random.choice(bookmakers)
        bk2 = random.choice([b for b in bookmakers if b != bk1])
        
        total_stake = 10000
        stake1 = round(total_stake / (1 + odds1/odds2), 2)
        stake2 = round(total_stake - stake1, 2)
        
        event_type = 'live' if random.random() > 0.5 else 'prematch'
        
        opportunities.append({
            'id': f'arb-{int(time.time() * 1000)}-{random.randint(1000, 9999)}',
            'sport': sport,
            'league': league,
            'event': f'{teams[0]} - {teams[1]}',
            'type': event_type,
            'profit': profit_percent,
            'timestamp': datetime.now().isoformat(),
            'bets': [
                {
                    'bookmaker': bk1,
                    'outcome': 'П1',
                    'odds': odds1,
                    'stake': stake1
                },
                {
                    'bookmaker': bk2,
                    'outcome': 'П2',
                    'odds': odds2,
                    'stake': stake2
                }
            ]
        })
    
    return opportunities