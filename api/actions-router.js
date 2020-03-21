const express = require('express')
const Actions = require('../data/helpers/actionModel.js')

const router = express.Router()

router.use(express.json())

// GET
router.get('/', (req, res) => {
   Actions.get(req.query)
      .then(actions => {
         res.status(200).json(actions)
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

   Actions.get(id)
      .then(action => {
         action 
            ?  res.status(200).json(action) 
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

// POST
router.post('/', (req, res) => {
   const { project_id, description, notes } = req.body

   !(project_id && description && notes) 
      ?  res.status(400).json({
            errorMessage: 'Please provide a project_id, description, and notes for the action.'
         })

      :  Actions.insert(req.body)
            .then(action => {
               res.status(201).json(action)
            })
            .catch(err => {
               console.log('error with POST:', err)
               res.status(500).json({
                  error: 'There was an error while saving the action to the database'
               })
            })
})

// PUT
router.put('/:id', (req, res) => {
   const changes = req.body
   const { project_id, description, notes } = req.body
   const { id } = req.params

   !(project_id && description && notes) 
      ?  res.status(400).json({
            errorMessage: 'Please provide a project_id, description, and notes for the action.'
         })

      :  Actions.update(id, changes)
            .then(action => {
               action 
                  ? res.status(200).json(action)
                  : res.status(404).json({ message: 'The post with the specified ID does not exist.' })
            })
            .catch(err => {
               console.log(err);
               res.status(500).json({
                  error: 'The post information could not be modified.'
               });
            });
})

// DELETE
router.delete('/:id', (req, res) => {
   const { id } = req.params
   
   Actions.get(id)
      .then(action => {
         action 
            ?  Actions.remove(id)
                  .then(deleted => {
                     if (deleted) {
                        res.status(200).json(action)
                     } 
                  })
                  .catch(err => {
                     console.log(err)
                     res.status(500).json({
                        error: 'The action could not be removed'
                     });
                  })
         
            :  res.status(404).json({
                  message: 'The action with the specified ID does not exist.'
               })
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The action information could not be retrieved.'
         });
      })
})

module.exports = router