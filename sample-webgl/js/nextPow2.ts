export function nextPow2(x: number): number {
    let n = 1;
    while (n < x) n <<= 1;
    return n;
}
