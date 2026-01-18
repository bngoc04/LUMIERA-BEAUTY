import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { JSONFilePreset } from 'lowdb/node';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/đangnhap.html');
});

// Database setup
const defaultData = { appointments: [], services: [], customers: [], users: [], settings: {}, attendance: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Ensure attendance collection exists for existing databases
if (!db.data.attendance) {
    await db.update((data) => data.attendance = []);
}

// Routes

// 1. Appointments
app.get('/api/appointments', (req, res) => {
    const { appointments } = db.data;
    res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
    const appointment = req.body;
    appointment.id = Date.now().toString(); // Simple ID generation
    appointment.status = 'pending';
    appointment.createdAt = new Date().toISOString();

    await db.update(({ appointments }) => appointments.push(appointment));
    res.status(201).json(appointment);
});

app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    await db.update(({ appointments }) => {
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1) appointments.splice(index, 1);
    });
    res.status(204).send();
});

app.patch('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    await db.update(({ appointments }) => {
        const appointment = appointments.find(a => a.id === id);
        if (appointment) {
            Object.assign(appointment, updates);
        }
    });
    res.status(200).json({ message: 'Updated' });
});


// 2. Services
app.get('/api/services', (req, res) => {
    const { services } = db.data;
    res.json(services);
});

app.post('/api/services', async (req, res) => {
    const service = req.body;
    service.id = Date.now().toString();
    await db.update(({ services }) => services.push(service));
    res.status(201).json(service);
});

app.delete('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    await db.update(({ services }) => {
        const index = services.findIndex(s => s.id === id);
        if (index !== -1) services.splice(index, 1);
    });
    res.status(204).send();
});

// 3. Customers
app.get('/api/customers', (req, res) => {
    const { customers } = db.data;
    res.json(customers);
});

// 4. Settings
app.get('/api/settings', (req, res) => {
    const { settings } = db.data;
    res.json(settings);
});

app.post('/api/settings', async (req, res) => {
    const newSettings = req.body;
    await db.update(({ settings }) => Object.assign(settings, newSettings));
    res.json(newSettings);
});

// 5. Attendance
app.get('/api/attendance', (req, res) => {
    const { attendance } = db.data;
    res.json(attendance);
});

app.post('/api/attendance', async (req, res) => {
    const record = req.body;
    record.id = Date.now().toString();
    record.date = record.date || new Date().toISOString().split('T')[0];
    record.checkIn = record.checkIn || new Date().toLocaleTimeString();
    record.status = 'present'; // present, absent, leave

    await db.update(({ attendance }) => attendance.push(record));
    res.status(201).json(record);
});

app.patch('/api/attendance/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // e.g., { checkOut: '17:00', status: 'completed' }

    await db.update(({ attendance }) => {
        const record = attendance.find(r => r.id === id);
        if (record) {
            Object.assign(record, updates);
        }
    });
    res.status(200).json({ message: 'Attendance updated' });
});

app.delete('/api/attendance/:id', async (req, res) => {
    const { id } = req.params;
    await db.update(({ attendance }) => {
        const index = attendance.findIndex(r => r.id === id);
        if (index !== -1) attendance.splice(index, 1);
    });
    res.status(204).send();
});

// 5. Auth
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const { users } = db.data;

    // Allow login with either username or email/phone if we were using a real DB
    // For now, match username OR create a convention
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, token: 'mock-token-12345', user: { name: user.name, username: user.username, role: user.role } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/register', async (req, res) => {
    const { email, phone, password } = req.body;

    // Check if user exists
    const users = db.data.users;
    if (users.find(u => u.username === email || u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        username: email, // Use email as username for now
        email,
        phone,
        password,
        name: email.split('@')[0], // Default name
        role: 'user'
    };

    await db.update(({ users }) => users.push(newUser));
    res.status(201).json({ success: true, message: 'Registration successful' });
});

app.post('/api/forgot-password', async (req, res) => {
    const { identity, newPassword } = req.body; // identity can be email or phone
    const users = db.data.users;

    // Simple mock finding user by email for reset
    const user = users.find(u => u.email === identity || u.phone === identity);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    await db.update(({ users }) => {
        const u = users.find(u => u.id === user.id);
        if (u) u.password = newPassword;
    });

    res.json({ success: true, message: 'Password reset successful' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
