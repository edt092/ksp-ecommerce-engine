// Declare CSS module types so TypeScript accepts CSS imports
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
