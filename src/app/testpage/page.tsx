"use client"

import { useEffect, useState } from "react";

export default function TestPage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/items/')
            .then(response => response.json())
            .then(data => setItems(data));
    }, []);

    return (
        <>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.name}: {item.description}</li>
                ))}
            </ul>
        </>
    )
}