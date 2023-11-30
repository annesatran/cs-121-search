import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from "axios"

import { IoSearch } from "react-icons/io5";

import "../App.css"

export default function SearchPage() {

    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState({})
    const [querySent, setQuerySent] = React.useState(false)

    const handleOnInputChange = (evt) => {
        setQuery(evt.target.value)
    }

    const handleOnFormSubmit = async (evt) => {
        evt.preventDefault() // check without this?
        submitQuery(query)
    }

    const submitQuery = async () => {
        console.log("submitted query "+query)
        sendQueryRequest()
    }

    const sendQueryRequest = async () => {
        try {
            const { data } = await axios.get(`https://annesatran.pythonanywhere.com/`, {
                params: {
                  query: query,
                  limit: 5,
                  boolean_and: 1
                }
              })

            console.log(JSON.stringify(data))
            setResults(data)
            setQuerySent(true)

        } catch (err) {
            console.error(err)
        }
    };

    return (
        <div className="body">
            <SearchBar
                handleOnInputChange={handleOnInputChange}
                handleOnFormSubmit={handleOnFormSubmit} />
            <SearchResults
                results={results}
                querySent={querySent}/>
        </div>
    )
}

export function SearchBar({handleOnInputChange, handleOnFormSubmit}) {
    return (
        <div className="searchbar">
            <Form onSubmit={(evt) => {handleOnFormSubmit(evt)}}>
                <Form.Control id="search-form" className="container searchbar-item"
                    type="search" 
                    placeholder="search :3c" 
                    onChange={(evt) => {handleOnInputChange(evt)}}
                />
                <Button id="search-btn" className="container searchbar-item"
                    onClick={(evt) => {handleOnFormSubmit(evt)}}>
                    <IoSearch/>
                </Button>
            </Form>
        </div>
    )
}

export function SearchResults({querySent=false, results={}}) {
    if (Object.keys(results).length === 0 && querySent) {
        return (
            <p>Sorry! No results found.</p>
        )
    }

    return (
        <div className="search-results">
            {Object.entries(results).map(([key, value]) => (
                    <ResultEntry
                        key={key}
                        url={value}>
                    </ResultEntry>
            ))}
        </div>
    )
}

export function ResultEntry({url=""}) {
    return (
        <a href={url} className="container result-entry">
            {url}
        </a>
    )
}