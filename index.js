const express = require("express")
const cors = require("cors")
const app = express()
const port = 5000


app.use(express.json())
app.use(cors())

app.listen(port, ()=> console.log(`app listening on port ${port}`))

const bookRoutes = require("./router/bookRouter")
app.use("/book", bookRoutes)

const languageRouter = require("./router/languageRouter")
app.use("/language", languageRouter)

const publisherRouter = require("./router/publisheRouter")
app.use("/publisher", publisherRouter)