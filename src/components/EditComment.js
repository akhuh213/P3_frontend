import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {useHistory, Link} from 'react-router-dom'


const EditComment = (props) => {
    let [descriptionsAndCode, setDescriptionsAndCode] = useState("") 
    let history = useHistory()

    let referencedComment = props.location.state;
    let referencedPost = props.location.postId;

    let submitForm = (e) => {
        e.preventDefault()
        // passing state variable works for key and value pair
        let author = props.user.id
        let editComment = { descriptionsAndCode, author, referencedComment}
        console.log(editComment);
        axios.put(`${process.env.REACT_APP_SERVER_URL}/api/posts/${referencedPost}/comments/edit`, editComment)
        .then(()=> {
            setDescriptionsAndCode("")
            history.goBack()
        })
        .catch(error => console.log(error))
    }
    
    const errorDiv = () =>
    {
        return(
            <div className="text-center pt-4">
                <h3>Please <Link to="/login">login</Link> to edit your post</h3>
            </div>
        );
    };

    return (
        <div>
            {props.user 
            ?
                <form onSubmit={submitForm}>
                    <div className="form-group col-md-6">
                        <label htmlFor="descriptionsAndCode">Description or Code</label>
                            <textarea type="text" name="descriptionsAndCode" value={descriptionsAndCode} onChange={(e) => {setDescriptionsAndCode([e.target.value])}} className="form-control" required/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            :
                <>
                    {errorDiv()}
                </>
            }
        </div>
    )
}

export default EditComment