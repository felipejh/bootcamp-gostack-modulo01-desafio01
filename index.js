const express = require('express');

const server = express();

server.use(express.json());

server.listen(3000);

const arrayProjects = [];

// Middleware para mostrar quantas vezes foram feitas requisições
let qtdReq = 1;
server.use((req, res, next) => {
  console.time('Request')
  console.log(`Método: ${req.method}; URL: ${req.url}`)
  console.log(`Quantidade de requisições: ${qtdReq}`)

  qtdReq++;

  next();

  console.timeEnd('Request')
})

server.post('/projects', (req, res) => {

  const project = req.body;

  arrayProjects.push(project);

  return res.send('Incluído com sucesso');

});

server.get('/projects', (req, res) => {

  return res.json(arrayProjects);

});

server.put('/projects/:id', checkTitleRequired, checkIdInArray, (req, res) => {

  arrayProjects.forEach((element, index) => {

    const { id } = element;
    const { title } = req.body;

    if (id == req.params.id) {
      const project = arrayProjects[index]
      project.title = title;

      arrayProjects[index] = project
    }

  })
  return res.json(arrayProjects);

});

server.delete('/projects/:id', checkIdInArray, (req, res) => {

  arrayProjects.forEach((element, index) => {
    const { id } = element;

    if (id == req.params.id) {
      arrayProjects.splice(index, 1);
    }

  })

  return res.json(arrayProjects);

});

server.post('/projects/:id/tasks', checkIdInArray, (req, res) => {
  const { title } = req.body

  arrayProjects.forEach((element, index) => {

    const { id } = element;

    if (id == req.params.id) {
      const project = arrayProjects[index]
      project.tasks = title;

      arrayProjects[index] = project
    }

  })
  return res.json(arrayProjects);

})

function checkTitleRequired(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" })
  }

  return next();
}

function checkIdInArray(req, res, next) {

  let indExiste = 0;
  arrayProjects.forEach((element, index) => {

    const { id } = element;

    if (id == req.params.id) {
      indExiste = 1;
    }

  })

  if (indExiste === 0) {
    return res.status(400).json({ error: "ID not exists in array." })
  }

  return next();
}