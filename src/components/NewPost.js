import React, { useState, useEffect } from 'react' ;
import axios from 'axios';
// import loadingGif from './spinner.gif';
import { Link, useHistory } from 'react-router-dom';



const NewPostForm = (props) => {
    let [title, setTitle]= useState("")
    let [tags, setTags] = useState([])
    let [descriptionAndCode, setDescriptionAndCode] = useState("")
    let [loading, setLoading] = useState(false)
    let [imgUrl, setImgUrl] = useState("");
    let [allTags, setAllTags] = useState("");
    let history = useHistory()

    useEffect(() =>
    {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tags`)
        .then(response =>
        {
            console.log(response.data);
            setAllTags(response.data);
        });
    }, []);
    
 
    const errorDiv = () =>
    {
        return(
            <div className="text-center pt-4">
                <h3>Please <Link to="/login">login</Link> to create a new post</h3>
            </div>
        );
    };

    let uploadImage = async e => {
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'scft486b')
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/dc8ufznd0/image/upload`,
            {
                method: 'POST',
                body: data
            }
        )
        const file = await res.json() 
        setImgUrl(file.secure_url)
        setLoading(false)
        console.log(file.secure_url)       
    }

    let submitForm = (e) => {
        e.preventDefault()
        // passing state variable works for key and value pair
        console.log(tags);
        let author = props.user.id;
        let newPost = { title, descriptionAndCode, tags, author, imgUrl }
        console.log(author);
        console.log(newPost)

        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/posts/`, newPost)
        .then(()=> {
            setTitle("")
            setTags()
            setDescriptionAndCode("")
            setImgUrl("")
                     
            // setAuthor(props.user.id);
           history.push("/allPosts")
        })
        .catch(error => console.log(error))
        }

    return (
        <>
            {props.user 
            ?
                <>
                    {allTags ? 
                        <div className="row mt-4">
                            <div className="col-md-7 offset-md-3">
                                <div className="card card-body">
                                    <h2>Post your question</h2>
                                    <form onSubmit={submitForm}>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="title">Title</label>
                                                <input type="title" name="title" value={title} onChange={(e) => {setTitle(e.target.value)}} className="form-control" required/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="descriptionAndCode">Description or Code</label>
                                                <textarea type="text" name="descriptionAndCode" value={descriptionAndCode} onChange={(e) => {setDescriptionAndCode([e.target.value])}} className="form-control" required/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="image">Code Image</label>
                                                <input type="file" name="image" onChange={uploadImage} className="form-control" multiple/>
                                        </div>                                
                                        <h5>Tags (choose 5 tags max)</h5>
                                        {allTags.map((eachTag, idx) =>
                                        {
                                            return(
                                                <div key={idx} className="form-check form-check-inline">
                                                    <input type="checkbox" name={"tag-" + eachTag.name} value={eachTag._id} onChange={(e) => {
                                                        if(e.target.checked) 
                                                        {
                                                            if (tags.length >= 5) {
                                                                alert("Max 5 tags!")
                                                                e.preventDefault()
                                                                return
                                                            }
                                                            let newTags = []
                                                            newTags = newTags.concat(tags,[e.target.value] )
                                                            console.log(newTags)
                                                            setTags(newTags) 
                                                        } 
                                                        else 
                                                        {
                                                            let newTags = []
                                                            newTags = tags.filter((t)=>{
                                                                return t !== e.target.value

                                                            })
                                                            setTags(newTags)
                                                        }
                                                                }} />
                                                    <label className="form-check-label" htmlFor={"tag-" + eachTag.name}>{eachTag.name}</label>
                                                </div>
                                            )
                                        })}

                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                  
                                </div>
                            </div>
                        </div>
                        :
                        <h3>Loading...</h3>
                    }
                </>
            :
                <>{errorDiv()}</>
            }
        </>

    )
  
}

export default NewPostForm;