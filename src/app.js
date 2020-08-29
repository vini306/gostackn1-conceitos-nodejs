const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function projectExists(request, response, next) {
  const { id } = request.params;
  const found = repositories.find(repository => repository.id == id);

  if (found === undefined) {
    return response.status(400).json({ error: 'Repository does not exists' })
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", projectExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes

  }

  repositories[repositoryIndex] = repositoryUpdated
  return response.json(repositoryUpdated)
});

app.delete("/repositories/:id", projectExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", projectExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex].likes += 1;
  return response.json(repositories[repositoryIndex])
});

module.exports = app;
