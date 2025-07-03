import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylistByUserId,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

router.use(requireUser)

router.get(`/`, async (req, res) => {
    //console.log(req.user)
    const playlist = await getPlaylistByUserId(req.user.id);
    //console.log(playlist)
    res.send(playlist);
  })
router.post(`/`, 
  requireBody(["name", "description"]),
  async (req, res) => {
    const { name, description } = req.body
    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(401).send("Playlist not found.");

  if(playlist.user_id !== req.user.id) return res.status(403).send(`YOU DON"T OWN THIS PLAYLIST`)

  req.playlist = playlist;
  next();
});

router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });
