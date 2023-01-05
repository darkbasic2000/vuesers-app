const app = Vue.createApp({
    data() {
        return {
            picture: '',
            firstName: '',
            lastName: '',
            email: '',
            city: '',
            country: '',
            users: [],
            friends: [],
            friend_picture: '',
            friend_name: '',
            timer : ''
        }
    },
    methods: {
        async getUser() {
            const res = await fetch('https://randomuser.me/api')
            const {results} = await res.json()         
            this.picture = results[0].picture.large
            this.thumbnail = results[0].picture.thumbnail
            this.firstName = results[0].name.first
            this.lastName = results[0].name.last
            this.email = results[0].email
            this.city = results[0].location.city
            this.country = results[0].location.country
        },
        addUser() {
            if(this.email != '') {
                let u = this.users.find(user => user.email === this.email)
                if(u === undefined) {
                    u = this.friends.find(user => user.email === this.email)
                    if(u === undefined) {
                        const user = {
                            picture : this.picture,
                            fullname: this.firstName + ' ' + this.lastName,
                            email : this.email    
                        }
                        this.users.push(user)
                    }
                }
            }
        },
        cancelInvitation() {
            this.users = this.users.filter(user => user.email != this.email)
        }
    },
    computed: {
        checkInvited() {
            const u = this.users.find(user => user.email === this.email)
            return u
        },
        checkFriendship() {
            const u = this.friends.find(user => user.email === this.email)
            return u
        }
    },
    beforeMount() {
        this.getUser()
    },
    updated() {
        if(this.users.length > 0) {
            const chance = Math.floor(Math.random() * 4)
            if(chance === 3) {
                this.timer = setTimeout(() => {
                    const index = Math.floor(Math.random() * this.users.length)
                    this.friends.push(this.users[index])
                    this.friend_name = this.users[index].fullname
                    this.friend_picture = this.users[index].picture
                    this.users = this.users.filter(user => user.email != this.users[index].email)
                    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
                    var toastList = toastElList.map(function(toastEl) {
                        return new bootstrap.Toast(toastEl)
                    })
                    toastList.forEach(toast => toast.show()) 
                }, 5000)
            }
            else {
                clearTimeout(this.timer)
            }
        }
    }

})

app.mount('#app')