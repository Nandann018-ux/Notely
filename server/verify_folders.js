const http = require('http');

// Utils for fetch-like behavior since node might be old
function request(path, options = {}, body = null) {
    return new Promise((resolve, reject) => {
        const reqOpts = {
            hostname: 'localhost',
            port: 3000,
            path,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = http.request(reqOpts, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    try {
        console.log('1. Registering User...');
        const uniqueUser = `user_${Date.now()}`;
        const regRes = await request('/api/auth/register', { method: 'POST' }, {
            username: uniqueUser,
            email: `${uniqueUser}@test.com`,
            password: 'password123'
        });

        if (regRes.status !== 201) throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
        console.log('User registered.');

        console.log('2. Logging In...');
        const loginRes = await request('/api/auth/login', { method: 'POST' }, {
            email: `${uniqueUser}@test.com`,
            password: 'password123'
        });

        if (loginRes.status !== 200) throw new Error('Login failed');
        const token = loginRes.body.token;
        console.log('Logged in. Token acquired.');

        console.log('3. creating Folder...');
        const folderRes = await request('/api/folders', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }, { name: 'Work' });

        if (folderRes.status !== 201) throw new Error(`Folder creation failed: ${JSON.stringify(folderRes.body)}`);
        const folderId = folderRes.body._id;
        console.log('Folder created:', folderId);

        console.log('4. Verifying Folder List...');
        const foldersRes = await request('/api/folders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const folderFound = foldersRes.body.find(f => f._id === folderId);
        if (!folderFound) throw new Error('Folder not found in list');
        console.log('Folder verified in list.');

        console.log('5. Creating Note with Folder...');
        const noteId = Date.now().toString();
        const syncRes = await request('/api/notes/sync', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }, {
            notes: [{
                id: noteId,
                title: 'Test Note',
                content: 'Test Content',
                folderId: folderId,
                lastModified: Date.now(),
                isDeleted: false,
                tags: []
            }]
        });

        if (syncRes.status !== 200) throw new Error(`Sync failed: ${JSON.stringify(syncRes.body)}`);
        console.log('Note synced.');

        console.log('6. Verifying Note Folder Link...');
        const notesRes = await request('/api/notes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const note = notesRes.body.find(n => n.id === noteId);
        if (!note || note.folderId !== folderId) {
            console.error('Note:', note);
            throw new Error('Note folderId mismatch or note not found');
        }
        console.log('Note verification successful! FolderId matches.');

        console.log('ALL TESTS PASSED');
    } catch (e) {
        console.error('TEST FAILED:', e.message);
        process.exit(1);
    }
}

run();
