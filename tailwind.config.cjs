/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
		require("@catppuccin/tailwindcss")({
			prefix: "ctp",
			defaultFlavour: "macchiato"
		})
	]
}