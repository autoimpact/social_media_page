/* 初始設定 */

const baseURL = 'https://lighthouse-user-api.herokuapp.com'
const indexURL = baseURL + '/api/v1/users/'
const friendsList = JSON.parse(localStorage.getItem('favoriteFriends'))

const cardWrap = document.querySelector('.card-wrap')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

/* 渲染頁面 */
renderFriendsList(friendsList)

/* modal按鈕 事件監聽 */
cardWrap.addEventListener('click', function(event){
  const target = event.target
  if (target.matches('.btn-display-modal')) {
    /* 將 element data-id 指定為 id 參數*/
    renderFriendModal(Number(target.dataset.id))
    /* 加入好友按鈕事件 */
  } else if (target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(target.dataset.id))
  }
})




/* Function */
/* 將 friendsList 陣列資料逐一渲染到頁面 */
function renderFriendsList(data) {
  let rawHTML = ''
  data.forEach((friend) => {
    rawHTML += `
    <div class="card" style="width: 18rem;">
      <img class="card-img-top"
        src="${friend.avatar}"
        alt="Card image cap">
      <div class="card-body">
        <h4 class="card-title">${friend.name} ${friend.surname}</h4>
        <div class="btn-wrap">
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-primary btn-display-modal" data-toggle="modal" data-target="#exampleModalCenter" data-id="${friend.id}">
            More
          </button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${friend.id}">🞮</button>
        </div>
      </div>
    </div>
    `
  })
  cardWrap.innerHTML = rawHTML
}

/* 渲染 Modal */
function renderFriendModal(id) {
  const friendName = document.querySelector('#friend-modal-Name')
  const friendImage = document.querySelector('#friend-modal-image')
  const friendDescription = document.querySelector('#friend-modal-description')

  axios.get(indexURL + id).then((response) => {
    friendName.innerText = `${response.data.name} ${response.data.surname}`
    friendImage.src = response.data.avatar
    friendDescription.innerHTML = `
    <p>Gender: ${response.data.gender}</p>
    <p>Birthday: ${response.data.birthday}</p>
    <p>Age: ${response.data.age}</p>
    <p>Email: ${response.data.email}</p>
    <p>Region: ${response.data.region}</p>
    `
  })
}

/* 刪除好友名單 */
function removeFromFavorite(id) {
  if (!friendsList) return

  const friendIndex = friendsList.findIndex((friend) => friend.id === id)
  if (friendIndex === -1) return

  friendsList.splice(friendIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(friendsList))

  renderFriendsList(friendsList)
}