const { User, Thought } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    createThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: {thoughts: _id }},
                { new: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    // updateThought({ params, body }, res) {
    //     Thought.findOneAndUpdate(
    //         { _id: params.id },
    //         body,
    //         { new: true }
    //     )
    //     .then(dbThoughtData => {
    //         if (!dbThoughtData) {
    //             res.status(404).json({ message: 'No thought found with this id!' })
    //             return;
    //         }
    //         res.json(dbThoughtData);
    //     })
    //     .catch(err => res.status(400).json(err));
    // },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.thoughtId } }
            )
            .then(() => {
                res.json({ message: 'Thought successfully deleted!' });
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
      },

      addReaction({ params, body}, res) {
          Thought.findOneAndUpdate(
              { _id: params.thoughtId },
              { $addToSet: { reactions: body } },
              { new: true, runValidators: true }
          )
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this id!'});
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(500).json(err));
      },
    
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json({ message: 'Reaction successfully deleted! '});
        })
        .catch(err => res.status(500).json(err));
    }
}

module.exports = thoughtController;