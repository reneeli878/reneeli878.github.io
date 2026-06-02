import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/api/fund', (req, res) => {
  res.json({
    amount: 'NT$1,057,501',
    people: '876'
  })
})

app.listen(3000, () => {
  console.log('API running on http://localhost:3000')
})