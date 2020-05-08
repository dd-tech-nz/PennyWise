const router = require('express').Router()
// const camelcaseKeys = require('camelcase-keys')

const db = require('../db/fn/expense')

// GET - /api/v1/expense/:userId
router.get('/:userId', (req, res) => {
  db.getExpense(req.params.userId)
    .then(expenses => res.status(200).json(expenses))
    .catch(err => {
      res.status(500).json('DATABASE ERROR: ' + err.message)
    })
})

// POST /api/v1/expense/:userId
router.post('/:userId', (req, res) => {
  const newExpense = req.body
  db.addExpense({ user_id: req.params.userId, ...newExpense })
    .then(expense => res.status(200).json(expense))
    .catch(err => {
      res.status(500).json('DATABASE ERROR: ' + err.message)
    })
})

// PUT - /api/v1/expense/:expenseId
router.put('/:expenseId', (req, res) => {
  db.updateExpense(req.params.expenseId, req.body)
    .then((d) => {
      res.status(200).json(d)
    })
    .catch((err) => {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

// DELETE - /api/v1/expense/:expenseId
router.delete('/:expenseId', (req, res) => {
  db.deleteExpense(req.params.expenseId)
    .then(() => {
      res.status(200).json(req.params.expenseId)
    })
    .catch((err) => {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

module.exports = router