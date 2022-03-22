export default function kebabize(stringToKebabize: string) {

  return stringToKebabize.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

}
