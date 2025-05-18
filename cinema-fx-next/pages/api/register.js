import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs'; 

const userDBPath = path.join(process.cwd(), 'data', 'users.json');

// Helper functions
const getUsers = () => {
    if (!fs.existsSync(userDBPath)) {
        fs.mkdirSync(path.dirname(userDBPath), { recursive: true });
        fs.writeFileSync(userDBPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(userDBPath, 'utf8'));
};

const saveUsers = (users) => {
    fs.writeFileSync(userDBPath, JSON.stringify(users, null, 2));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check existing user
    const users = getUsers();
    if (users.some(u => u.email === email)) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    // Create user
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return res.status(201).json({
            message: 'Registration successful',
            user: { id: newUser.id, username, email }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
