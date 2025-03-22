/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ เปิด dark mode แบบใช้ class
  content: [
    './views/**/*.ejs',   // ✅ ให้ Tailwind รู้ว่ามี class อยู่ในไฟล์เหล่านี้
    './public/**/*.js'    // ✅ เผื่อ class อยู่ใน script หรือ dynamic JS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
