const express = require('express')
const {Pool} = require('pg')

const app = express()
const port = 8080
const pool = new Pool({
    host: 'db',
    port: 5432,
    user: 'postgres',
    database: 'postgres',
    password: 'secret'
});

const add_article = async (article) => {
    const resArticles = await pool.query(
        `INSERT INTO articles (title, content)
         VALUES ($1, $2)
         RETURNING id;`, 
        [article.title, article.content])

    const article_id = resArticles.rows[0].id

    await Promise.all(article.categories.map(async category => {
        return pool.query(
            `INSERT INTO article_categories (article_id, category)
             VALUES ($1, $2);`,
            [article_id, category])
    }))

    return article_id
}   

const delete_article = async (id) => {
    await pool.query(`DELETE FROM article_categories WHERE article_id = $1;`, [id])
    await pool.query(`DELETE FROM articles WHERE id = $1;`, [id])
}

const update_article = async (id, article) => {
    await pool.query(`DELETE FROM article_categories WHERE article_id = $1;`, [id])

    await pool.query(
        `UPDATE articles
         SET title   = $1
           , content = $2
         WHERE id = $3;`,
        [article.title, article.content, id])

    await Promise.all(article.categories.map(async category => {
        return pool.query(
            `INSERT INTO article_categories (article_id, category)
             VALUES ($1, $2);`,
            [id, category])
    }))
    
}

const getAll_article = async () => {
    const resArticles = await pool.query(`SELECT * FROM articles;`)

    const articles = resArticles.rows.map(async curr => {
        const res = await pool.query(`SELECT * FROM article_categories WHERE article_id = $1;`, [curr.id]);
        const categories = res.rows.map((curr_1) => curr_1.category);

        return {id: curr.id
               ,title: curr.title
               ,content: curr.content
               ,categories: categories};
    })

    return await Promise.all(articles)
}

(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS articles (
            id      INT  GENERATED ALWAYS AS IDENTITY,
            title   TEXT NOT NULL,
            content TEXT NOT NULL,
            PRIMARY KEY(id)
        );

        CREATE TABLE IF NOT EXISTS article_categories (
            id         INT  GENERATED ALWAYS AS IDENTITY,
            article_id INT  NOT NULL,
            category   TEXT NOT NULL,
            PRIMARY KEY(id),
            CONSTRAINT fk_articles
                FOREIGN KEY(article_id) REFERENCES articles(id)
        );`)

    app.use(express.json());
    app.use(express.static('public'))
   
    app.get('/api/articles', async (req, res) => {
        res.json(await getAll_article())
    })

    app.post('/api/articles', async (req, res) => {
        await add_article(req.body)
        res.status(200).end()
    })

    app.put('/api/articles/:articleId', async (req, res) => {
        await update_article(req.params['articleId'], req.body)
        res.status(200).end()
    })

    app.delete('/api/articles/:articleId', async (req, res) => {
        await delete_article(req.params['articleId'])
        res.status(200).end()
    })

    app.listen(port, () => {
        console.log(`CRUD app listening at http://localhost:${port}`)
    })
})().catch((err) => {
    console.error(err);
});