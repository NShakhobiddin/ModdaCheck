/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{jsx,js}'],
  theme: { extend: {} },
  // Dinamik tarzda yig'iladigan ranglar (JSX ichida to'liq satr sifatida bor, lekin ehtiyot uchun)
  safelist: [
    'shadow-red-200', 'shadow-orange-200', 'shadow-amber-200', 'shadow-cyan-200', 'shadow-purple-200',
    'bg-red-50', 'bg-orange-50', 'bg-amber-50', 'bg-cyan-50', 'bg-purple-50',
    'text-red-700', 'text-orange-700', 'text-amber-700', 'text-cyan-700', 'text-purple-700',
    'border-red-200', 'border-orange-200', 'border-amber-200', 'border-cyan-200', 'border-purple-200',
    'bg-red-600', 'bg-orange-500', 'bg-amber-500', 'bg-cyan-600', 'bg-purple-600',
  ],
  plugins: [],
};
