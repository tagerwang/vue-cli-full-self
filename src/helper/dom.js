export default {
  addClass (el, cls) {
    if (!cls || !(cls = cls.trim())) {
      return
    }

    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach((c) => el.classList.add(c))
      } else {
        el.classList.add(cls)
      }
    } else {
      var cur = ` ${el.getAttribute('class') || ''} `
      if (cur.indexOf(` ${cls} `) < 0) {
        el.setAttribute('class', (cur + cls).trim())
      }
    }
  },
  removeClass (el, cls) {
    if (!cls || !(cls = cls.trim())) {
      return
    }

    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(c => el.classList.remove(c))
      } else {
        el.classList.remove(cls)
      }
    } else {
      var cur = ` ${el.getAttribute('class') || ''} `
      var tar = ` ${cls} `
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ')
      }
      el.setAttribute('class', cur.trim())
    }
  }
}
