const loadEnv = (name: string): string => {
  const variable = process.env[name]
  if (variable === undefined) {
    console.log('Missing required env variable: ' + name)
    process.exit(1)
  }
  return variable
}

export { loadEnv }
