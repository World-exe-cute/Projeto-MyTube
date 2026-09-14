import "./FeedPost.css";

import PostInfo from "./SubPosts/PostInfo";

export default function FeedPost({ postInfo, observer }) {
  return (
    <div ref={observer} className="post-component">
      <PostInfo
        params={{ id: postInfo.postId, user: postInfo.userTag }}
        comment={true}
      />
    </div>
  );
}
