const HelloVueApp = {
    methods: {
        doReadArticle() {
            this.state = 0
        },
        doUpdateArticle(index) {
            this.updateArticleId = this.articles[index].id
            this.articleTitle = this.articles[index].title
            this.articleContent = this.articles[index].content
            this.articleCategory = this.articles[index].categories.join(', ')
            this.selectedUpdateRow = index;
        },
        cancelDoUpdateArticle() {
            this.selectedUpdateRow = null;
        },
        deleteArticle(index) {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', (e) => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getAllArticles()
                }
            })
            xhr.open('DELETE', `api/articles/${this.articles[index].id}`, true)
            xhr.send()
        },
        insertArticle() {
            if (this.articleCategory == null) {
                return;
            }

            const xhr = new XMLHttpRequest();

            xhr.addEventListener('load', (e) => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getAllArticles()
                    this.doReadArticle()
                }
            })
            xhr.open('POST', 'api/articles', true)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({title: this.articleTitle
                                    ,content: this.articleContent
                                    ,categories: this.articleCategory.split(/ *, */)}))
        },
        updateArticle() {
            if (this.articleCategory == null) {
                return;
            }

            const xhr = new XMLHttpRequest();

            xhr.addEventListener('load', (e) => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getAllArticles()
                    this.cancelDoUpdateArticle()   
                }
            })
            xhr.open('PUT', `api/articles/${this.updateArticleId}`, true)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({title: this.articleTitle
                                    ,content: this.articleContent
                                    ,categories: this.articleCategory.split(/ *, */)}))

        },
        getAllArticles () {
            const xhr = new XMLHttpRequest();
        
            xhr.addEventListener('load', (e) => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    this.articles = JSON.parse(xhr.responseText)
                }
            })
            xhr.open('GET', 'api/articles', true)
            xhr.send()
        }
    },
    data() {
        return {
            articles: [],
            articleTitle: null,
            articleContent: null,
            articleCategory: null,
            updateArticleId: null,
            state: 0,
            selectedUpdateRow: null
        }
    },
    created() {
        this.getAllArticles();
    }
}

Vue.createApp(HelloVueApp).mount('#app')