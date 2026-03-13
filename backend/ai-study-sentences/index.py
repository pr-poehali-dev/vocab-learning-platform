"""
AI-генерация предложений: по одному или нескольким словам создаёт N предложений
с переводом и подробным грамматическим объяснением на русском языке.
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
    words = body.get('words', [])
    count = min(int(body.get('count', 3)), 10)

    if not words or not isinstance(words, list):
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'words array is required'}),
        }

    words_str = ', '.join(f'"{w}"' for w in words[:10])

    if len(words) == 1:
        instruction = f'Each sentence must naturally use the word {words_str}. Highlight the target word usage.'
    else:
        instruction = f'Each sentence must naturally use ALL of these words: {words_str}. Try to include all of them in each sentence when possible, or distribute them across sentences.'

    prompt = f"""You are an English language teacher. Generate exactly {count} example sentences.

Words to use: {words_str}
{instruction}

For each sentence provide:
- "sentence": the English sentence
- "translation": accurate Russian translation
- "explanation": detailed grammar explanation in Russian — describe the grammatical role of each part, tenses used, why words appear in their positions, any idioms or phrasal verbs

Respond ONLY with a valid JSON array of {count} objects:
[
  {{"sentence": "...", "translation": "...", "explanation": "..."}},
  ...
]

No markdown, no extra text — just the JSON array."""

    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.7,
        max_tokens=3000,
    )

    raw = response.choices[0].message.content.strip()
    sentences = json.loads(raw)

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'words': words,
            'count': count,
            'sentences': sentences,
        }),
    }
