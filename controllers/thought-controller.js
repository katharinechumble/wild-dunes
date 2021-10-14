const { User, Thought, Types } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
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
        .then(({ _id }) => {
           return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: {thoughts: _id }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
      .catch(err => res.json(err));
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
            return User.findOneAndUpdate(
                { _id: params.username },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            )

        })
        .then(() => {
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
      },

      addReaction({ params, body }, res) {
          Thought.findOneAndUpdate(
              { _id: params.thoughtId },
              { $addToSet: { reactions: body } },
              { new: true }
          )
          .then(dbUserData => {
              if (!dbUserData) {
                  res.status(404).json({ message: 'No user found with this id!'});
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
    
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbUserData => 
            res.json(dbUserData)
        )
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;