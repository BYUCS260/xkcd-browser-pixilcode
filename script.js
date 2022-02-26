Vue.component('star-rating', VueStarRating.default)

let app = new Vue({
    el: "#app",
    data: {
        number: "",
        max: "",
        current: {
            title: "",
            img: "",
            alt: ""
        },
        loading: true,
        addedName: "",
        addedComment: "",
        comments: {},
        ratings: {},
    },
    created() {
        this.xkcd()
    },
    computed: {
        month() {
            return convertMonth(this.current.month)
        },
        currentAvgRating() {
            if(!(this.number in this.ratings))
                return 0
            else
                return this.ratings[this.number].sum / this.ratings[this.number].total
        }
    },
    watch: {
        number(value, oldValue) {
            if(oldValue === "")
                this.max = value
            else
                this.xkcd()
        },
    },
    methods: {
        async xkcd() {
            try {
                this.loading = true

                const number = (this.number === "") ? "latest" : this.number
                const url  = `https://xkcd.now.sh/?comic=${number}`
                const response = await axios.get(url)
                this.current = response.data;
                this.number = response.data.num

                this.loading = false
            } catch(error) {
                this.number = this.max
            }
        },
        previousComic() {
            this.number = this.current.num - 1
            if(this.number < 1)
                this.number = 1
        },
        nextComic() {
            this.number = this.current.num + 1
            if(this.number > this.max)
                this.number = this.max
        },
        firstComic() {
            this.number = 1
        },
        lastComic() {
            this.number = this.max
        },
        getRandom(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1)) + min
        },
        randomComic() {
            this.number = this.getRandom(1, this.max)
        },
        addComment() {
            if(!(this.number in this.comments))
                Vue.set(this.comments, this.number, [])

            const today = new Date()

            this.comments[this.number].push({
                author: this.addedName,
                text: this.addedComment,
                day: today.getDate(),
                month: convertMonth(today.getMonth()),
                year: today.getFullYear(),
                hour: (today.getHours() % 12 === 0) ? 12 : today.getHours() % 12,
                minutes: ("0" + today.getMinutes()).slice(-2),
                amPm: (today.getHours() / 12 < 1) ? "AM" : "PM"
            })
            this.addedName = ""
            this.addedComment = ""
        },
        setRating(rating) {
            if(!(this.number in this.ratings))
                Vue.set(this.ratings, this.number, {
                    sum: 0,
                    total: 0
                })

            this.ratings[this.number].sum += rating
            this.ratings[this.number].total += 1
        }
    }
})

function convertMonth(monthNum) {
    var month = []
    if(monthNum === undefined)
        return ""
    else {
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[monthNum - 1]
    }
}
