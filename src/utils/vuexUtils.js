export default {

  getUserNameFromState(that){  // 获取用户姓名
    return  that.$store.state.userName
  },

  setUserNameWithState(that, name) { // 设置用户姓名
    that.$store.dispatch('updateUserName', name)
  },

  setSchoolNameWithState(that, name) { // 设置机构名
    that.$store.dispatch('updateSchoolName', name)
  },
  setUserAvatarWithState(that, url) { // 设置用户头像
    that.$store.dispatch('updateUserAvatar',url)
  },

  setSystemMenuState(that, menu) { // 设置menu菜单数据
    that.$store.dispatch("setSystemMenu", menu)
  },
  getMenuArray(that) {
    const systemArray = []
    systemArray.push(that.$store.state.systemMenu[0]) // 我的课堂页面
    that.$store.state.systemMenu.map(child=>{
      if(child.children && child.children.length>0){
        child.children.map(item=>systemArray.push(item))
      }
    })
    return systemArray
  },
  checkMenuExist(that, url) { // 通过 url 获取菜单对象
    const obj = {
      exist: false,
      target: ''
    }
    if(that.$store.state.systemMenu && that.$store.state.systemMenu.length>0){
      const systemArray = this.getMenuArray(that)
      that.$store.state.systemMenu.map(child=>{
        if(child.children && child.children.length>0){
          child.children.map(menu=>systemArray.push(menu))
        }
      })
      const index = systemArray.findIndex(item=>item.url==url)
      if(index!=-1){ // 查找到了对应menuUrl
        obj.exist = true
        obj.target = systemArray[index]
      }
    }
    return obj
  }
}
