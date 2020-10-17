const HelloVueApp = {
    methods: {
        doInsertArticle() {
            this.state = 1
            this.articleTitle = ""
            this.articleContent = ""
            this.articleCategory = ""
        },
        doReadArticle() {
            this.state = 0
        },
        doUpdateArticle(index) {
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
        updateArticle(index) {
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
            xhr.open('PUT', `api/articles/${this.articles[index].id}`, true)
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
            state: 0,
            selectedUpdateRow: null
        }
    },
    created() {
        this.getAllArticles();
    }
}

const app = Vue.createApp(HelloVueApp)

app.mount('#app')
