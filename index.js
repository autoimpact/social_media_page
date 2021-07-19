/* 初始設定 */

const baseURL = 'https://lighthouse-user-api.herokuapp.com'
const indexURL = baseURL + '/api/v1/users/'
const friendsList = []

const cardWrap = document.querySelector('.card-wrap')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

let filteredFriends = []
let favoriteList = JSON.parse(localStorage.getItem('favoriteFriends')) || []

const friendsPerPage = 12
const paginator = document.querySelector('#paginator')

/* 從 API 取出資料放入 friendsList 陣列，並設定初始只顯示第一頁畫面 */
axios.get(indexURL).then((response) => {
  friendsList.push(...response.data.results)
  renderPaginator(friendsList.length)
  renderFriendsList(getFriendsByPage(1))
  addToFavoriteStatus()
}).catch((error) => console.log(error))

/* modal按鈕 事件監聽 */
cardWrap.addEventListener('click', function (event) {
  const target = event.target
  if (target.matches('.btn-display-modal')) {
    /* 將 element data-id 指定為 id 參數*/
    renderFriendModal(Number(target.dataset.id))
    /* 加入好友按鈕事件 */
  } else if (target.matches('.btn-add-favorite')) {
    addToFavorite(Number(target.dataset.id))
    addToFavoriteStatus()
  }
})

/* 搜尋欄位事件監聽 */
searchForm.addEventListener('submit', function onSearchSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredFriends = friendsList.filter((friend) => friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword))

  if (filteredFriends.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的朋友`)
  }
  renderPaginator(filteredFriends.length)// 依照搜尋結果重新 render paginator
  renderFriendsList(getFriendsByPage(1)) // 修改變數來源從完整清單 => 分頁清單
  addToFavoriteStatus()
})

/* 分頁按鈕事件監聽 */
paginator.addEventListener('click', function onClickPaginator(event) {
  const target = event.target
  if (target.tagName !== 'A') return

  const page = target.dataset.page
  renderFriendsList(getFriendsByPage(page))
  addToFavoriteStatus()
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
          <button class="btn btn-primary btn-add-favorite" data-id="${friend.id}">★</button>
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

/* 加入好友名單 */
function addToFavorite(id) {
  const friend = friendsList.find((friend) => friend.id === id)

  if (favoriteList.some((friend) => friend.id === id)) {
    return alert('此人已在好友清單！')
  }

  favoriteList.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(favoriteList))
  alert('已將此人加入好友清單！')
}

/* 如果已加入清單，改變 addToFavorite 按鈕顏色 */
function addToFavoriteStatus() {
  const addToFavoriteBtn = document.querySelectorAll('.btn-add-favorite')

  for (let item of addToFavoriteBtn) {
    if (favoriteList.some((friend) => friend.id === Number(item.dataset.id))) {
      item.classList = 'btn btn-danger btn-add-favorite'
    }
  }
}

/* getFriendsByPage */
function getFriendsByPage(page) {
  /* 如果 filteredFriends 有資料 data 設為 filteredFriends，若無 data 設為 friendsList */
  const data = filteredFriends.length ? filteredFriends : friendsList
  const startIndex = (page - 1) * friendsPerPage
  return data.slice(startIndex, startIndex + friendsPerPage)
}

/* 印出頁碼 */
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / friendsPerPage)

  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}