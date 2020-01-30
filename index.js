const express = require('express');

const server = express();

server.use(express.json());

server.listen(3000);

const arrayProjects = [];

// Middleware global para mostrar quantas vezes foram feitas requisições
server.use((req, res, next) => {
  console.time('Request')
  console.log(`Método: ${req.method}; URL: ${req.url}`)

  console.count('Quantidade de requisições')

  next();

  console.timeEnd('Request')
});

// Middleware para checar se foi passado um título
function checkTitleRequired(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" })
  }

  return next();
}

// Middleware par chegar se o id passado existe no array
function checkIdInArray(req, res, next) {

  const { id } = req.params;

  const project = arrayProjects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "ID not exists in array." })
  }

  return next();
}

// Adiciona um novo projeto no array
server.post('/projects', (req, res) => {

  const { id, title } = req.body

  const project = {
    id,
    title,
    tasks: [],
  }

  arrayProjects.push(project);

  return res.send('Incluído com sucesso');

});

// Lista todos os projetos do array
server.get('/projects', (req, res) => {

  return res.json(arrayProjects);

});

// Edita o título de um projeto a partir do id passado
server.put('/projects/:id', checkTitleRequired, checkIdInArray, (req, res) => {

  const { id } = req.params
  const { title } = req.body;

  const project = arrayProjects.find(p => p.id == id)

  project.title = title;

  return res.json(arrayProjects);

});

// Delete um projeto a partir do id
server.delete('/projects/:id', checkIdInArray, (req, res) => {

  const { id } = req.params;

  const index = arrayProjects.findIndex(p => p.id == id);

  arrayProjects.splice(index, 1)

  return res.json(arrayProjects);

});

// Inclui uma tarefa ao projeto
server.post('/projects/:id/tasks', checkIdInArray, (req, res) => {

  const { id } = req.params;
  const { title } = req.body;

  const project = arrayProjects.find(p => p.id == id)

  project.tasks.push(title);

  return res.json(arrayProjects);

});