const express = require('express')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const tasks = [
    {
        id: "1",
        text: 'Fetch all the tasks',
        status: "not yet done"
    },
    {
        id: "2",
        text: 'Create a new task',
        status: "not yet done"
    }
]

app.listen(3000, () => {
    console.log('app server running on port', 3000)
})

app.get('/tasks',(req,res)=>{
    res.send(tasks)
})

app.post('/tasks',(req,res)=>{
    tasks.push(req.body)
    res.send()
})
app.post('/tasks/delete',(req,res)=>{
    index = tasks.findIndex(element => element.id ===req.body.id)
    tasks.splice(index,1)
    res.send()
})

app.post('/tasks/changeStatus',(req,res)=>{
    index = tasks.findIndex(task => task.id === req.body.id)

    if (tasks[index].status ==="not yet done"){
        tasks[index].status = 'done'
    } else{
        tasks[index].status ="not yet done"
    }
    res.send()
})

app.post('/tasks/highlight',(req,res)=>{
    index = tasks.findIndex(task => task.id === req.body.id)
    if(tasks[index].highlight){
        tasks[index].highlight = null
    }else{
       tasks[index].highlight = 'highlight'
    }

    res.send()
})
