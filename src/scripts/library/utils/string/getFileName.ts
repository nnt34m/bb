export function getFileName(url: string) {

  return url.split('/').pop()?.split('.')[0]

}