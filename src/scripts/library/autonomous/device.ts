import isWebp from "library:utils/device/isWebp"
import isMobile from "library:utils/device/isMobile"
import isTouch from "library:utils/device/isTouch"

function resize() {
  document.documentElement.style.setProperty('--height', innerHeight + 'px')
  document.documentElement.style.setProperty('--width', innerWidth + 'px')
}

addEventListener('resize', resize)
addEventListener('orientationchange', resize)
resize()

export default {
  isWebp: isWebp(),
  isMobile: isMobile(),
  isTouch: isTouch(),
  pixelRatio: window.devicePixelRatio
}