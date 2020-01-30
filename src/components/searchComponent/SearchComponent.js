import React from 'react';


const SearchComponent = (props) => (

    <div >

        <form className="form-autocomplite " getFriendsSearch={event => props.getFriendsSearch(event.target.value)}>
            <input type="search" id="search"  value={props.query} placeholder="Начните вводить.." autoComplete="off" />

        </form>
    </div>
);  


export default SearchComponent;