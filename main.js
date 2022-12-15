/**
 * 1. render songs
 * 2. scroll top
 * 3. play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / repeat when ended
 * 8. active song
 * 9. scroll active song into view
 * 10. play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'F8_PLAYER'


const heading = $('header h2')
const singer = $('header .heading-singer')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const volume = $('#volume')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const timeAudioLeft = $('.time-audio-left')
const timeAudioRight = $('.time-audio-right')
const volumeIconLeft = $('.volume-icon-left')
const volumeIconRight = $('.volume-icon-right')
// const darkMode = $('.darkmode')
// console.log(volumeIconLeft)



const heightDashboard = $('.dashboard').offsetHeight

// console.log(heightDashboard)





const app = {
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

	songs: [
		{
			name: 'Buồn Làm Chi Em Ơi',
			singer: 'Hoài Lâm',
			path: './assets/music/HOÀI LÂM - Buồn Làm Chi Em Ơi (Official Lyric Video).mp3',
			image: 'https://i.ytimg.com/vi/ahF-3SaeJJ4/maxresdefault.jpg'
		},
		{
			name: 'Anh Muốn Em Sống Sao (Remix)',
			singer: 'Khưu Huy Vũ',
			path: './assets/music/Em Muốn Anh Sống Sao [ Dence Remix ] Khưu Huy Vũ.mp3',
			image: 'https://s1.dmcdn.net/v/SQ0ls1VGvvn9_tzW5/x1080'
		},
		{
			name: 'Bông Cỏ Mây',
			singer: 'NB3 Hoài Bảo, Nguyeen',
			path: './assets/music/BongCoMay-NB3HoaiBaoNguyeen-8037351.mp3',
			image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/c/e/4/b/ce4b27295d62774bcf5179d5eec7e0c6.jpg'
		},
		{
			name: 'Bài Ca Kỉ Niệm',
			singer: 'Duy Khánh, Vy Thảo',
			path: './assets/music/Bài Ca Kỷ Niệm_Duy Khánh, Vy Thảo_-1076022116.mp3',
			image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/7/f/7fd2c9ac4b2198844263095286396242_1490956425.jpg'
		},
		{
			name: 'Chiều Qua Phà Hậu Giang',
			singer: 'Lưu Chí Vỹ, Dương Hồng Loan',
			path: './assets/music/ChieuQuaPhaHauGiang-LuuChiVyDuongHongLoan-3129054_hq.mp3',
			image: 'https://i.ytimg.com/vi/HBB_soOifX8/maxresdefault.jpg'
		},
		{
			name: 'Con Gái Của Mẹ',
			singer: 'Lệ Thuỷ, Phượng Liên',
			path: './assets/music/Con Gái Của Mẹ_Lệ Thủy, Phượng Liên_-1073824723.mp3',
			image: 'https://i.ytimg.com/vi/TrJtBKm69FQ/maxresdefault.jpg'
		},
		{
			name: 'Đừng Nói Xa Nhau',
			singer: 'Dương Hồng Loan',
			path: './assets/music/DungNoiXaNhau-DuongHongLoan-4797052.mp3',
			image: 'https://i.ytimg.com/vi/uepAFhZLgJE/maxresdefault.jpg'
		},

		{
			name: 'Con Đê Chung Tình',
			singer: 'Giáng Tiên',
			path: './assets/music/ConDeChungTinh-GiangTien_3e9xd.mp3',
			image: 'https://zmp3-photo-fbcrawler.zmdcdn.me/avatars/c/9/3/2/c932a34d2e67da863ff1d4e928a2ad61.jpg'
		},
		{
			name: 'Con Đường Mang Tên Em',
			singer: 'Duy Khánh, Hà My',
			path: './assets/music/Con Đường Mang Tên Em_Duy Khánh, Hà My_-1076022118.mp3',
			image: 'https://i.ytimg.com/vi/gZLhYubnsuk/hqdefault.jpg'
		},


	],

	setConfig: function (key, value) {
		this.config[key] = value
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
	},
	render: function () {
		const htmls = this.songs.map((song, index) => {
			return `
			<div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
				<div class="thumb"
					style="background-image: url('${song.image}')">
				</div>
				<div class="body">
					<h3 class="title" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis; max-width: 260px">${song.name}</h3>
					<p class="author">${song.singer}</p>
				</div>
				<div class="option">
					<i class="fas fa-ellipsis-h"></i>
				</div>
			</div>
			`
		})
		playlist.innerHTML = htmls.join('')
	},

	defineProperties: function () {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return this.songs[this.currentIndex]
			}
		})
	},

	handleEvents: function () {
		const _this = this
		const cdWidth = cd.offsetWidth

		// xu ly CD quay / dung
		const cdThumbAnimate = cdThumb.animate([
			{
				transform: 'rotate(360deg'
			}
		], {
			duration: 10000, //10giay
			iterations: Infinity
		})
		cdThumbAnimate.pause()

		//windown load
		window.onload = function () {
			playlist.style.marginTop = heightDashboard + 'px' //fix playlist
			document.documentElement.scrollTop = 0
			window.scrollY = 0
			// console.log(document.documentElement.scrollTop)

		}

		//xu li zoom cd
		document.onscroll = function () {
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			const newCdWidth = cdWidth - scrollTop
			// console.log(scrollTop)
			cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
			cd.style.opacity = newCdWidth / cdWidth
		}

		//xu li khi click play
		playBtn.onclick = function () {
			if (_this.isPlaying) {
				audio.pause()
			} else {
				audio.play()
			}
		}

		//khi song duoc play - pause
		audio.onplay = function () {
			_this.isPlaying = true
			player.classList.add('playing')
			cdThumbAnimate.play()
		}
		audio.onpause = function () {
			_this.isPlaying = false
			player.classList.remove('playing')
			cdThumbAnimate.pause()

		}

		// loai bo truong hop duration = NaN
		audio.onloadedmetadata = function () {
			const floorDura = Math.floor(audio.duration)
			const second = floorDura % 60
			const minute = (floorDura - second) / 60
			const timeAudio = minute + ':' + second
			if (minute < 10) {
				timeAudioRight.textContent = '0' + timeAudio

			}
			// console.log(timeAudio)

		};

		//dat volume mac dinh la 50%
		window.onload = function () {

			audio.volume = 0.5
			volume.value = audio.volume * 100
			// console.log(volume.value)
		}

		//dieu chinh volume bang thanh truot
		volume.oninput = function (e) {
			// const valueVolume = 
			audio.volume = e.target.value / 100
			// console.log(audio.volume)
		}

		//giam am luong
		volumeIconLeft.onclick = function () {
			if (audio.volume > 0) {
				const volumeNotFixed = audio.volume - 0.1
				audio.volume = volumeNotFixed.toFixed(1)
				volume.value = audio.volume * 100
			}
			// console.log(audio.volume)
		}
		volumeIconRight.onclick = function () {
			if (audio.volume < 1) {
				const volumeNotFixed = audio.volume + 0.1
				audio.volume = volumeNotFixed.toFixed(1)
				volume.value = audio.volume * 100
			}
			// console.log(audio.volume)
		}

		//khi tien do bai hat thay doi
		audio.ontimeupdate = function () {
			if (audio.duration) {
				const progressPercent = audio.currentTime * 100 / audio.duration
				progress.value = progressPercent
				// console.log(progressPercent)
				timeAudioLeft.textContent = _this.SetTimeChangeAudio(Math.floor(audio.currentTime))

			}
		}

		// xu li khi tua song
		progress.oninput = function (e) {
			const seekTime = e.target.value * audio.duration / 100
			audio.currentTime = seekTime
			// console.log(seekTime)
		}



		//khi next song
		nextBtn.onclick = function () {
			if (_this.isRandom) {
				_this.playRandomSong()
			} else
				_this.nextSong()
			audio.play()
			_this.render()
			_this.scrollToActiveSong()
		}

		//khi prev song
		prevBtn.onclick = function () {
			if (_this.isRandom) {
				_this.playRandomSong()
			} else
				_this.prevSong()
			audio.play()
			_this.render()
			_this.scrollToActiveSong()
		}
		//khi random song
		randomBtn.onclick = function (e) {
			_this.isRandom = !_this.isRandom
			_this.setConfig('isRandom', _this.isRandom)
			randomBtn.classList.toggle('active', _this.isRandom)

		}

		//xu ly lap lai 1 song
		repeatBtn.onclick = function (e) {
			_this.isRepeat = !_this.isRepeat
			_this.setConfig('isRepeat', _this.isRepeat)
			repeatBtn.classList.toggle('active', _this.isRepeat)
		}

		//xu ly next song khi audio ended
		audio.onended = function () {
			if (_this.isRepeat) {
				audio.play()
			} else {
				nextBtn.click()
			}
		}



		// lang nghe hanh vi click playlist
		playlist.onclick = function (e) {
			const songNode = e.target.closest('.song:not(.active)')

			if (songNode || e.target.closest('.option')) {
				// xu ly khi click vao song
				if (songNode) {
					_this.currentIndex = Number(songNode.dataset.index) //dataset.index = getAttribute('data-index)
					_this.loadCurrentSong()
					_this.render()
					audio.play()

					setTimeout(() => {
						$('.song.active').scrollIntoView({
							behavior: 'smooth',
							block: 'center'
						})
					}, 300)

				}
				//xu ly khi click vao song option
				if (e.target.closest('.option')) {

				}
			}
		}

		// darkMode.onclick = function () {
		// 	if(this.style.color = '#000') {
		// 		$('.dashboard').style.setProperty('', 'black')
		// 		this.style.color = '#fff'
		// 	} else {
		// 		$('.dashboard').style.backgroundColor = 'white'
		// 		this.style.color = '#000'
		// 	}

		// }


	},

	SetTimeChangeAudio: function (val) {
		if (val < 10) {
			timeAudio = '00:0' + val
		}
		else if (val >= 10 && val < 60) {
			timeAudio = '00:' + val
		}
		else if (val >= 60) {
			const second = val % 60
			const minute = (val - second) / 60
			if (second < 10) {
				timeAudio = '0' + minute + ':0' + second
			} else {
				timeAudio = '0' + minute + ':' + second
			}
		}
		return timeAudio
	},

	scrollToActiveSong: function () {
		setTimeout(() => {
			$('.song.active').scrollIntoView({
				behavior: 'smooth',
				block: 'end'
			})
		}, 300)
	},

	loadCurrentSong: function () {
		heading.textContent = this.currentSong.name
		singer.textContent = this.currentSong.singer
		cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
		audio.src = this.currentSong.path

		// console.log(heading, cdThumb, audio)
	},

	loadConfig: function () {
		this.isRandom = this.config.isRandom
		this.isRepeat = this.config.isRepeat
	},

	nextSong: function () {
		this.currentIndex++
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0
		}
		this.loadCurrentSong()
	},
	prevSong: function () {
		this.currentIndex--
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1
		}
		console.log(this.currentIndex)
		this.loadCurrentSong()
	},

	playRandomSong: function () {
		let newIndex
		do {
			newIndex = Math.floor(Math.random() * this.songs.length)
		} while (newIndex === this.currentIndex)
		this.currentIndex = newIndex
		this.loadCurrentSong()
	},



	start: function () {
		// gan cau hinh tu config vao ung dung
		this.loadConfig()

		//dinh nghia cac thuoc tinh cho object
		this.defineProperties()

		//lang nghe/ xu ly cac su kien
		this.handleEvents()

		//tai thong tin bai hat dau tien khi chay ung dung
		this.loadCurrentSong()

		//render playlist
		this.render()

		// hien thi trang thai ban dau cua repeatBtn, radomBtn
		randomBtn.classList.toggle('active', this.isRandom)
		repeatBtn.classList.toggle('active', this.isRepeat)
	}
}

app.start()

