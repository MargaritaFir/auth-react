import React from 'react';


const SearchComponent = (props) => (

    <div className='form-autocomplite'>

         <input  id="search" value={props.query} placeholder="Начните вводить.." autoComplete="off" onChange={ (e) => props.onInput(e)} />
        
    </div>
);  


export default SearchComponent;