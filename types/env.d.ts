declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BUILDER_PUBLIC_KEY: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
} 