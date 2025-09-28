export function groupBy<T>(data: Array<T>, key: string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const obj of data) {
    const value = obj[key];
    if (!map.has(value)) {
      map.set(value, []);
    }
    map.get(value)!.push(obj);
  }
  return map;
}
