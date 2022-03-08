module.exports = {
  content: ["./src/**/*.{ts,tsx,jsx,js}"],
  prefix: "tw-",
  theme: {
    colors: ({colors}) => ({
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      gray: {
        100: colors.gray["100"],
        200: colors.gray["300"],
        300: colors.gray["500"],
      },
    }),
    fontSize: {
      xs: ["0.75rem", {lineHeight: "1rem"}],
      sm: ["0.875rem", {lineHeight: "1.25rem"}],
      base: ["1rem", {lineHeight: "1.5rem"}],
      lg: ["1.125rem", {lineHeight: "1.75rem"}],
      xl: ["1.25rem", {lineHeight: "1.75rem"}],
      "2xl": ["1.5rem", {lineHeight: "2rem"}],
      "3xl": ["1.875rem", {lineHeight: "2.25rem"}],
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
    },
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
