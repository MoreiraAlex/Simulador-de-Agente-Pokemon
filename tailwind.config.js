window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        retro: {
          background: "oklch(1 0 0)",
          foreground: "oklch(0.141 0.005 285.823)",
          primary: "oklch(0.637 0.237 25.331)",
          primaryForeground: "oklch(0.971 0.013 17.38)",
          secondary: "oklch(0.967 0.001 286.375)",
          secondaryForeground: "oklch(0.21 0.006 285.885)",
          muted: "oklch(0.967 0.001 286.375)",
          mutedForeground: "oklch(0.552 0.016 285.938)",
          destructive: "oklch(0.577 0.245 27.325)",
        },
      },
      border: {
        retro: {
          background: "oklch(1 0 0)",
          foreground: "oklch(0.141 0.005 285.823)",
        },
      },
      fontFamily: {
        retro: ['"Press Start 2P"', "monospace"],
      },
    },
  },
};
