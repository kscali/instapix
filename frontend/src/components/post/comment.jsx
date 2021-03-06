import React from "react";
import CommentItem from "./comment_item";
import CommentFollow from "./comment_follow";
import { Link } from "react-router-dom";
import * as heart from "./../../assets/images/heart.png";
import * as redheart from "./../../assets/images/redheart.png";
import * as upload from "./../../assets/images/igupload.png";
import Textarea from 'react-textarea-autosize';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: "",
      likeCount: 0,
      liked: false,
      likers: [],
      comments: [],
      text: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.modalOpen = this.modalOpen.bind(this);
  }

  componentDidMount() {
    if (this.props.post) {
      // debugger
      this.setLocalState();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.comments !== prevProps.comments) {
      this.setLocalState({ comments: this.props.comments });
    }
  }

  setLocalState() {
    this.setState({
      likeCount: this.props.post.likes.length,
      liked: this.props.post.likes.includes(this.props.currentUserId),
      comments: Object.values(this.props.comments),
      likers: this.props.post.likes
    });
  }

  modalOpen() {
    this.props.openLikesModal(this.props.post._id);
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleLike() {
    if (this.state.liked === true) {
      this.props
        .unlikePost({
          postId: this.props.post._id,
          userId: this.props.currentUserId
        })
        .then(() => this.props.fetchPost(this.props.post._id))

        // .then(() =>
        //   this.setState({
        //     liked: false,
        //     likeCount: this.state.likeCount - 1
        //   })
        // );
    } else {
      this.props
        .likePost({
          postId: this.props.post._id,
          userId: this.props.currentUserId
        })
        .then(() => this.props.fetchPost(this.props.post._id))

        // .then(() =>
        //   this.setState({
        //     liked: true,
        //     likeCount: this.state.likeCount + 1,
        //     likers: this.state.likers.concat(this.props.currentUserId)
        //   })
        // );
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props
      .postComment(
        this.props.post._id,
        this.props.currentUserId,
        this.state.text
      )
      // .then(() => this.setState({
      //   comments: this.state.comments.concat({
      //     body: this.state.text,
      //     user: this.props.currentUserId
      //   }),
      //   text: ''
      // }))
      .then(() => (document.getElementById("myTextarea").value = ""));
  }

  render() {
    let { users, post } = this.props;
    let { comments } = this.state;

    let postComments = Object.values(comments).map((comment, id) => {
      let user = users[comment.user];
      return <CommentItem key={id} user={user} comment={comment} />;
    });

    let owner = users[this.props.post.user];
    let currentUser = users[this.props.currentUserId];
    let followButton = "";
    let dot = "";
    if (owner._id !== this.props.currentUserId) {
      followButton = (
        <div className="is-following">
          <CommentFollow owner={owner} currentUser={currentUser} />
        </div>
      );
      dot = " •  ";
    }

    let heartButton = "";
    if (this.state.liked === true) {
      heartButton = (
        <img
          id="like-icon"
          onClick={this.handleLike}
          className="img-heart-icon"
          src={redheart}
          alt="like"
        />
      );
    } else {
      heartButton = (
        <img
          id="like-icon"
          onClick={this.handleLike}
          className="img-heart-icon"
          src={heart}
          alt="like"
        />
      );
    }

    let likeCounter = "";
    if (this.state.likeCount === 1) {
      likeCounter = <h4>{this.state.likeCount} like</h4>;
    } else if (this.state.likeCount > 1) {
      likeCounter = <h4>{this.state.likeCount} likes</h4>;
    }

    let date = "";
    if (post) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let month = parseInt(post.date.slice(5, 7));
      let day = post.date.slice(8, 10);
      let year = post.date.slice(0, 4);
      date = months[month - 1] + " " + day + ", " + year;
    }

    let postDescription;
    if (this.props.post.description === "") {
      postDescription = '';
    } else {
      postDescription = <li className="comment-item">
        <img className="comment-user-pic" src={owner.image_url} alt="img" />
        {<span className="comment-body">
          <strong>
            <span className='post-show-owner'>
              <Link to={`/users/${owner.username}`}>{owner.username}</Link>
            </span>
          </strong>
          {this.props.post.description}
        </span>}
      </li>;
    }

    return (
      <div className="comment-component">
        <div className="page-owner">
          <div className="comment-user-pic">
            <img src={owner.image_url} alt="" />
          </div>
          <div className="owner-names">
            <div className="owner-username">
              <Link to={`/users/${owner.username}`}>{owner.username}</Link>
              {dot}
            </div>
            <div className="full-name">{owner.name}</div>
          </div>
          {followButton}
          {/* {owner._id !== this.props.currentUserId ? (
            <div className="is-following">
              <CommentFollow owner={owner} currentUser={currentUser} />
            </div>
          ) : (
            " •  "
          )} */}
        </div>
        <ul className="comment-index-component">
          {postDescription}
          {postComments}
        </ul>
        <footer className="post-footer-show">
          <section className="icons-div">
            <div className="like-icon">
              <button className="icon-btn">{heartButton}</button>
            </div>
            <div className="share-icon">
              <img className="share" src={upload} alt="share" />
            </div>
          </section>
          <section className="likes-section" onClick={this.modalOpen}>
            {likeCounter}
          </section>
          <div className="post-item-date">
            <h4>{date}</h4>
          </div>
        </footer>
        <div className="post-comment-form">
          <form onSubmit={this.handleSubmit}>
            <div>
              <Textarea
                className="textarea-auto"
                rows="5"
                cols="35"
                placeholder="Add a comment..."
                onChange={this.handleChange}
                id="myTextarea"
              />
            </div>
            <button
              className={!this.state.text ? "disabled" : ""}
              disabled={!this.state.text}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default Comment;
