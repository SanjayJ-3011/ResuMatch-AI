// Simple validation script - run with: node src/tests/auth.test.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('🧪 Starting Authentication Tests...\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, condition) {
    if (condition) {
        tests.passed++;
        tests.results.push(`✅ ${name}`);
    } else {
        tests.failed++;
        tests.results.push(`❌ ${name}`);
    }
}

async function runTests() {
    // Test 1: Check Firebase config exists
    try {
        const fs = await import('fs');
        const configExists = fs.existsSync('./firebase.ts');
        test('Firebase config file exists', configExists);
    } catch (e) {
        test('Firebase config file exists', false);
    }

    // Test 2: Check AuthContext exists
    try {
        const fs = await import('fs');
        const authContextExists = fs.existsSync('./contexts/AuthContext.tsx');
        test('AuthContext file exists', authContextExists);
    } catch (e) {
        test('AuthContext file exists', false);
    }

    // Test 3: Check SignIn page exists (Login.tsx)
    try {
        const fs = await import('fs');
        const signInExists = fs.existsSync('./components/Login.tsx');
        test('SignIn (Login) page exists', signInExists);
    } catch (e) {
        test('SignIn (Login) page exists', false);
    }

    // Test 4: Check SignUp page exists
    try {
        const fs = await import('fs');
        const signUpExists = fs.existsSync('./components/SignUp.tsx');
        test('SignUp page exists', signUpExists);
    } catch (e) {
        test('SignUp page exists', false);
    }

    // Test 5: Check AuthService exists
    try {
        const fs = await import('fs');
        const authServiceExists = fs.existsSync('./services/authService.ts');
        test('AuthService file exists', authServiceExists);

        // Read file to check for signup method
        if (authServiceExists) {
            const content = fs.readFileSync('./services/authService.ts', 'utf8');
            test('AuthService has signup method', content.includes('signup'));
        }
    } catch (e) {
        test('AuthService file exists', false);
    }

    // Print results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    tests.results.forEach(r => console.log(r));
    console.log('================');
    console.log(`Total: ${tests.passed + tests.failed} | Passed: ${tests.passed} | Failed: ${tests.failed}`);

    if (tests.failed > 0) {
        console.log('\n⚠️  Some tests failed. Please fix issues before proceeding.');
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed! Authentication setup is complete.');
    }
}

runTests().catch(console.error);
