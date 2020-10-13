const state = {
    tasks:[]
}
const view = (state) => `
<header>
<h1> tasks </h1>
</header>
    <section>
        <table style="grid-area:tasks;height:25px;">
            <tr>
                <th>task</th>
                <th>status</th>
                <th>update</th>
                <th>delete</th>
            </tr>
            ${state.tasks.map(task => `
            <tr id='${task.id}' draggable='true' ondragstart="app.run('ondragstart',event)" style="${(task.highlight ? "background-color: rgb(255,209,220);":"")}"><td>${task.text}</td><td>${task.status}</td>
                <td>
                    <form id='${window.crypto.getRandomValues(new Uint8Array(3)).join("")}' onsubmit="app.run('doUndo', this);return false;">
                        <input name ='id' type='hidden' value = ${task.id} />
                        <button class='submit2'>do/undo</button>
                    </form>
                </td>
                <td>
                    <form id='${window.crypto.getRandomValues(new Uint8Array(3)).join("")}' onsubmit="app.run('delete', this);return false;">
                        <input name ='id' type='hidden' value = ${task.id} />
                        <button class='submit2'>delete</button>
                    </form>
                </td>
            </tr>`).join("")}
        </table>
    <table style="grid-area:add;height:100%">
        <tr>
        <td>
            <form stlye='width:calc(100% - 6rem);margin:2rem;padding:1rem;background-color:white;' onsubmit="app.run('add', this);return false;">
                <input class='input1' name='task' placeholder='add a task' />
                <button class='submit1'>Add</button>
            </form>
            </td>
        </tr>
    </table>
    <table ondragover="event.preventDefault()" ondrop="app.run('onDrop',event)" style="border: 1px solid black;grid-area:dropbox;align-self:top;">
        <tr >
            <td> delete </td>
            <td> <table ondragover="event.preventDefault()" ondrop="app.run('onDropHighlight',event)" style="border: 1px solid black;background-color: rgb(255,209,220);"> <td> highlight </td> </table> </td>
        </tr>
    </section>

`

const update = {
    add: (state,form) =>{
        const data = new FormData(form)
        const task = {
            id: window.crypto.getRandomValues(new Uint8Array(3)).join(""),
            text: data.get('task'),
            status: "not yet done"
        }
        const postRequest ={
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }
        fetch('/tasks',postRequest).then(()=>app.run('getTasks'))
        return state
    },
    delete: (state,form)=>{
        const data = new FormData(form)
        const id = data.get('id')
        const task = state.tasks.find(task => task.id == id)
        const postRequest = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(task)
        }
        fetch('/tasks/delete',postRequest).then(()=>app.run('getTasks'))
        return state
    },
    doUndo: (state,form)=>{
        const data = new FormData(form)
        const id = data.get('id')
        const task = state.tasks.find(task => task.id == id)
        const postRequest = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(task)
        }
        fetch('/tasks/changeStatus',postRequest).then(()=>app.run('getTasks'))

        return state
    },
    ondragstart: (state,event) =>{
        console.log(event)
        event.dataTransfer.setData('text',event.target.id)
        return state
    },
    onDrop: (state,event) =>{
        event.preventDefault()
        const id = event.dataTransfer.getData('text')
        const task = state.tasks.find(task => task.id == id)
        const postRequest = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(task)
        }
        fetch('/tasks/delete',postRequest).then(()=>app.run('getTasks'))
        return state
    },
    onDropHighlight: (state,event) =>{
        event.preventDefault()
        event.stopPropagation()
        const id = event.dataTransfer.getData('text')
        const task = state.tasks.find(task => task.id ===id)
        const postRequest = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(task)
        }
        fetch('/tasks/highlight',postRequest).then(()=>app.run('getTasks'))
        return state

    },
    getTasks: async (state)=>{
        state.tasks = await fetch('tasks').then(res=>res.json())
        return state
    }

}

app.start('app',state,view,update)
app.run('getTasks')
