import express from 'express';
const usersRouter = express.Router();
export default usersRouter;

import requireBody from '#middleware/requireBody';
import { createUser, getUserByUsernameAndPassword } from '#db/queries/users';
import { createToken } from '#utils/jwt';


usersRouter.post(`/register`,
  requireBody(["username", "password"]),
  async (request, response) => {
    const { username, password } = request.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id})
    response.status(201).send(token)
  }
);

usersRouter.post(`/login`,
  requireBody(["username", "password"]),
  async (request, response) => {
    const { username, password } = request.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if(!user) return response.status(401).send(`INVALID USERNAME OR PASSWORD`)
    
    const token = createToken({ id: user.id});
    response.status(200).send(token)
  }
)