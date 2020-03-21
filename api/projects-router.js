const express = require('express')

const Projects = require('../data/helpers/projectModel.js')

const router = express.Router()

router.use(express.json())

// GET
router.get('/', (req, res) => {
   Projects.get()
      .then(project => {
         res.status(200).json(project)
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The actions information could not be retrieved.'
          });
      })
})

router.get('/:id', (req, res) => {
   const { id } = req.params

   Projects.get(id)
      .then(project => {
         project 
            ?  res.status(200).json(project) 
            :  res.status(404).json({ 
                  message: 'The action with the specified ID does not exist.' 
               })
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The post information could not be retrieved.'
          });
      })
})

router.get('/:id/actions', (req, res) => {
   const { id } = req.params
   
   Projects.getProjectActions(id)
      .then(project => {
         project 
            ?  res.status(200).json(project) 
            :  res.status(404).json({ 
                  message: 'The project with the specified ID does not exist.' 
               })         
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The comments information could not be retrieved.'
          });
      })
})

// POST
router.post('/', (req, res) => {
   const { description, name } = req.body

   !(description || name) 
      ?  res.status(400).json({
            errorMessage: 'Please provide a description and name for the project.'
         })

      :  Projects.insert(req.body)
            .then(project => {
               res.status(201).json(project)
            })
            .catch(err => {
               console.log('error with POST:', err)
               res.status(500).json({
                  error: 'There was an error while saving the project to the database'
               })
            })
})

// PUT
router.put('/:id', (req, res) => {
   const changes = req.body
   const { description, name } = req.body
   const { id } = req.params

   !(description || name) 
      ?  res.status(400).json({
            errorMessage: 'Please provide a description and name for the action.'
         })

      :  Projects.update(id, changes)
            .then(project => {
               project 
                  ? res.status(200).json(project)
                  : res.status(404).json({ message: 'The post with the specified ID does not exist.' })
            })
            .catch(err => {
               console.log(err);
               res.status(500).json({
                  error: 'The project information could not be modified.'
               });
            });
})

// DELETE
router.delete('/:id', (req, res) => {
   const { id } = req.params
   
   Projects.get(id)
      .then(project => {
         project 
            ?  Projects.remove(id)
                  .then(deleted => {
                     if (deleted) {
                        res.status(200).json(project)
                     } 
                  })
                  .catch(err => {
                     console.log(err)
                     res.status(500).json({
                        error: 'The project could not be removed'
                     });
                  })
         
            :  res.status(404).json({
                  message: 'The project with the specified ID does not exist.'
               })
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The project information could not be retrieved.'
         });
      })
})


module.exports = router