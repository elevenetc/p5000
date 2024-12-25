function randomNegative(): number {
  return Math.random() > 0.5 ? -1 : 1;
}

export {
  randomNegative
}
