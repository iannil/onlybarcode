/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

declare module '*.test.ts' {
  const content: unknown
  export default content
}

declare module '*.test.tsx' {
  const content: unknown
  export default content
}

declare module '*.spec.ts' {
  const content: unknown
  export default content
}

declare module '*.spec.tsx' {
  const content: unknown
  export default content
} 