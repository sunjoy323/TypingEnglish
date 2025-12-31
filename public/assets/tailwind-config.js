(() => {
  globalThis.tailwind = globalThis.tailwind || {};
  globalThis.tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: "#165DFF",
          secondary: "#36D399",
          danger: "#F87272",
          neutral: "#1E293B",
          "neutral-light": "#F8FAFC",
          gold: "#FFD700",
          silver: "#C0C0C0",
          bronze: "#CD7F32",
        },
        fontFamily: {
          inter: ["Inter", "sans-serif"],
        },
      },
    },
  };
})();

