const PORT = process.env.PORT||8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const cors = require ('cors')

app.use(cors())

const articles = []
const newspapers = [{
    name:'The Guardian',
    address:'https://www.theguardian.com/world/middleeast',
    base:''
},{
    name:'NY Times',
    address:'https://www.nytimes.com/news-event/israel-hamas-gaza',
    base:'https://www.nytimes.com'
},
    {
        name:'Sky News',
        address:'https://news.sky.com/israel-hamas-war',
        base:'https://news.sky.com'
    },
    {
        name:'BBC',
        address:'https://www.bbc.com/news/topics/c2vdnvdg6xxt',
        base:'https://www.bbc.com'
    },
    {
        name:'The Sun',
        address:'https://www.thesun.co.uk/news/worldnews/',
        base:'https://www.thesun.co.uk'
    }
]
newspapers.map(newspaper=>{
    axios(newspaper.address).then(response=>{
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("Israel")',html).each(function(){
            const title = $(this).text()
            let url = $(this).attr('href')
            if(url[0]==='/'){
                url=newspaper.base+url
            }
            if(title.length>50 && !title.includes('   ')){
                articles.push({
                    source:newspaper.name,
                    title,
                    url
                })
            }
        })
    }).catch(err=>{
        console.error(err)
    })
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

app.get('/',(req,res)=>{
    res.json('Ania is the best')
})

app.get('/news',(req,res)=>{
    res.json(articles)
    console.log(articles.length)
})

app.get('/news/:newspaperId',(req,res)=>{
    const newspaperId = req.params.newspaperId
    const newspaperArticles=[]
    const newspaper= newspapers.filter(newspaper=>newspaper.name.replace(/ /g,'').toLowerCase()===newspaperId)
    newspaper.forEach(newspaper=>{
        axios(newspaper.address).then(response=>{
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("Israel")',html).each(function(){
                const title = $(this).text()
                let url = $(this).attr('href')
                if(url[0]==='/'){
                    url=newspaper.base+url
                }
                if(title.length>50 && !title.includes('   ')){
                    newspaperArticles.push({
                        title,
                        url
                    })
                }
            })
            res.json(newspaperArticles)
        }).catch(err=>{
            console.error(err)
        })
    })
})

