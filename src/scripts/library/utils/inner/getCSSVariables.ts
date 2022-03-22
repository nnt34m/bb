function isSameDomain(styleSheet: StyleSheet) {

  if (!styleSheet.href) return true
  return styleSheet.href.indexOf(window.location.origin) === 0

}



export default function getCSSVariables(selector = 'html') {

  const res: { [key: string]: any } = {};

  [...document.styleSheets].filter(isSameDomain).forEach(sheet => {

    [...sheet.cssRules].filter(rule =>

      rule instanceof CSSStyleRule && rule.selectorText === selector

    ).forEach(rule => {

      [...(rule as CSSStyleRule).style].forEach((propName) => {

        if (propName.indexOf("--") === 0) {

          res[propName.trim()] = (rule as CSSStyleRule).style.getPropertyValue(propName).trim()

        }

      })

    })

  })

  return res

}
