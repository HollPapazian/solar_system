const planetSizes = {
  real: {
    mercury: 0.00488,
    venus: 0.012104,
    earth: 0.012742,
    mars: 0.006779,
    jupiter: 0.139822,
    saturn: 0.116464,
    saturnRingsStart: 0.13,
    saturnRingEnd: 0.4,
    uranus: 0.050724,
    neptune: 0.049244,
  },
  cinematic: {
    mercury: 0.2,
    venus: 0.5,
    earth: 0.5,
    mars: 0.3,
    jupiter: 0.8,
    saturn: 0.7,
    saturnRingsStart: 0.75,
    saturnRingEnd: 1.5,
    uranus: 0.6,
    neptune: 0.6,
  },
};

export const config = {
  mercury: { size: 0.00488, scale: 40.98360655737705, bigSize: 0.2 },
  venus: { size: 0.012104, scale: 41.30865829477859, bigSize: 0.5 },
  earth: { size: 0.012742, scale: 39.24030764401193, bigSize: 0.5 },
  mars: { size: 0.006779, scale: 44.25431479569258, bigSize: 0.3 },
  jupiter: { size: 0.139822, scale: 5.721560269485489, bigSize: 0.8 },
  saturn: { size: 0.116464, scale: 6.010440994642121, bigSize: 0.7 },
  saturnRingsStart: { size: 0.13, scale: 5.769230769230769, bigSize: 0.75 },
  saturnRingEnd: { size: 0.4, scale: 3.75, bigSize: 1.5 },
  uranus: { size: 0.050724, scale: 8.828720132481665, bigSize: 0.6 },
  neptune: { size: 0.049244, scale: 8.184225489399722, bigSize: 0.6 },
};
