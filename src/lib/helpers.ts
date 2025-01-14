export const createUrl = (pathname: string, params: URLSearchParams) => {
  const paramsString = params.toString()
  return `${pathname}${paramsString ? '?' : ''}${paramsString}`
}
