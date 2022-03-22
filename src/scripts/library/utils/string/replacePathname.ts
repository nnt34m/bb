export default function replacePathname(url: string, newPathname: string) {

  const lastSlashIndex = url.lastIndexOf('/')

  if (lastSlashIndex) {

    const base = url.slice(0, lastSlashIndex)
    url = base + newPathname

  }

  return url

}