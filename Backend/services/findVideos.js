const Video = require("../models/Video");
const User = require("../models/User");
const mongoose = require("mongoose");

async function findVideos(
  query,
  token,
  restrict,
  skip,
  frontTag,
  frontHash,
  dateOrder,
) {
  switch (query) {
    case "inscription":
      const videoInscription = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(token.id),
            ...(restrict === "active" && { videoTag: { $nin: ["adult"] } }),
            "videoUrl.hash": { $nin: frontHash },
          },
        },
        {
          $lookup: {
            from: "videos",
            let: {
              subs: {
                $map: {
                  input: "$inscription",
                  as: "sub",
                  in: "$$sub.userId",
                },
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$userId", "$$subs"] },
                  public: true,
                },
              },
              {
                $project: {
                  _id: 0,
                  "videoUrl.thumb": 0,
                  "videoUrl.name": 0,
                  videoSize: 0,
                  videoName: 0,
                  updatedAt: 0,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        name: 1,
                        idTag: 1,
                        "photoUrl.photo": 1,
                        like: 1,
                        myInscription: 1,
                      },
                    },
                  ],
                  as: "userId",
                },
              },
              { $unwind: "$userId" },

              {
                $lookup: {
                  from: "users", //users
                  localField: "comments.userId",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        name: 1,
                        "photoUrl.photo": 1,
                      },
                    },
                  ],
                  as: "commentUsers",
                },
              },

              { $project: { commentUsers: 0 } },
            ],
            as: "videos",
          },
        },
        {
          $unwind: "$videos",
        },
        {
          $replaceRoot: { newRoot: "$videos" },
        },
        {
          $skip: skip,
        },
        {
          $limit: 15,
        },
      ]);
      return videoInscription;
    case "home":
      let newVideo;
      let moreVideoHome;
      const hash = [...frontHash];

      const videoHome = await Video.find({
        public: true,
        videoTag: {
          $in: frontTag.slice(0, 3),
          ...(restrict === "active" && { $nin: ["adult"] }),
        },
        "videoUrl.hash": { $nin: hash },
      })
        .select(
          "-_id -comments -videoUrl.thumb -videoUrl.name -videoSize -videoName -updatedAt",
        )
        .sort({ createdAt: dateOrder ? 1 : -1 })
        .limit(16)
        .populate("userId", "photoUrl.photo like myInscription name idTag -_id")
        .lean();
      if (videoHome.length < 16) {
        videoHome.forEach((e) => {
          hash.push(e.videoUrl.hash);
        });
        const videoLength = 16 - videoHome.length;

        moreVideoHome = await Video.find({
          public: true,
          videoTag: {
            $in: frontTag.slice(3),
            ...(restrict === "active" && { $nin: ["adult"] }),
          },
          "videoUrl.hash": { $nin: hash },
        })
          .select(
            "-_id -videoUrl.thumb -videoUrl.name -videoSize -videoName -updatedAt",
          )
          .sort({ createdAt: dateOrder ? 1 : -1 })
          .limit(videoLength)
          .populate("userId", "photoUrl.photo like myInscription name idTag")
          .populate("comments.userId", "name photoUrl.photo")
          .lean();

        newVideo = [...videoHome, ...moreVideoHome];
      } else {
        newVideo = videoHome;
      }

      if (newVideo.length < 16) {
        moreVideoHome.forEach((e) => {
          hash.push(e.videoUrl.hash);
        });
        const videoLength = 16 - newVideo.length;

        const lastVideoHome = await Video.find({
          public: true,
          ...(restrict === "active" && { videoTag: { $nin: ["adult"] } }),
          "videoUrl.hash": { $nin: hash },
        })
          .select(
            "-_id -videoUrl.thumb -videoUrl.name -videoSize -videoName -updatedAt",
          )
          .sort({ createdAt: dateOrder ? 1 : -1 })
          .limit(videoLength)
          .populate("userId", "photoUrl.photo like myInscription name idTag")
          .populate("comments.userId", "name photoUrl.photo")
          .lean();

        newVideo = [...newVideo, ...lastVideoHome];
      }
      return newVideo;
    case "search":
      const searchVideos = await Video.aggregate([
        {
          $match: {
            public: true,
            ...(restrict === "active" && { videoTag: { $nin: ["adult"] } }),
            "videoUrl.hash": { $nin: frontHash },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "_id",
            as: "commentsUsers",
          },
        },
        {
          $addFields: {
            score: {
              $add: [
                {
                  $multiply: [
                    5,
                    {
                      $size: {
                        $filter: {
                          input: frontTag,
                          as: "word",
                          cond: {
                            $regexMatch: {
                              input: "$title",
                              regex: "$$word",
                              options: "i",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  $multiply: [
                    1,
                    {
                      $size: {
                        $filter: {
                          input: frontTag,
                          as: "word",
                          cond: {
                            $in: [
                              { $toLower: "$$word" },
                              {
                                $map: {
                                  input: { $ifNull: ["$videoTag", []] },
                                  as: "tag",
                                  in: { $toLower: "$$tag" },
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  $multiply: [
                    10,
                    {
                      $size: {
                        $filter: {
                          input: frontTag,
                          as: "word",
                          cond: {
                            $regexMatch: {
                              input: "$userId.name",
                              regex: "$$word",
                              options: "i",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        { $sort: { score: -1, _id: 1 } },
        { $skip: skip },
        { $limit: 8 },
        {
          $project: {
            _id: 0,
            like: 1,
            videoTag: 1,
            view: 1,
            dislike: 1,
            createdAt: 1,
            description: 1,
            videoName: 1,
            public: 1,
            videoName: 1,
            title: 1,
            videoUrl: {
              hash: 1,
              type: 1,
            },
            userId: {
              photoUrl: { photo: 1 },
              like: 1,
              myInscription: 1,
              name: 1,
              idTag: 1,
            },
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  text: "$$comment.text",
                  userId: {
                    $let: {
                      vars: {
                        user: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$commentsUsers",
                                as: "userComm",
                                cond: {
                                  $eq: ["$$userComm._id", "$$comment.userId"],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: {
                        name: "$$user.name",
                        photoUrl: "$$user.photoUrl.photo",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]);
      return searchVideos;
  }
}

module.exports = { findVideos };
