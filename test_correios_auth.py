#!/usr/bin/env python3
"""
Direct test of Correios Production API authentication
"""
import os
import base64
import httpx
import json
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

# Get credentials
usuario = os.environ.get('CORREIOS_USUARIO')
senha = os.environ.get('CORREIOS_SENHA')
cartao = os.environ.get('CORREIOS_CARTAO_POSTAGEM')
ambiente = os.environ.get('CORREIOS_AMBIENTE', 'homologacao').lower()
base_url = (
    os.environ.get('CORREIOS_API_URL_HOM') if ambiente == 'homologacao'
    else os.environ.get('CORREIOS_API_URL_PROD')
)

print("=" * 80)
print("CORREIOS PRODUCTION API AUTHENTICATION TEST")
print("=" * 80)
print(f"Environment: {ambiente}")
print(f"Base URL: {base_url}")
print(f"Usuario: {usuario}")
print(f"Cartao: {cartao}")
print(f"Senha: {'*' * len(senha) if senha else 'NOT SET'}")
print("=" * 80)

# Prepare authentication request
url = f"{base_url}/token/v1/autentica/cartaopostagem"
creds = f"{usuario}:{senha}".encode('utf-8')
basic = base64.b64encode(creds).decode('ascii')

headers = {
    'Authorization': f'Basic {basic}',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

payload = {'numero': cartao}

print(f"\nRequest URL: {url}")
print(f"Request Headers:")
print(f"  Authorization: Basic {basic[:20]}... (truncated)")
print(f"  Content-Type: application/json")
print(f"  Accept: application/json")
print(f"\nRequest Payload:")
print(json.dumps(payload, indent=2))
print("\n" + "=" * 80)
print("Sending request to Correios...")
print("=" * 80)

try:
    with httpx.Client(timeout=30.0) as client:
        resp = client.post(url, json=payload, headers=headers)
    
    print(f"\n✅ Response Status: {resp.status_code}")
    print(f"Response Headers:")
    for key, value in resp.headers.items():
        print(f"  {key}: {value}")
    
    print(f"\nResponse Body:")
    print(resp.text)
    
    if resp.status_code == 200:
        print("\n✅ SUCCESS: Authentication successful!")
        data = resp.json()
        token = data.get('token', '')
        print(f"Token received: {token[:50]}... (truncated)")
    else:
        print(f"\n❌ FAILED: Authentication failed with status {resp.status_code}")
        print("\nPossible reasons:")
        print("  1. Credentials are for homologation environment only")
        print("  2. Production access not enabled for this account")
        print("  3. Additional permissions required for production")
        print("  4. Incorrect credentials for production")
        
except Exception as e:
    print(f"\n❌ EXCEPTION: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
