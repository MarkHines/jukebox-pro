import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsByTrackId } from "#db/queries/playlists";
import requireUser from "#middleware/requireUser";

router.use(requireUser)

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.get(`/:id/playlists`, async (request, response) => {
  const { id } = request.params
  const track = await getTrackById(id)
  if(!track) return response.status(404).send(`TRACK NOT FOUND`);
  console.log(track)
  const playlists = await getPlaylistsByTrackId(id);
  console.log(playlists)
  response.send(playlists)
})