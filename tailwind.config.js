/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const sev = (n) => ({ DEFAULT: v(n), soft: v(`${n}-soft`), ink: v(`${n}-ink`) });

module.exports = {
  content: ['./index.html', './src/**/*.{jsx,js}'],
  theme: {
    extend: {
      colors: {
        backdrop: v('backdrop'),
        canvas: v('canvas'),
        surface: { DEFAULT: v('surface'), 2: v('surface-2') },
        line: v('line'),
        ink: { DEFAULT: v('ink'), 2: v('ink-2'), 3: v('ink-3') },
        brand: { DEFAULT: v('brand'), ink: v('brand-ink'), soft: v('brand-soft') },
        accent: v('accent'),
        sev1: sev('sev1'), sev2: sev('sev2'), sev3: sev('sev3'), sev4: sev('sev4'), sev5: sev('sev5'),
        ok: sev('ok'),
      },
      fontSize: { '2xs': ['11px', '15px'] },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / .04), 0 2px 8px -2px rgb(15 23 42 / .06)',
        float: '0 8px 30px -8px rgb(15 23 42 / .25)',
      },
    },
  },
  // Illyustratsiyalarda dinamik yig'iladigan klasslar
  safelist: ['fill-sev1', 'fill-sev3', 'fill-ok', 'fill-sev1-soft', 'fill-sev3-soft', 'fill-ok-soft'],
  plugins: [],
};
