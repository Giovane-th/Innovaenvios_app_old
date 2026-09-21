#!/usr/bin/env python3
"""
Test Correios API with CORRECTED authentication payload (including contrato and dr)
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
contrato = os.environ.get('CORREIOS_CONTRATO')
cod_admin = os.environ.get('CORREIOS_COD_ADMIN')

print("=" * 80)
print("CORREIOS API AUTHENTICATION TEST - CORRECTED PAYLOAD")
print("=" * 80)
print(f"Usuario: {usuario}")
print(f"Cartao: {cartao}")
print(f"Contrato: {contrato}")
print(f"DR (cod_admin): {cod_admin}")
print("=" * 80)

def test_with_payload(env_name, base_url, payload):
    print(f"\n{'=' * 80}")
    print(f"Testing {env_name} with payload: {json.dumps(payload)}")
    print('=' * 80)
    
    url = f"{base_url}/token/v1/autentica/cartaopostagem"
    creds = f"{usuario}:{senha}".encode('utf-8')
    basic = base64.b64encode(creds).decode('ascii')
    
    headers = {
        'Authorization': f'Basic {basic}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    
    try:
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, json=payload, headers=headers)
        
        print(f"Response Status: {resp.status_code}")
        print(f"Response Body: {resp.text if resp.text else '(empty)'}")
        
        if resp.status_code == 200:
            print(f"✅ SUCCESS!")
            data = resp.json()
            token = data.get('token', '')
            print(f"Token: {token[:50]}...")
            return True
        else:
            print(f"❌ FAILED")
            return False
            
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")
        return False

# Test different payload combinations
prod_url = os.environ.get('CORREIOS_API_URL_PROD')
hom_url = os.environ.get('CORREIOS_API_URL_HOM')

print("\n" + "=" * 80)
print("TESTING PRODUCTION ENVIRONMENT")
print("=" * 80)

# Test 1: Original payload (only numero)
payload1 = {'numero': cartao}
result1 = test_with_payload("PROD - Original (numero only)", prod_url, payload1)

# Test 2: With contrato and dr as integers
payload2 = {
    'numero': cartao,
    'contrato': contrato,
    'dr': int(cod_admin)
}
result2 = test_with_payload("PROD - With contrato and dr (int)", prod_url, payload2)

# Test 3: With contrato and dr as strings
payload3 = {
    'numero': cartao,
    'contrato': contrato,
    'dr': cod_admin
}
result3 = test_with_payload("PROD - With contrato and dr (str)", prod_url, payload3)

print("\n" + "=" * 80)
print("TESTING HOMOLOGATION ENVIRONMENT")
print("=" * 80)

# Test 4: Homologation with full payload
result4 = test_with_payload("HOM - With contrato and dr (int)", hom_url, payload2)

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"PROD - numero only:           {'✅' if result1 else '❌'}")
print(f"PROD - with contrato/dr (int): {'✅' if result2 else '❌'}")
print(f"PROD - with contrato/dr (str): {'✅' if result3 else '❌'}")
print(f"HOM  - with contrato/dr (int): {'✅' if result4 else '❌'}")
print("=" * 80)

if not any([result1, result2, result3, result4]):
    print("\n⚠️  CONCLUSION: All authentication attempts FAILED")
    print("\nPossible issues:")
    print("1. The CORREIOS_SENHA might not be the API access code from CWS portal")
    print("2. The credentials might be expired or invalid")
    print("3. Production access might not be enabled for this account")
    print("4. The API access code needs to be regenerated in the CWS portal")
    print("\n📋 NEXT STEPS:")
    print("- Verify CORREIOS_SENHA is the API access code (not regular password)")
    print("- Check if API access code was generated at: https://cws.correios.com.br/")
    print("- Verify production access is enabled for the contract")
