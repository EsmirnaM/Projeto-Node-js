const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const task = require('./models/task')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('API Projeto TOTI');
})
// List tasks
app.get('/tasks',async(req, res) => { 
  try {
    const taskld= await tasks.findAll()
    res.status(201).json(taskld)
  }catch(err){
      res.status(500).json({message:err.message})
    }
  })

// Create task
app.post('/tasks', async (req, res) => {
  const { description, done } = req.body
  if (description == null || done == null) {
    res.status(400).send('valores invalidos')
  }
  else {
    if (done == true || done == false) {
      const newtask = await tasks.create({
        description,
        done
      })
      res.status(200).send('cadastro salvo')
    }
    else {
      res.status(400).send('Fatal erro 400: valor não é valido')
    }
  }

})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const tarefas = await tasks.findByPk(taskId)

  if (tarefas) {
    res.status(200).json({ tarefas })
    return;
  }

  if (isNaN(taskId)) {
    res.status(400).send('id invalid')
    return;
  }
  else {
    res.status(500).send('não tem tarefa');
  }

})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await tasks.findOne({ where: { id: taskId } });
  const { description, done } = req.body;

  if (isNaN(taskId)) {
    res.status(400).send('Id inavlida insira numero enteiro para id')
    return;
  }
  if (!task) {
    res.status(500).send('tarefa não encontrada')
    return;
  }
  if (done == null) {
    task.set(req.body);
    await task.save();
    res.status(200).send('tarefa atualizada');

  }
  else {

    if (done == true || done == false) {
      task.set(req.body);
      await task.save();
      res.status(200).send('tarefa atualizada');
    }
    else {
      res.status(400).send('valor do done é invalido')
    }
  }
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const tarefas = await tasks.findByPk(taskId);

  if (tarefas) {
    await tasks.destroy({ where: { id: taskId } });
    res.status(200).send('tarefa excluida')
    return;
  }
  if (isNaN(taskId)) {
    res.status(400).send('tarefa não encontrada')
    return;
  }
  else {
    res.status(500).send('tarefa não existe')
    return;
  }
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
