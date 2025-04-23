import express from 'express'
import authRoutes from './routes/auth.js'
import connectDB from './lib/connectDB.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'


import fileRoutes from './routes/File.js'
import folderRoutes from './routes/Folder.js'
import shareRoutes from './routes/Share.js'
 





dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,  
    credentials: true,
    methods: ['GET', 'POST','PUT', 'DELETE'],  
}));

app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/file', fileRoutes)
app.use('/api/folder', folderRoutes)
app.use('/api/share', shareRoutes)

app.get('/api/hi', (req, res) => {
    res.send('Hello from server')
})





app.listen(PORT, () => {
    connectDB()
    console.log('server is listening on port ' + PORT)
    
})

