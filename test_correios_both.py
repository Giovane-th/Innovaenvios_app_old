#!/usr/bin/env python3
"""
Test Correios API in BOTH homologation and production to compare
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

def test_environment(env_name, base_url):
    print("\n" + "=" * 80)
    print(f"TESTING {env_name.upper()} ENVIRONMENT")
    print("=" * 80)
    print(f"Base URL: {base_url}")
    
    url = f"{base_url}/token/v1/autentica/cartaopostagem"
    creds = f"{usuario}:{senha}".encode('utf-8')
    basic = base64.b64encode(creds).decode('ascii')
    
    headers = {
        'Authorization': f'Basic {basic}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    
    payload = {'numero': cartao}
    
    print(f"Request URL: {url}")
    print(f"Payload: {json.dumps(payload)}")
    
    try:
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, json=payload, headers=headers)
        
        print(f"\nResponse Status: {resp.status_code}")
        print(f"Response Body: {resp.text if resp.text else '(empty)'}")
        
        if resp.status_code == 200:
            print(f"✅ SUCCESS: {env_name} authentication WORKS!")
            data = resp.json()
            token = data.get('token', '')
            print(f"Token: {token[:50]}...")
            return True
        else:
            print(f"❌ FAILED: {env_name} authentication failed")
            return False
            
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")
        return False

print("=" * 80)
print("CORREIOS API ENVIRONMENT COMPARISON TEST")
print("=" * 80)
print(f"Usuario: {usuario}")
print(f"Cartao: {cartao}")
print("=" * 80)

# Test both environments
hom_url = os.environ.get('CORREIOS_API_URL_HOM')
prod_url = os.environ.get('CORREIOS_API_URL_PROD')

hom_result = test_environment("HOMOLOGATION", hom_url)
prod_result = test_environment("PRODUCTION", prod_url)

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Homologation: {'✅ WORKS' if hom_result else '❌ FAILS'}")
print(f"Production:   {'✅ WORKS' if prod_result else '❌ FAILS'}")
print("=" * 80)

if hom_result and not prod_result:
    print("\n⚠️  CONCLUSION: Credentials are VALID for HOMOLOGATION but NOT for PRODUCTION")
    print("This indicates that production access needs to be separately enabled/approved.")
elif not hom_result and not prod_result:
    print("\n⚠️  CONCLUSION: Credentials are INVALID in both environments")
elif prod_result:
    print("\n✅ CONCLUSION: Production access is working!")
