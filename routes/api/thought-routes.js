const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    //updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThoughts);

router.route('/:userid')
    .post(createThought);
    //.put(updateThought)

router.route('/:thoughtId')
    .get(getThoughtById)
    .put(createThought)
    .delete(deleteThought);

router.route('/:thoughtId/reactions/')
    .post(addReaction)
    .delete(deleteReaction);

module.exports = router;