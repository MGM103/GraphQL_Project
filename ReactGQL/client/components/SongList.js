import React from "react";
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const query = gql`
    {
        songs {
            id,
            title
        }
    }
`

const SongList = (props) => {
    const renderSongs = () => {
        return props.data.songs.map(song => {
            return (
                <li key={song.id} className="collection-item">{song.title}</li>
            )
        });
    }

    if(props.data.loading) {return (<div>Loading...</div>)}

    return (
        <div>
            <h3>Song List</h3>
            <ul className="collection">
                {renderSongs()}
            </ul>
        </div>
    )
}

export default graphql(query)(SongList);
