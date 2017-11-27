const LIVE_BASE_URL = '/livebilibilicom'
const API_BASE_URL = '/apibilibilicom'
const API_LIVE_BASE_URL = '/apilivebilibilicom'

// 获取直播间原始ID
export function getRoomBaseInfo(roomUrl) {
  return this.get({
    url: `${API_LIVE_BASE_URL}/room/v1/Room/room_init?id=${roomUrl}`,
    params: {
      id: roomUrl
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return {
      id: data['room_id'],
      shortId: data['short_id'],
      anchorId: data['uid']
    }
  })
}


// 获取直播间信息
export function getRoomInfo() {
  return this.get({
    url: `${API_LIVE_BASE_URL}/room/v1/Room/get_info`,
    params: {
      roomid: this.roomId,
      from: 'room'
    }
  }).then(res => {
    let data = JSON.parse(res).data
    let room = {}
    room.title = data['ROOMTITLE']
    room.areaId = data['AREAID']
    room.cover = data['COVER']
    room.anchor = {
      id: data['MASTERID'],
      name: data['ANCHOR_NICK_NAME']
    }
    room.fans = data['FANS_COUNT']
    room.liveStatus = data['LIVE_STATUS']
    room.liveStartTime = data['LIVE_TIMELINE'] * 1000
    return room
  })
}

// 获取直播间历史弹幕
export function getRoomMessage() {
  return this.get({
    url: `${API_LIVE_BASE_URL}/AppRoom/msg`,
    params: {
      room_id: this.roomId
    }
  }).then(res => {
    let data = JSON.parse(res)
    if (data.code == 0) {
      return data.data.room.map((each, index) => {
        return {
          type: 'comment',
          comment: each.text,
          user: {
            id: each.uid,
            guard: each.guard_level,
            isAdmin: each.isadmin == 1,
            isSVIP: each.vip == 1,
            isVIP: each.svip == 1,
            badge: each.medal.length > 0 ? {
              level: each.medal[0],
              title: each.medal[1]
            } : false,
            title: each.user_title.length > 0 ? {source: each.user_title} : false,
            level: each.user_level.length > 0 ? each.user_level[0] : false,
            name: each.nickname
          }
        }
      })
    }
  })
}

// 获取直播间粉丝列表
export function getAnchorFollwerList(anchorId, page = 1, pageSize = 20) {
  return this.get({
    url: `${API_BASE_URL}/x/relation/followers`,
    params: {
      vmid: anchorId,
      pn: page,
      ps: pageSize
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return data.list.map(follower => {
      return {
        id: follower.mid,
        name: follower.uname
      }
    })
  })
}

// 获取直播间房管列表
export function getRoomAdminList() {
  return this.post({
    url: 'liveact/ajaxGetAdminList',
    body: {
      roomid: this.roomId
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return data.map(admin => {
      return {
        id: admin.id,
        ctime: admin.ctime,
        admin: {
          id: admin.userinfo.uid,
          name: admin.userinfo.uname
        }
      }
    })
  })
}

// 获取被禁言用户列表
export function getRoomBlockList(page = 1) {
  return this.post({
    url: 'liveact/ajaxGetBlockList',
    body: {
      roomid: this.roomId,
      page: page
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return data.map((item) => {
      return {
        id: item.id,
        user: {
          id: item.uid,
          name: item.uname
        },
        admin: {
          id: item.adminid,
          name: item.admin_uname
        },
        ctime: item.ctime,
        etime: item.block_end_time
      }
    })
  })
}
