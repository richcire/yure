export function cleanAndLowercase(str1: string, str2: string): string {
  return (str1 + str2)
    .replaceAll(/[\n\r\t\b\f\v]/g, "")
    .replaceAll(" ", "")
    .toLowerCase();
}
