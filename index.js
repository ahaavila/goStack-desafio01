const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Routes

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'The project does not exists'});
  }

  return next();
};

function logRequests(req, res, next) {
  console.count("Número de requisições: ");

  return next();
}

server.use(logRequests);


// Criando um projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// Listando todos os projetos e tarefas
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Alterando um projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id); // Pega o titulo que veio com o id no parametros

  project.title = title;

  return res.json(project);
});

// Deletando um projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.json({ error: "Project has been deleted" });
});

// Adicionando as tarefas
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});



server.listen(3000);