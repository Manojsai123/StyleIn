import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
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
];
