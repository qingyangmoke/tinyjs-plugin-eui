const easings = {
  linear(p) {
    return p;
  },
  swing(p) {
    return 0.5 - Math.cos(p * Math.PI) / 2;
  },
};

export default easings;
