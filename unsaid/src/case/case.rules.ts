export function deriveCaseNumbers(suspectCount: number) {
  return {
    clueCount: suspectCount + 2,
    redHerringCount: Math.ceil(suspectCount / 2),
  };
}