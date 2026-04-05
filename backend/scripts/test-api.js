const BASE_URL = 'http://localhost:5000/api/v1';

async function testApi() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // 1. Auth Tests
    console.log('--- Auth Tests ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'password123' }),
    });
    const loginData = await loginRes.json();
    
    if (!loginData.success) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    const token = loginData.data.token;
    console.log('✅ Login successful. Token received.');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 2. Records Tests
    console.log('\n--- Records Tests ---');
    
    // Create Record
    const createRes = await fetch(`${BASE_URL}/records`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: 1500,
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString(),
        note: 'Team Dinner',
      }),
    });
    const createData = await createRes.json();
    if (!createData.success) throw new Error(`Create Record failed: ${JSON.stringify(createData)}`);
    console.log('✅ Create Record successful.');
    const recordId = createData.data._id;

    // Get All Records
    const listRes = await fetch(`${BASE_URL}/records`, { headers });
    const listData = await listRes.json();
    if (!listData.success) throw new Error(`List Records failed: ${JSON.stringify(listData)}`);
    console.log(`✅ List Records successful. Found ${listData.pagination.total} records.`);

    // Update Record
    const updateRes = await fetch(`${BASE_URL}/records/${recordId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ amount: 2000, note: 'Fancy Team Dinner' }),
    });
    const updateData = await updateRes.json();
    if (!updateData.success) throw new Error(`Update Record failed: ${JSON.stringify(updateData)}`);
    console.log('✅ Update Record successful.');

    // 3. Dashboard Tests
    console.log('\n--- Dashboard Tests ---');
    const dashRes = await fetch(`${BASE_URL}/dashboard/summary`, { headers });
    const dashData = await dashRes.json();
    if (!dashData.success) throw new Error(`Dashboard Summary failed: ${JSON.stringify(dashData)}`);
    console.log('✅ Dashboard Summary successful.');
    console.log(`   Totals: Income: ${dashData.data.totals.income}, Expense: ${dashData.data.totals.expense}, Net: ${dashData.data.totals.netBalance}`);

    // 4. Users Tests (Admin Only)
    console.log('\n--- Users Tests ---');
    const usersRes = await fetch(`${BASE_URL}/users`, { headers });
    const usersData = await usersRes.json();
    if (!usersData.success) throw new Error(`List Users failed: ${JSON.stringify(usersData)}`);
    console.log(`✅ List Users successful. Found ${usersData.count} users.`);

    // 5. Delete Record
    console.log('\n--- Cleanup ---');
    const deleteRes = await fetch(`${BASE_URL}/records/${recordId}`, {
      method: 'DELETE',
      headers,
    });
    const deleteData = await deleteRes.json();
    if (!deleteData.success) throw new Error(`Delete Record failed: ${JSON.stringify(deleteData)}`);
    console.log('✅ Delete Record successful.');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error.message);
    process.exit(1);
  }
}

testApi();
