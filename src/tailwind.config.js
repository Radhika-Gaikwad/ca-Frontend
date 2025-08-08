module.exports = {
  theme: {
    extend: {
      animation: {
        gradientMove: "gradientMove 8s ease infinite",
      },
      keyframes: {
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
};
