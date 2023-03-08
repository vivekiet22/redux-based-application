import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectUserById } from "./userSlice";
import { selectAllPost } from "../posts/postSlice";

export const UserPage = ({match})=>{
    const {userId} = match.params
    const user = useSelector(state=>selectUserById(state,userId))
    
    const postForUser = useSelector(state=>{
        const allPosts = selectAllPost(state)
        return allPosts.filter(post=>post.user === userId)
    })
    const postTitles = postForUser.map(post=>(
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))
    return (
        <section>
            <h2>{user.name}</h2>
            <ul>{postTitles}</ul>
        </section>
    )



}