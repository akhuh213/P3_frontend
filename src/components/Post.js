import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import NewComment from './NewComment'
import axios from 'axios';

function Post(props) {
    let referencedPost = props.location.state;
    let [post, setPost] = useState();
    let history = useHistory();

    useEffect(() =>
    {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/posts/${referencedPost._id}`)
        .then(response =>
        {
            console.log(response.data);
            setPost(response.data);
        });
    }, []);

    let location = 
    {
        pathname: `/post/edit`,
        state: post
    }
    
    // const postComments = () =>
    // {
    //     post.comments.map((c, idx) =>
    //     {
    //         return(
    //             <div key={idx}>
    //                 {c.descriptionsAndCode}
    //                 <br />
    //                 {/* {c.author.name} */}
    //                 <br />
    //                 <hr />
    //             </div>
    //             //edit n delete
    //         )
    //     });
    // }

    //delete post
    const deletePost = () => {
        axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/posts/${referencedPost._id}`)
        .then(response =>
        {
            console.log(response.data);
            history.push('/allPosts')
        });
    }

    return(
        <div>
            {post ? 
                <div>
                    <h3>We are looking at a specific post</h3>
                    <p>Title: {post.title}</p>
                    <p>Tags: {post.tags.map((p, idx)=>{
                        
                        return <li key={idx}>{p.name}</li>
                        
                    })
                    }</p>
                    <p>Description: {post.descriptionAndCode}</p>
                    <p>Author: {post.author.name ? post.author.name : "No Author Data Available"}</p>
                    {/* {console.log(post.author.name)} */}
                    {/* <p>{post.upvote}</p> */}
                    {/* <p>{post.downvote}</p> */}
                    <p>Status: {post.solve ? "SOLVED" : "NOT SOLVED"}</p>
                    <p>Date: {post.date}</p>

                    {/* post author has option to delete or edit post */}
                    {props.user && props.user.id === post.author._id
                    ?
                        <div className="edit-and-delete">
                            <Link to={location} key={post._id}>Edit</Link>
                            <button onClick={deletePost}>Delete</button>
                        </div>
                    :
                        <div className="edit-and-delete"></div>
                    }

                    <hr />
                    <h5>Comments</h5>
                    <br />
                    {post.comments.map((c, idx) =>
                    {
                        return(
                            <div key={idx}>
                                {c.descriptionsAndCode}
                                <br />
                                {/* {c.author.name} */}
                                <br />
                                <hr />
                            </div>
                            //edit n delete
                        )
                    })}
                    <NewComment {...props} postId={post._id}/>
                </div>
            : 
                <h3>Loading...</h3>
            }
        </div>
    )
}

export default Post