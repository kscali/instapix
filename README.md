# Instapix

Instapix is a photo sharing site inspired by Instagram

Please visit the live site [here](http://insta-pix.herokuapp.com)

![alt text](https://ks-plt.s3-us-west-1.amazonaws.com/instapix/Screen+Shot+2019-06-24+at+1.40.57+PM.png "Instapix")

## Technologies:

- JavaScript
- React
- Redux
- MongoDB
- Node

## Functionality and MVP

### Sign In/ Sign Up / Demo User

Users are able to sign in, sign up, or use the demo user account to browse the site.

![alt text](https://ks-plt.s3-us-west-1.amazonaws.com/instapix/Screen+Shot+2019-06-24+at+1.38.41+PM.png "Instapix Sign up")

### User Dashboard

![alt text](https://ks-plt.s3-us-west-1.amazonaws.com/instapix/Screen+Shot+2019-06-24+at+1.42.05+PM.png"Instapix Profile")

## Code Snippet

#### feed.js

```
import React from "react";
import PostItem from "./post_item_container";
import SideBar from "./sidebar";
import "./../../assets/stylesheets/feed.css";
import Suggestions from "./suggestions";
import { MoonLoader } from "react-spinners";
import { css } from "@emotion/core";
import InfiniteScroll from "react-infinite-scroll-component";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      users: [],
      comments: []
    };
    this.fetchMoreData = this.fetchMoreData.bind(this);
  }

  componentDidMount() {
    let that = this;
    this.props.fetchUsers().then(() => {
      that.props.fetchPosts().then(() => {
        that.setState({
          posts: that.props.posts,
          users: that.props.users,
          comments: that.props.comments
        });
      });
    });
  }

  fetchMoreData() {
    let numPosts = this.state.posts.length;
    this.props.fetchMorePosts(numPosts).then(() => {
      this.setState({
        posts: this.props.posts,
        users: this.props.users,
        comments: this.props.comments
      });
    });
  }

  render() {
    const { posts, users, comments } = this.state;
    if (users.length === 0) {
      return (
        <div className="stock-loading">
          <MoonLoader
            className={override}
            sizeUnit={"px"}
            size={25}
            color={"#312F2D"}
            loading={true}
          />
        </div>
      );
    }
    let feed = "";
    if (this.props.posts.length > 0) {
      feed = (
        <ul className="feed-list">
          {posts.map((post, i) => {
            let user = users.filter(user => user._id === post.user)[0];
            return (
              <li className="pitems" key={i}>
                <PostItem
                  post={post}
                  user={user}
                  users={users}
                  comments={comments}
                />
              </li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <div className="outer-feed-container">
          <Suggestions />
        </div>
      );
    }

    return (
      <div className="outer-feed-container ">
        <div className="feed-div ">
          <InfiniteScroll
            dataLength={this.state.posts.length}
            next={this.fetchMoreData}
            hasMore={true}
          >
            {feed}
          </InfiniteScroll>
        </div>
        <div>
          <SideBar />
        </div>
      </div>
    );
  }
}

export default Feed;

```

### Comments

Users can comment on photos

### Images

- Users can upload images
- Users can edit images
- Photos can have a description (optional)

### Following / Photo Feed

- Users can follow other users
- Users can unfollow other users
- Followed users images appear in photo feed

### Collaborators

#### Koy Saeteurn

#### Martin Markay

#### Chris Meurer

#### Sergey Gridin
