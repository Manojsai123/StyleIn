import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'style-in-secret-key-123';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Initial DB state
const initialData = {
  users: [
    { id: '1', email: 'admin@stylein.com', password: 'hashed_admin_password', role: 'admin', name: 'Admin User' }
  ],
  products: [
    {
      id: '1',
      name: 'Terra Ember',
      brand: 'Style In',
      price: 11999,
      description: 'Sophisticated minimalism. A pristine white leather base accented with a distinct earthy ember heel counter for an artisanal, high-end look.',
      category: 'Lifestyle',
      images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop'],
      sizes: ['7', '8', '9', '10', '11'],
      stock: 32,
      featured: true
    },
    {
      id: '2',
      name: 'Sunset Ridge',
      brand: 'Style In',
      price: 12499,
      description: 'Dynamic performance meets street style. Premium leather base complemented by warm sunset orange side panels and a refined white silhouette.',
      category: 'Streetwear',
      images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=2070&auto=format&fit=crop'],
      sizes: ['8', '9', '10', '11', '12'],
      stock: 28,
      featured: true
    },
    {
      id: '3',
      name: 'Sierra Wave',
      brand: 'Style In',
      price: 11499,
      description: 'Modern topographies on a classic frame. Elegant brown accents wrap around a crisp white leather body for a distinctive urban look.',
      category: 'Streetwear',
      images: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1920&auto=format&fit=crop'],
      sizes: ['7', '8', '9', '10', '11'],
      stock: 22,
      featured: true
    },
    {
      id: '4',
      name: 'Sandstone Lux',
      brand: 'Style In',
      price: 13999,
      description: 'The ultimate in textural luxury. Rich tan suede overlays paired with high-grade athletic materials for superior all-day comfort.',
      category: 'Premium',
      images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1920&auto=format&fit=crop'],
      sizes: ['8', '9', '10', '11', '12'],
      stock: 18,
      featured: true
    },
    {
      id: '5',
      name: 'Metro Peak',
      brand: 'Style In',
      price: 14499,
      description: 'A grey-scale masterpiece. Multi-paneled architectural design featuring a blend of premium mesh and matte leather overlays.',
      category: 'Streetwear',
      images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      stock: 15,
      featured: true
    },
    {
      id: '6',
      name: 'Zenith Flow',
      brand: 'Style In',
      price: 12999,
      description: 'Seamless movement. Breathable performance mesh accented with sophisticated tan and grey geometric panels.',
      category: 'Performance',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920&auto=format&fit=crop'],
      sizes: ['7', '8', '9', '10', '11'],
      stock: 20,
      featured: true
    }
  ],
  orders: []
};

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

async function readDb() {
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeDb(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function startServer() {
  await ensureDb();
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.sendStatus(403);
    next();
  };

  // API Routes
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const db = await readDb();
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role: 'user' };
    db.users.push(newUser);
    await writeDb(db);
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, name, email, role: newUser.role } });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await readDb();
    const user = db.users.find((u: any) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password)) && user.password !== 'hashed_admin_password') {
       // Special case for initial admin password if not hashed yet or match literal
       if (user && user.password === 'hashed_admin_password' && password === 'admin123') {
         // allow
       } else {
         return res.status(401).json({ message: 'Invalid credentials' });
       }
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get('/api/products', async (req, res) => {
    const db = await readDb();
    res.json(db.products);
  });

  app.get('/api/products/:id', async (req, res) => {
    const db = await readDb();
    const product = db.products.find((p: any) => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  });

  app.post('/api/orders', authenticateToken, async (req, res) => {
    const db = await readDb();
    const newOrder = {
      id: Date.now().toString(),
      userId: req.user.id,
      items: req.body.items,
      total: req.body.total,
      address: req.body.address,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    await writeDb(db);
    res.status(201).json(newOrder);
  });

  app.get('/api/user/orders', authenticateToken, async (req, res) => {
    const db = await readDb();
    const userOrders = db.orders.filter((o: any) => o.userId === req.user.id);
    res.json(userOrders);
  });

  // Admin Routes
  app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
    const db = await readDb();
    res.json(db.orders);
  });

  app.post('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
    const db = await readDb();
    const newProduct = { ...req.body, id: Date.now().toString() };
    db.products.push(newProduct);
    await writeDb(db);
    res.status(201).json(newProduct);
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
