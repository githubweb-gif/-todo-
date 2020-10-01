const directives = {
  mouseover: {
    inserted: function(el) {
      el.onmouseover = function() {
        const childrenNode = el.children
        childrenNode.forEach(item => {
          if (item.className === 'el-icon-close') {
            item.style.display = 'block'
          }
        })
      }
    }
  },
  mouseout: {
    inserted: function(el) {
      el.onmouseout = function() {
        const childrenNode = el.children
        childrenNode.forEach(item => {
          if (item.className === 'el-icon-close') {
            item.style.display = 'none'
          }
        })
      }
    }
  }
}

export default directives
