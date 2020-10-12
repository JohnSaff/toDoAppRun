const state = {
    tasks:[]
}
const view = (state) => `
    <section>
        <h1> tasks </h1>
        <table>
            <tr>
                <th>task</th>
                <th>status</th>
                <th>update</th>
                <th>delete</th>
            </tr>
            ${state.tasks.map(task => `
            <tr><td>${task.text}</td><td>${task.status}</td>
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
    </section>
    <section>
    <table>
        <tr>
        <td>
            <form stlye='width:calc(100% - 6rem);margin:2rem;padding:1rem;background-color:white;' onsubmit="app.run('add', this);return false;">
                <input class='input1' name='task' placeholder='add a task' />
                <button class='submit1'>Add</button>
            </form>
            </td>
        </tr>
    </table>
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
        state.tasks.push(task)
        return state
    },
    delete: (state,form)=>{
        const data = new FormData(form)
        const id = data.get('id')
        const index = state.tasks.findIndex(element => element.id ===id)
        state.tasks.splice(index,1)
        return state
    },
    doUndo: (state,form)=>{
        const data = new FormData(form)
        const id = data.get('id')
        const index = state.tasks.findIndex(element => element.id ===id)
        if (state.tasks[index].status ==="not yet done"){
            state.tasks[index].status = 'done'
        } else{
            state.tasks[index].status ="not yet done"
        }
        return state
    }
}

app.start('app',state,view,update)
