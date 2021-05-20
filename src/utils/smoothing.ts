export function exponentialSmoothing(
  value1: number,
  value2: number,
  alpha: number
): number {
  return value1 * alpha + value2 * (1 - alpha);
}

export function inverseExponentialSmoothing(
  value: number,
  smoothed: number,
  alpha: number
): number {
  return (smoothed - alpha * value) / (1 - alpha);
}

export function exponentialSmoothingArray(
  arr: number[],
  alpha: number
): number[] {
  let smoothed: number[] = [arr[1] - arr[0]];
  for (let i = 2; i < arr.length; ++i) {
    smoothed.push(
      exponentialSmoothing(arr[i] - arr[i - 1], smoothed[i - 2], alpha)
    );
  }

  return smoothed;
}
