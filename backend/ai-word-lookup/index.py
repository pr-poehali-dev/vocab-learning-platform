"""
AI-автозаполнение: по английскому слову возвращает транскрипцию и перевод на русский.
Использует OpenAI GPT-4o-mini.
"""

import json
import os
from openai import OpenAI


def handler(event: dict, context) -> dict:
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors_headers, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    word = body.get('word', '').strip()

    if not word:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Word is required'}),
        }

    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    prompt = f"""For the English word "{word}", provide:
1. IPA transcription (e.g. /wɜːrd/)
2. Russian translation (1-3 short variants, separated by comma)

Respond ONLY with valid JSON in this exact format:
{{"transcription": "/..../", "translation": "..."}}

No explanation, no markdown, just JSON."""

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.2,
        max_tokens=100,
    )

    raw = response.choices[0].message.content.strip()
    result = json.loads(raw)

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'word': word,
            'transcription': result.get('transcription', ''),
            'translation': result.get('translation', ''),
        }),
    }
