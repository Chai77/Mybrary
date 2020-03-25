const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const mongoose = require('mongoose')

//All authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name != '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render("authors/index", {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()
        //res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors/')
    } catch {
        let locals = {
            author: author,
            errorMessage: 'Error creating Author'
        }
        res.render('authors/new', locals)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findOne({_id: req.params.id})
        const books = await Book.find({author: author.id})
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch(err) {
        //console.log(err)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findOne({_id:req.params.id})
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
    
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findOne({_id: req.params.id})
        author.name = req.body.name
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
    } catch {
        if(author == null) {
            res.redirect('/')
        } else {
            let locals = {
                author: author,
                errorMessage: 'Error updating Author'
            }
            res.render('authors/edit', locals)
        }
    }
}) 

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findOne({_id: req.params.id})
        await author.remove()
        res.redirect(`/authors`)
    } catch {
        if(author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router