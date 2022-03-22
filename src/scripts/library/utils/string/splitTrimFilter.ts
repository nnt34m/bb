export default function splitTrimFilter(str: string, separator = '') {

  return str.split(separator).map(option => option.trim()).filter(option => !!option)

}
