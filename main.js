    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const PLAYER_STORAGE_KEY = 'USER_PLAYER'

    const playList = $('.song-lists')
    const heading = $('.music-title');
    const cdThumb = document.getElementById('music-cd')
    const audio = $('#audio');
    const cd = $('.music-cd');
    const playBtn = $('.toggle-play-btn');
    const pauseBtn = $('.toggle-pause-btn');
    const progress = $('.music-bar')
    const nextBtn = $('.next-btn')
    const prevBtn = $('.prev-btn')
    const shuffleBtn = $('.shuffle-btn')
    const repeatBtn = $('.repeat-btn')
    const volumePercent = $('.volume-percent')
    const volumeBar = $('.volume-btn')
    const volumeBtn = $('.volume-icon')


    const app = {
        currentIndex: 0,
        isPlaying: false,
        isShuffle: false,
        isRepeat: false,
        volumeCount: 50,
        isVolume: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

        songs: [{
                name: 'There\'s No One At All',
                singer: 'Sơn Tùng M-TP',
                path: './assets/audio/TNOAL.mp3',
                img: './assets/img/TNOAL.jpg',
            },

            {
                name: 'Có chắc yêu là đây',
                singer: 'Sơn Tùng M-TP',
                path: './assets/audio/CoChacYeulaDay.mp3',
                img: './assets/img/mtp.jpg',
            },

            {
                name: 'Anhs Ems',
                singer: 'QNT',
                path: './assets/audio/AnhsEms.mp3',
                img: './assets/img/anhsems.jpg',
            },

            {
                name: 'Cưới Thôi',
                singer: 'Masew',
                path: './assets/audio/CuoiThoi.mp3',
                img: './assets/img/cuoithoi.jpg',
            },

            {
                name: 'Feel My Rhythm',
                singer: 'Red Velvet',
                path: './assets/audio/FeelMyRhythm.mp3',
                img: './assets/img/fellmyrhythm.jpg',
            },

            {
                name: 'Âm thầm bên em',
                singer: 'Sơn Tùng M-TP',
                path: './assets/audio/AmThamBenEm.mp3',
                img: './assets/img/AmThamBenEm.jpg',
            },

            {
                name: 'Pay Phone',
                singer: 'Maroon5',
                path: './assets/audio/PayPhone.mp3',
                img: './assets/img/PayPhone.jpg',
            },

            {
                name: 'Chúng ta của hiện tại',
                singer: 'Sơn Tùng M-TP',
                path: './assets/audio/ChungTaCuaHienTai.mp3',
                img: './assets/img/ChungTaCuaHienTai.jpg',
            },

            {
                name: 'Thêm bao nhiêu lâu',
                singer: 'Đạt G',
                path: './assets/audio/ThemBaoLau.mp3',
                img: './assets/img/ThemBaoLau.jpg',
            },

            {
                name: 'Muộn rồi mà sao còn',
                singer: 'Sơn Tùng M-TP',
                path: './assets/audio/MuonRoiMaSaoCon.mp3',
                img: './assets/img/MuonRoiMaSaoCon.jpg',
            },

            {
                name: '100 Years Love',
                singer: 'NamDuc',
                path: './assets/audio/100Love.mp3',
                img: './assets/img/100Love.jpg',
            },
        ],

        setConfig: function(key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },

        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex]
                }
            })
        },

        render: function() {
            const html = this.songs.map((song, index) => {
                return `<div class="song-item mouse ${index === this.currentIndex ? 'active-song': ''}" data-index=${index}>
            <div class="song-thumb"><img width="190px" height="190px" class="song-thumb-img" src="${song.img}" alt=""></div>
            <div class="song-profile">
                <div class="song-title">${song.name}</div>
                <div class="song-owner">${song.singer}</div>
            </div>
            <div class="song-option mouse"><i class="fa-solid fa-ellipsis"></i></div>
        </div>`
            })

            playList.innerHTML = html.join('')
        },

        handleEvent: function() {
            _this = this

            // Rotate CD
            const cdAnimate = cdThumb.animate([{
                transform: 'rotate(360deg)'
            }], {
                duration: 10000,
                iterations: Infinity
            })
            cdAnimate.pause()

            // Open/Close cd
            const cdWidth = cd.clientWidth
            document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCDWidth = cdWidth - scrollTop
                cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
                cd.style.opacity = newCDWidth / cdWidth
            }

            // Play
            playBtn.onclick = function() {
                audio.play()
            }
            audio.onplay = function() {
                _this.isPlaying = true;
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'block';
                cdAnimate.play()

            }

            // pause
            pauseBtn.onclick = function() {
                    audio.pause()

                }
                // onpause
            audio.onpause = function() {
                _this.isPlaying = false;
                pauseBtn.style.display = 'none';
                playBtn.style.display = 'block';
                playBtn.style.zIndex = 2
                cdAnimate.pause()

            }

            // Progress
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const timeUpdate = Math.floor((audio.currentTime / audio.duration) * 100)
                    progress.value = timeUpdate
                }
            }

            // Tua
            progress.onchange = function(e) {
                const seekTime = (e.target.value * audio.duration) / 100;
                audio.currentTime = seekTime
            }

            // Btn Next
            nextBtn.onclick = function() {
                if (_this.isShuffle) {
                    _this.shuffleSong()
                } else {
                    _this.nextSong()
                }
                // audio.play()
                _this.loadSong()
                _this.render()
                _this.scrollToActiveSong()
            }

            // Btn prev
            prevBtn.onclick = function() {
                if (_this.isShuffle) {
                    _this.shuffleSong()
                } else {
                    _this.prevSong()
                }
                // audio.play()
                _this.loadSong()
                _this.render()
                _this.scrollToActiveSong()

            }

            // Shuffle
            shuffleBtn.onclick = function() {
                _this.isShuffle = !_this.isShuffle
                _this.setConfig('isShuffle', _this.isShuffle)
                shuffleBtn.classList.toggle('active', _this.isShuffle)
            }

            // repeat
            repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat', _this.isRepeat)

                repeatBtn.classList.toggle('active', _this.isRepeat)

            }

            // audio end
            audio.onended = function() {
                if (_this.isRepeat) {
                    // audio.play()
                    _this.loadSong()
                } else {
                    nextBtn.click()
                }

            }

            // click item
            playList.onclick = function(e) {
                const song = e.target.closest('.song-item:not(.active)')
                if (song || e.target.closest('.song-option')) {
                    // click item
                    if (song) {
                        _this.currentIndex = Number(song.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.load()
                        audio.play()
                    }

                    // option
                    if (e.target.closest('.song-option')) {

                    }
                }
            }

            // volumebtn click
            volumeBtn.onclick = function() {
                _this.isVolume = !_this.isVolume;
                if (_this.isVolume == true) {
                    volumeBar.style.display = 'block'
                } else {
                    volumeBar.style.display = 'none'

                }
                volumeBtn.classList.toggle('active', _this.isVolume)
            }

            // volume change
            volumePercent.onchange = function(e) {
                const volume = e.target.value;
                audio.volume = volume / 100
                _this.setConfig('volume', volume)
            }

        },

        scrollToActiveSong: function() {
            setTimeout(() => {
                $('.song-item.active-song').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }, 100);
        },

        loadConfig: function() {
            this.isShuffle = this.config.isShuffle
            this.isRepeat = this.config.isRepeat
            this.volumeCount = this.config.volume
        },

        loadSong: function() {
            audio.load()
            audio.play()
        },

        loadCurrentSong: function() {
            heading.textContent = this.currentSong.name;
            cdThumb.src = this.currentSong.img
            audio.src = this.currentSong.path
        },

        nextSong: function() {
            this.currentIndex++;
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
            this.loadCurrentSong()
        },

        prevSong: function() {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
        },

        shuffleSong: function() {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex)

            this.currentIndex = newIndex;
            this.loadCurrentSong()
                // audio.play()
            _this.loadSong()
        },

        start: function() {
            // load config
            this.loadConfig()
                // dinh nghia thuoc tinh object
            this.defineProperties()

            // Event
            this.handleEvent()

            // load first song
            this.loadCurrentSong()

            // render playlist
            this.render()

            // show active setting
            repeatBtn.classList.toggle('active', this.isRepeat)
            shuffleBtn.classList.toggle('active', this.isShuffle)
            volumePercent.value = this.config.volume
            audio.volume = this.config.volume / 100
        }
    }

    app.start()