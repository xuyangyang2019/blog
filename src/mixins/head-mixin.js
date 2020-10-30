function getHead(vm) {
    const { head } = vm.$options
    if (head) {
        return typeof head === 'function' ? head.call(vm) : head
    }
}

const serverHeadMixin = {
    created() {
        const head = getHead(this)
        if (head) {
            if (head.title) this.$ssrContext.title = `${head.title} -xyy的小站`
            if (head.author) this.$ssrContext.author = `${head.author}`
            if (head.keywords) this.$ssrContext.keywords = head.keywords
            if (head.description) this.$ssrContext.description = head.description
        }
    }
}

const clientHeadMixin = {
    mounted() {
        const head = getHead(this)
        if (head) {
            if (head.title) document.title = `${head.title} -xyy的小站`
            if (head.author) document.querySelector('meta[name="author"]').setAttribute('content', `${head.author}`)
            if (head.keywords) document.querySelector('meta[name="keywords"]').setAttribute('content', head.keywords)
            if (head.description) document.querySelector('meta[name="description"]').setAttribute('content', head.description)
        }
    }
}

export default process.env.VUE_ENV === 'server' ? serverHeadMixin : clientHeadMixin