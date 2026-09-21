#!/usr/bin/env python3
"""
Backend Test Suite for In'Nova Envios - Correios Production API Testing
Tests the Correios API integration in PRODUCTION mode
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend/.env
BASE_URL = "https://delivery-desk-12.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def log(msg, color=Colors.RESET):
    print(f"{color}{msg}{Colors.RESET}")

def log_success(msg):
    log(f"✅ {msg}", Colors.GREEN)

def log_error(msg):
    log(f"❌ {msg}", Colors.RED)

def log_info(msg):
    log(f"ℹ️  {msg}", Colors.BLUE)

def log_warning(msg):
    log(f"⚠️  {msg}", Colors.YELLOW)

def print_json(data, title="Response"):
    log(f"\n{title}:", Colors.YELLOW)
    print(json.dumps(data, indent=2, ensure_ascii=False))

# Global token storage
auth_token = None

def test_register_user():
    """Test 1: Register a new test user"""
    global auth_token
    log_info("TEST 1: Registering new test user for Correios testing...")
    
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    payload = {
        "name": f"Correios Test User {timestamp}",
        "email": f"correios_test_{timestamp}@example.com",
        "phone": "11987654321",
        "password": "Test@123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            auth_token = data.get('access_token')
            user = data.get('user', {})
            log_success(f"User registered successfully: {user.get('email')}")
            log_info(f"User ID: {user.get('id')}")
            log_info(f"Initial balance: R$ {user.get('saldo', 0):.2f}")
            log_info(f"Auth token obtained: {auth_token[:20]}...")
            return True
        else:
            log_error(f"Registration failed: {response.status_code}")
            print_json(response.json(), "Error Response")
            return False
    except Exception as e:
        log_error(f"Registration exception: {str(e)}")
        return False

def test_correios_scenario_1():
    """Test 2: Correios Production API - Scenario 1 (São Paulo → Rio de Janeiro, 300g)"""
    log_info("\nTEST 2: Correios Production API - Scenario 1")
    log_info("Route: São Paulo (01001000) → Rio de Janeiro (20040020)")
    log_info("Package: 300g, 16x11x2 cm")
    
    payload = {
        "cep_origem": "01001000",
        "cep_destino": "20040020",
        "peso_g": 300,
        "comprimento": 16,
        "largura": 11,
        "altura": 2
    }
    
    try:
        response = requests.post(f"{BASE_URL}/frete/calcular", json=payload, timeout=30)
        
        log_info(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_json(data, "✅ CORREIOS PRODUCTION API SUCCESS - Full Response")
            
            resultados = data.get('resultados', [])
            if resultados:
                log_success(f"Received {len(resultados)} shipping options:")
                for r in resultados:
                    log_info(f"  • {r.get('nome')} ({r.get('codigo')}): R$ {r.get('valor'):.2f} - {r.get('prazo_dias')} dias")
                    if r.get('erro'):
                        log_warning(f"    Error: {r.get('erro')}")
                return True
            else:
                log_warning("No results returned from Correios")
                return False
        else:
            log_error(f"Correios API call failed: {response.status_code}")
            print_json(response.json(), "Error Response")
            return False
            
    except Exception as e:
        log_error(f"Exception during Correios API call: {str(e)}")
        return False

def test_correios_scenario_2():
    """Test 3: Correios Production API - Scenario 2 (Curitiba → Brasília, 1kg)"""
    log_info("\nTEST 3: Correios Production API - Scenario 2")
    log_info("Route: Curitiba (80010000) → Brasília (70040010)")
    log_info("Package: 1000g (1kg), 16x11x2 cm")
    
    payload = {
        "cep_origem": "80010000",
        "cep_destino": "70040010",
        "peso_g": 1000,
        "comprimento": 16,
        "largura": 11,
        "altura": 2
    }
    
    try:
        response = requests.post(f"{BASE_URL}/frete/calcular", json=payload, timeout=30)
        
        log_info(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_json(data, "✅ CORREIOS PRODUCTION API SUCCESS - Full Response")
            
            resultados = data.get('resultados', [])
            if resultados:
                log_success(f"Received {len(resultados)} shipping options:")
                for r in resultados:
                    log_info(f"  • {r.get('nome')} ({r.get('codigo')}): R$ {r.get('valor'):.2f} - {r.get('prazo_dias')} dias")
                    if r.get('erro'):
                        log_warning(f"    Error: {r.get('erro')}")
                return True
            else:
                log_warning("No results returned from Correios")
                return False
        else:
            log_error(f"Correios API call failed: {response.status_code}")
            print_json(response.json(), "Error Response")
            return False
            
    except Exception as e:
        log_error(f"Exception during Correios API call: {str(e)}")
        return False

def test_correios_scenario_3():
    """Test 4: Correios Production API - Scenario 3 (Recife → Salvador, 500g)"""
    log_info("\nTEST 4: Correios Production API - Scenario 3")
    log_info("Route: Recife (50010000) → Salvador (40010000)")
    log_info("Package: 500g, 16x11x2 cm")
    
    payload = {
        "cep_origem": "50010000",
        "cep_destino": "40010000",
        "peso_g": 500,
        "comprimento": 16,
        "largura": 11,
        "altura": 2
    }
    
    try:
        response = requests.post(f"{BASE_URL}/frete/calcular", json=payload, timeout=30)
        
        log_info(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_json(data, "✅ CORREIOS PRODUCTION API SUCCESS - Full Response")
            
            resultados = data.get('resultados', [])
            if resultados:
                log_success(f"Received {len(resultados)} shipping options:")
                for r in resultados:
                    log_info(f"  • {r.get('nome')} ({r.get('codigo')}): R$ {r.get('valor'):.2f} - {r.get('prazo_dias')} dias")
                    if r.get('erro'):
                        log_warning(f"    Error: {r.get('erro')}")
                return True
            else:
                log_warning("No results returned from Correios")
                return False
        else:
            log_error(f"Correios API call failed: {response.status_code}")
            print_json(response.json(), "Error Response")
            return False
            
    except Exception as e:
        log_error(f"Exception during Correios API call: {str(e)}")
        return False

def main():
    log("=" * 80, Colors.BLUE)
    log("CORREIOS PRODUCTION API INTEGRATION TEST", Colors.BLUE)
    log("=" * 80, Colors.BLUE)
    log_info(f"Backend URL: {BASE_URL}")
    log_info(f"Environment: PRODUCTION (api.correios.com.br)")
    log_info(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log("=" * 80, Colors.BLUE)
    
    results = []
    
    # Test 1: Register user
    results.append(("User Registration", test_register_user()))
    
    if not auth_token:
        log_error("\n❌ CRITICAL: Cannot proceed without authentication token")
        sys.exit(1)
    
    # Test 2-4: Correios API scenarios
    results.append(("Correios Scenario 1 (SP→RJ, 300g)", test_correios_scenario_1()))
    results.append(("Correios Scenario 2 (Curitiba→Brasília, 1kg)", test_correios_scenario_2()))
    results.append(("Correios Scenario 3 (Recife→Salvador, 500g)", test_correios_scenario_3()))
    
    # Summary
    log("\n" + "=" * 80, Colors.BLUE)
    log("TEST SUMMARY", Colors.BLUE)
    log("=" * 80, Colors.BLUE)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        if result:
            log_success(f"{test_name}: PASSED")
        else:
            log_error(f"{test_name}: FAILED")
    
    log("\n" + "=" * 80, Colors.BLUE)
    log(f"TOTAL: {passed}/{total} tests passed", Colors.GREEN if passed == total else Colors.RED)
    log("=" * 80, Colors.BLUE)
    
    # Check backend logs
    log_info("\n📋 To check backend logs for detailed Correios API responses, run:")
    log_info("tail -n 100 /var/log/supervisor/backend.err.log")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
